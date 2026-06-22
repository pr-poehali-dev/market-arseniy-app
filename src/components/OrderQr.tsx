import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface OrderQrProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  items: string[];
  sum: number;
  status: string;
}

const OrderQr = ({ open, onClose, orderId, items, sum, status }: OrderQrProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const data = JSON.stringify({ order: orderId, sum, status });
    QRCode.toCanvas(canvasRef.current, data, {
      width: 220,
      margin: 2,
      color: { dark: '#3b0764', light: '#ffffff' },
    });
  }, [open, orderId, sum, status]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `order-${orderId}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl p-0 overflow-hidden border-border max-w-sm">
        <div className="gradient-brand p-6 text-white text-center">
          <Icon name="Package" size={32} className="mx-auto mb-2" />
          <h2 className="font-display font-extrabold text-xl">QR-код заказа</h2>
          <p className="text-white/80 text-sm mt-1">Покажи при получении</p>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-border">
            <canvas ref={canvasRef} className="block" />
          </div>

          <div className="w-full text-center">
            <p className="font-display font-bold text-lg">Заказ №{orderId}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{items.join(' · ')}</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <Badge className={`border-0 text-white text-xs ${status === 'Доставлен' ? 'bg-accent' : 'bg-secondary'}`}>
                {status}
              </Badge>
              <span className="font-bold gradient-text">{sum.toLocaleString('ru')} ₽</span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button onClick={handleDownload} variant="outline" className="rounded-full flex-1">
              <Icon name="Download" size={16} className="mr-1" /> Сохранить
            </Button>
            <Button onClick={onClose} className="rounded-full gradient-brand border-0 flex-1">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderQr;
