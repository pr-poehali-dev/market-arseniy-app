import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface QrScannerProps {
  open: boolean;
  onClose: () => void;
}

const QrScanner = ({ open, onClose }: QrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setResult(null);
    setError(null);

    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const AnyWindow = window as unknown as { BarcodeDetector?: new (opts?: unknown) => { detect: (v: unknown) => Promise<{ rawValue: string }[]> } };
        if (AnyWindow.BarcodeDetector) {
          const detector = new AnyWindow.BarcodeDetector({ formats: ['qr_code'] });
          const scan = async () => {
            if (cancelled || !videoRef.current) return;
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes.length > 0) {
                setResult(codes[0].rawValue);
                stop();
                return;
              }
            } catch {
              /* кадр пропускаем */
            }
            rafRef.current = requestAnimationFrame(scan);
          };
          rafRef.current = requestAnimationFrame(scan);
        } else {
          setError('Ваш браузер не поддерживает автосканирование. Откройте сайт в Chrome на Android.');
        }
      } catch {
        setError('Нет доступа к камере. Разрешите доступ в настройках браузера.');
      }
    };

    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };

    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl p-0 overflow-hidden border-border max-w-sm">
        <div className="p-5 pb-3">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Icon name="ScanLine" className="text-primary" size={22} />
            Сканер QR-кода
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Наведите камеру на QR-код товара или заказа</p>
        </div>

        <div className="relative mx-5 aspect-square rounded-2xl overflow-hidden bg-black">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          {!result && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-44 h-44 border-4 border-white/90 rounded-2xl relative">
                <div className="absolute left-0 right-0 h-0.5 gradient-brand animate-scan" />
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-muted">
              <Icon name="CameraOff" className="text-muted-foreground mb-2" size={40} />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}
          {result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gradient-brand text-white">
              <Icon name="CircleCheck" size={48} className="mb-3" />
              <p className="font-display font-bold mb-1">Код распознан!</p>
              <p className="text-sm break-all opacity-90">{result}</p>
            </div>
          )}
        </div>

        <div className="p-5 flex gap-3">
          {result ? (
            <Button onClick={() => setResult(null)} className="flex-1 rounded-full gradient-brand border-0">
              <Icon name="RotateCcw" size={16} className="mr-1" /> Сканировать ещё
            </Button>
          ) : (
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-full">
              Закрыть
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrScanner;
