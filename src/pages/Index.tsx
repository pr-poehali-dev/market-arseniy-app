import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import QrScanner from '@/components/QrScanner';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  rating: number;
}

const INIT_PRODUCTS: Product[] = [
  { id: 1, name: 'Кроссовки Arsenia Air', price: 7990, oldPrice: 11990, category: 'Обувь', rating: 4.9, image: 'https://cdn.poehali.dev/projects/a889af40-1b44-4fcc-85b7-fde2e8cdbf20/files/2aa297e6-df5c-4c07-9c91-e82cd23e6706.jpg' },
  { id: 2, name: 'Наушники Arsenia Beat', price: 5490, oldPrice: 8990, category: 'Электроника', rating: 4.8, image: 'https://cdn.poehali.dev/projects/a889af40-1b44-4fcc-85b7-fde2e8cdbf20/files/ef33bfa2-481e-4329-8518-864183af0092.jpg' },
  { id: 3, name: 'Часы Arsenia Watch', price: 12990, oldPrice: 17990, category: 'Электроника', rating: 5.0, image: 'https://cdn.poehali.dev/projects/a889af40-1b44-4fcc-85b7-fde2e8cdbf20/files/640021b8-f13d-4b35-831b-05ae0af43cc7.jpg' },
  { id: 4, name: 'Кроссовки Arsenia Pro', price: 9490, category: 'Обувь', rating: 4.7, image: 'https://cdn.poehali.dev/projects/a889af40-1b44-4fcc-85b7-fde2e8cdbf20/files/2aa297e6-df5c-4c07-9c91-e82cd23e6706.jpg' },
  { id: 5, name: 'Наушники Arsenia Lite', price: 3990, oldPrice: 5990, category: 'Электроника', rating: 4.6, image: 'https://cdn.poehali.dev/projects/a889af40-1b44-4fcc-85b7-fde2e8cdbf20/files/ef33bfa2-481e-4329-8518-864183af0092.jpg' },
  { id: 6, name: 'Часы Arsenia Sport', price: 8990, category: 'Электроника', rating: 4.8, image: 'https://cdn.poehali.dev/projects/a889af40-1b44-4fcc-85b7-fde2e8cdbf20/files/640021b8-f13d-4b35-831b-05ae0af43cc7.jpg' },
];

interface PublicOrder {
  id: string;
  user: string;
  avatar: string;
  date: string;
  items: string[];
  sum: number;
  status: string;
  comment: string;
}

const INIT_PUBLIC_ORDERS: PublicOrder[] = [
  { id: 'p1', user: 'Мария К.', avatar: 'М', date: '21 июня', items: ['Кроссовки Arsenia Air', 'Наушники Arsenia Beat'], sum: 13480, status: 'Доставлен', comment: 'Всё пришло быстро, качество супер! 🔥' },
  { id: 'p2', user: 'Дима Р.', avatar: 'Д', date: '20 июня', items: ['Часы Arsenia Watch'], sum: 12990, status: 'В пути', comment: 'Жду с нетерпением, упаковка была отличной!' },
  { id: 'p3', user: 'Арсений', avatar: 'А', date: '18 июня', items: ['Кроссовки Arsenia Pro', 'Часы Arsenia Sport'], sum: 18480, status: 'Доставлен', comment: 'Мой любимый маркет 😍 Советую всем!' },
];

const CATEGORIES = ['Все', 'Обувь', 'Электроника'];

type Tab = 'home' | 'catalog' | 'cart' | 'profile' | 'orders' | 'feed' | 'payment' | 'about' | 'admin';

interface CartItem extends Product { qty: number; }

const Index = () => {
  const [tab, setTab] = useState<Tab>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState('Все');
  const [search, setSearch] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(INIT_PRODUCTS);
  const [publicOrders, setPublicOrders] = useState<PublicOrder[]>(INIT_PUBLIC_ORDERS);

  const addToCart = (p: Product) =>
    setCart((c) => {
      const ex = c.find((i) => i.id === p.id);
      if (ex) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...p, qty: 1 }];
    });

  const changeQty = (id: number, d: number) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const removeFromCart = (id: number) => setCart((c) => c.filter((i) => i.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const filtered = products.filter(
    (p) =>
      (category === 'Все' || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (p: Omit<Product, 'id' | 'rating'>) => {
    setProducts((prev) => [...prev, { ...p, id: Date.now(), rating: 5.0 }]);
  };

  const handleDeleteProduct = (id: number) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleEditProduct = (updated: Product) =>
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const handlePublishOrder = (order: Omit<PublicOrder, 'id' | 'date'>) => {
    setPublicOrders((prev) => [{ ...order, id: `p${Date.now()}`, date: 'Только что' }, ...prev]);
  };

  const nav: { key: Tab; label: string; icon: string }[] = [
    { key: 'home', label: 'Главная', icon: 'House' },
    { key: 'catalog', label: 'Каталог', icon: 'LayoutGrid' },
    { key: 'feed', label: 'Лента', icon: 'Rss' },
    { key: 'orders', label: 'Заказы', icon: 'Package' },
    { key: 'about', label: 'О магазине', icon: 'Info' },
    { key: 'admin', label: 'Админка', icon: 'ShieldCheck' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-4">
          <button onClick={() => setTab('home')} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <Icon name="Sparkles" className="text-white" size={20} />
            </div>
            <span className="font-display font-extrabold text-xl">
              Маркет <span className="gradient-text">Арсения</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === n.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQrOpen(true)}>
              <Icon name="ScanLine" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setTab('profile')}>
              <Icon name="User" size={20} />
            </Button>
            <Button onClick={() => setTab('cart')} className="rounded-full gradient-brand border-0 relative">
              <Icon name="ShoppingCart" size={18} />
              <span className="ml-1 hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {nav.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                tab === n.key ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container py-8">
        {tab === 'home' && <Home onShop={() => setTab('catalog')} onFeed={() => setTab('feed')} products={products} addToCart={addToCart} />}
        {tab === 'catalog' && (
          <Catalog products={filtered} addToCart={addToCart} category={category} setCategory={setCategory} search={search} setSearch={setSearch} />
        )}
        {tab === 'cart' && (
          <CartView cart={cart} total={cartTotal} changeQty={changeQty} remove={removeFromCart} onCheckout={() => setTab('payment')} onShop={() => setTab('catalog')} />
        )}
        {tab === 'payment' && <Payment total={cartTotal} count={cartCount} cart={cart} onPublish={handlePublishOrder} onDone={() => { setCart([]); setTab('feed'); }} />}
        {tab === 'profile' && <Profile onOrders={() => setTab('orders')} onFeed={() => setTab('feed')} />}
        {tab === 'orders' && <Orders onPublish={handlePublishOrder} onFeed={() => setTab('feed')} />}
        {tab === 'feed' && <Feed orders={publicOrders} />}
        {tab === 'about' && <About />}
        {tab === 'admin' && <Admin products={products} onAdd={handleAddProduct} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container py-8 text-center text-muted-foreground text-sm">
          <p className="font-display font-bold text-base text-foreground mb-1">Маркет Арсения</p>
          © 2026 — модный маркетплейс. Сделано с любовью.
        </div>
      </footer>

      <QrScanner open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
};

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 text-amber-400">
    <Icon name="Star" size={14} className="fill-amber-400" />
    <span className="text-xs font-semibold text-foreground">{rating}</span>
  </div>
);

const ProductCard = ({ p, addToCart, delay = 0 }: { p: Product; addToCart: (p: Product) => void; delay?: number }) => (
  <Card className="overflow-hidden rounded-2xl border-border hover-scale animate-float-up group" style={{ animationDelay: `${delay}ms` }}>
    <div className="relative aspect-square overflow-hidden bg-muted">
      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      {p.oldPrice && (
        <Badge className="absolute top-3 left-3 bg-secondary border-0 text-white">
          -{Math.round((1 - p.price / p.oldPrice) * 100)}%
        </Badge>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{p.category}</span>
        <StarRow rating={p.rating} />
      </div>
      <h3 className="font-display font-semibold leading-tight mb-2">{p.name}</h3>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-lg font-bold">{p.price.toLocaleString('ru')} ₽</span>
        {p.oldPrice && <span className="text-sm text-muted-foreground line-through">{p.oldPrice.toLocaleString('ru')} ₽</span>}
      </div>
      <Button onClick={() => addToCart(p)} className="w-full rounded-full gradient-brand border-0">
        <Icon name="Plus" size={16} className="mr-1" /> В корзину
      </Button>
    </div>
  </Card>
);

const Home = ({ onShop, onFeed, products, addToCart }: { onShop: () => void; onFeed: () => void; products: Product[]; addToCart: (p: Product) => void }) => (
  <div className="space-y-12">
    <section className="relative overflow-hidden rounded-3xl gradient-brand text-white p-8 md:p-16">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-secondary/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      <div className="relative max-w-xl animate-float-up">
        <Badge className="bg-white/20 border-0 text-white mb-4">🔥 Новая коллекция 2026</Badge>
        <h1 className="font-display font-black text-4xl md:text-6xl leading-tight mb-4">Самые модные товары в одном месте</h1>
        <p className="text-white/90 text-lg mb-6">Маркет Арсения — яркие вещи, быстрая доставка и оплата в один клик.</p>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={onShop} size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
            Перейти в каталог <Icon name="ArrowRight" size={18} className="ml-1" />
          </Button>
          <Button onClick={onFeed} size="lg" variant="outline" className="rounded-full border-white/50 text-white hover:bg-white/10">
            <Icon name="Rss" size={18} className="mr-1" /> Лента заказов
          </Button>
        </div>
      </div>
    </section>

    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: 'Truck', t: 'Быстрая доставка', s: 'За 1-2 дня' },
        { icon: 'ShieldCheck', t: 'Гарантия качества', s: 'Проверенные бренды' },
        { icon: 'CreditCard', t: 'Оплата онлайн', s: 'В один клик' },
        { icon: 'Headphones', t: 'Поддержка 24/7', s: 'Всегда на связи' },
      ].map((f, i) => (
        <Card key={i} className="rounded-2xl p-5 border-border animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center mb-3">
            <Icon name={f.icon} className="text-primary" size={22} />
          </div>
          <p className="font-display font-semibold">{f.t}</p>
          <p className="text-sm text-muted-foreground">{f.s}</p>
        </Card>
      ))}
    </section>

    <section>
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl">Хиты продаж</h2>
        <button onClick={onShop} className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Смотреть все <Icon name="ArrowRight" size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.slice(0, 3).map((p, i) => (
          <ProductCard key={p.id} p={p} addToCart={addToCart} delay={i * 100} />
        ))}
      </div>
    </section>
  </div>
);

const Catalog = ({ products, addToCart, category, setCategory, search, setSearch }: {
  products: Product[]; addToCart: (p: Product) => void;
  category: string; setCategory: (c: string) => void;
  search: string; setSearch: (s: string) => void;
}) => (
  <div>
    <h1 className="font-display font-extrabold text-3xl mb-6">Каталог</h1>
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Поиск товаров..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-full" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'gradient-brand text-white' : 'bg-muted hover:bg-muted/70'}`}>
            {c}
          </button>
        ))}
      </div>
    </div>
    {products.length === 0 ? (
      <p className="text-center text-muted-foreground py-16">Ничего не найдено 🔍</p>
    ) : (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((p, i) => <ProductCard key={p.id} p={p} addToCart={addToCart} delay={i * 60} />)}
      </div>
    )}
  </div>
);

const CartView = ({ cart, total, changeQty, remove, onCheckout, onShop }: {
  cart: CartItem[]; total: number;
  changeQty: (id: number, d: number) => void; remove: (id: number) => void;
  onCheckout: () => void; onShop: () => void;
}) => (
  <div>
    <h1 className="font-display font-extrabold text-3xl mb-6">Корзина</h1>
    {cart.length === 0 ? (
      <Card className="rounded-2xl p-12 text-center border-border">
        <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">Корзина пуста</p>
        <Button onClick={onShop} className="rounded-full gradient-brand border-0">В каталог</Button>
      </Card>
    ) : (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((i) => (
            <Card key={i.id} className="rounded-2xl p-4 flex gap-4 items-center border-border">
              <img src={i.image} alt={i.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold truncate">{i.name}</p>
                <p className="text-sm text-muted-foreground">{i.price.toLocaleString('ru')} ₽</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => changeQty(i.id, -1)}><Icon name="Minus" size={14} /></Button>
                <span className="w-6 text-center font-semibold">{i.qty}</span>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => changeQty(i.id, 1)}><Icon name="Plus" size={14} /></Button>
              </div>
              <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive">
                <Icon name="Trash2" size={18} />
              </button>
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl p-6 border-border h-fit">
          <h3 className="font-display font-bold text-lg mb-4">Итого</h3>
          <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Товары</span><span>{total.toLocaleString('ru')} ₽</span></div>
          <div className="flex justify-between text-sm mb-4"><span className="text-muted-foreground">Доставка</span><span className="text-accent font-medium">Бесплатно</span></div>
          <div className="flex justify-between font-bold text-xl border-t border-border pt-4 mb-4">
            <span>К оплате</span><span className="gradient-text">{total.toLocaleString('ru')} ₽</span>
          </div>
          <Button onClick={onCheckout} className="w-full rounded-full gradient-brand border-0" size="lg">Перейти к оплате</Button>
        </Card>
      </div>
    )}
  </div>
);

const Payment = ({ total, count, cart, onPublish, onDone }: {
  total: number; count: number; cart: CartItem[];
  onPublish: (o: Omit<PublicOrder, 'id' | 'date'>) => void;
  onDone: () => void;
}) => {
  const [comment, setComment] = useState('');
  const [share, setShare] = useState(true);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    if (share) {
      onPublish({
        user: 'Арсений',
        avatar: 'А',
        items: cart.map((c) => c.name),
        sum: total,
        status: 'В обработке',
        comment: comment || 'Отличный заказ! 🛍️',
      });
    }
    setPaid(true);
  };

  if (paid) return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-4">
        <Icon name="CircleCheck" className="text-white" size={40} />
      </div>
      <h2 className="font-display font-extrabold text-2xl mb-2">Заказ оформлен!</h2>
      <p className="text-muted-foreground mb-6">{share ? 'Заказ появился в публичной ленте 🎉' : 'Ваш заказ принят в обработку'}</p>
      <Button onClick={onDone} className="rounded-full gradient-brand border-0" size="lg">Перейти в ленту</Button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display font-extrabold text-3xl mb-6">Оплата</h1>
      <Card className="rounded-2xl p-6 border-border space-y-4">
        <div className="flex justify-between items-center p-4 rounded-xl bg-muted">
          <span className="text-muted-foreground">{count} товара к оплате</span>
          <span className="font-bold text-xl gradient-text">{total.toLocaleString('ru')} ₽</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Номер карты</label>
            <Input placeholder="0000 0000 0000 0000" className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Срок</label><Input placeholder="ММ/ГГ" className="rounded-xl" /></div>
            <div><label className="text-sm font-medium mb-1 block">CVC</label><Input placeholder="000" className="rounded-xl" /></div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email для чека</label>
            <Input placeholder="mail@example.com" className="rounded-xl" />
          </div>
        </div>

        <div className="border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Rss" className="text-primary" size={18} />
              <span className="font-medium text-sm">Выложить заказ в ленту</span>
            </div>
            <button
              onClick={() => setShare((s) => !s)}
              className={`w-11 h-6 rounded-full transition-colors relative ${share ? 'gradient-brand' : 'bg-muted'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${share ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          {share && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Комментарий (необязательно)</label>
              <Input
                placeholder="Расскажи о заказе 😊"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          )}
        </div>

        <Button onClick={handlePay} className="w-full rounded-full gradient-brand border-0" size="lg">
          <Icon name="Lock" size={16} className="mr-1" /> Оплатить {total.toLocaleString('ru')} ₽
        </Button>
        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <Icon name="ShieldCheck" size={14} /> Безопасная оплата
        </p>
      </Card>
    </div>
  );
};

const Profile = ({ onOrders, onFeed }: { onOrders: () => void; onFeed: () => void }) => (
  <div className="max-w-2xl mx-auto">
    <h1 className="font-display font-extrabold text-3xl mb-6">Профиль</h1>
    <Card className="rounded-2xl p-6 border-border flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white font-display font-bold text-2xl">А</div>
      <div>
        <p className="font-display font-bold text-lg">Арсений</p>
        <p className="text-muted-foreground text-sm">arseniy@market.ru</p>
      </div>
    </Card>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { icon: 'Package', t: 'Мои заказы', s: 'История покупок', action: onOrders },
        { icon: 'Rss', t: 'Лента заказов', s: 'Посмотреть что заказывают другие', action: onFeed },
        { icon: 'MapPin', t: 'Адреса', s: 'Адреса доставки' },
        { icon: 'Settings', t: 'Настройки', s: 'Аккаунт и уведомления' },
      ].map((m, i) => (
        <button key={i} onClick={m.action} className="text-left">
          <Card className="rounded-2xl p-5 border-border hover-scale flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
              <Icon name={m.icon} className="text-primary" size={22} />
            </div>
            <div>
              <p className="font-display font-semibold">{m.t}</p>
              <p className="text-sm text-muted-foreground">{m.s}</p>
            </div>
          </Card>
        </button>
      ))}
    </div>
  </div>
);

const Orders = ({ onPublish, onFeed }: { onPublish: (o: Omit<PublicOrder, 'id' | 'date'>) => void; onFeed: () => void }) => {
  const [published, setPublished] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const orders = [
    { id: '2026-0042', date: '18 июня', status: 'Доставлен', sum: 13480, items: ['Кроссовки Arsenia Air', 'Наушники Arsenia Beat'] },
    { id: '2026-0039', date: '12 июня', status: 'В пути', sum: 5490, items: ['Наушники Arsenia Lite'] },
    { id: '2026-0031', date: '3 июня', status: 'Доставлен', sum: 12990, items: ['Часы Arsenia Watch'] },
  ];

  const handlePublish = (o: typeof orders[0]) => {
    onPublish({ user: 'Арсений', avatar: 'А', items: o.items, sum: o.sum, status: o.status, comment: comment || 'Мой заказ 🛍️' });
    setPublished((p) => [...p, o.id]);
    setActiveId(null);
    setComment('');
    onFeed();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display font-extrabold text-3xl mb-6">Мои заказы</h1>
      <div className="space-y-4">
        {orders.map((o, i) => {
          const isPublished = published.includes(o.id);
          const isActive = activeId === o.id;
          return (
            <Card key={o.id} className="rounded-2xl p-5 border-border animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-semibold">Заказ №{o.id}</span>
                <Badge className={`border-0 text-white ${o.status === 'Доставлен' ? 'bg-accent' : 'bg-secondary'}`}>{o.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{o.items.join(', ')}</p>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">{o.date}</span>
                <span className="font-bold text-foreground">{o.sum.toLocaleString('ru')} ₽</span>
              </div>
              {isPublished ? (
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  <Icon name="CircleCheck" size={16} /> Выложен в ленту
                </div>
              ) : isActive ? (
                <div className="space-y-2">
                  <Input placeholder="Комментарий к публикации..." value={comment} onChange={(e) => setComment(e.target.value)} className="rounded-xl text-sm" />
                  <div className="flex gap-2">
                    <Button onClick={() => handlePublish(o)} size="sm" className="rounded-full gradient-brand border-0 flex-1">
                      <Icon name="Rss" size={14} className="mr-1" /> Выложить
                    </Button>
                    <Button onClick={() => setActiveId(null)} size="sm" variant="outline" className="rounded-full">Отмена</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setActiveId(o.id)} className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  <Icon name="Rss" size={14} /> Выложить в ленту
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const Feed = ({ orders }: { orders: PublicOrder[] }) => (
  <div className="max-w-2xl mx-auto">
    <div className="flex items-center gap-2 mb-6">
      <Icon name="Rss" className="text-primary" size={28} />
      <h1 className="font-display font-extrabold text-3xl">Лента заказов</h1>
    </div>
    <p className="text-muted-foreground mb-6">Что покупают другие прямо сейчас 👀</p>
    <div className="space-y-4">
      {orders.map((o, i) => (
        <Card key={o.id} className="rounded-2xl p-5 border-border animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-display font-bold shrink-0">
              {o.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-semibold">{o.user}</span>
                <span className="text-xs text-muted-foreground">{o.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2 truncate">{o.items.join(' · ')}</p>
              {o.comment && (
                <p className="text-sm bg-muted rounded-xl px-3 py-2 mb-2">"{o.comment}"</p>
              )}
              <div className="flex items-center justify-between">
                <Badge className={`border-0 text-white text-xs ${o.status === 'Доставлен' ? 'bg-accent' : 'bg-secondary'}`}>{o.status}</Badge>
                <span className="font-bold text-sm gradient-text">{o.sum.toLocaleString('ru')} ₽</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const About = () => (
  <div className="max-w-2xl mx-auto text-center">
    <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-6">
      <Icon name="Sparkles" className="text-white" size={36} />
    </div>
    <h1 className="font-display font-extrabold text-3xl mb-4">О магазине</h1>
    <p className="text-muted-foreground text-lg mb-8">
      Маркет Арсения — это яркий маркетплейс модных товаров. Мы собираем лучшее: стильную обувь, технику и аксессуары. Только проверенные бренды, быстрая доставка и оплата в один клик.
    </p>
    <div className="grid grid-cols-3 gap-4">
      {[{ n: '10K+', t: 'Клиентов' }, { n: '500+', t: 'Товаров' }, { n: '4.9', t: 'Рейтинг' }].map((s, i) => (
        <Card key={i} className="rounded-2xl p-5 border-border">
          <p className="font-display font-black text-2xl gradient-text">{s.n}</p>
          <p className="text-sm text-muted-foreground">{s.t}</p>
        </Card>
      ))}
    </div>
  </div>
);

interface EditState { id: number; name: string; price: string; oldPrice: string; category: string; image: string; }

const Admin = ({ products, onAdd, onDelete, onEdit }: {
  products: Product[];
  onAdd: (p: Omit<Product, 'id' | 'rating'>) => void;
  onDelete: (id: number) => void;
  onEdit: (p: Product) => void;
}) => {
  const [form, setForm] = useState({ name: '', price: '', oldPrice: '', category: '', image: '' });
  const [editState, setEditState] = useState<EditState | null>(null);

  const handleAdd = () => {
    if (!form.name || !form.price) return;
    onAdd({ name: form.name, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined, category: form.category || 'Другое', image: form.image || 'https://cdn.poehali.dev/projects/a889af40-1b44-4fcc-85b7-fde2e8cdbf20/files/2aa297e6-df5c-4c07-9c91-e82cd23e6706.jpg' });
    setForm({ name: '', price: '', oldPrice: '', category: '', image: '' });
  };

  const handleSaveEdit = () => {
    if (!editState) return;
    onEdit({ id: editState.id, name: editState.name, price: Number(editState.price), oldPrice: editState.oldPrice ? Number(editState.oldPrice) : undefined, category: editState.category, image: editState.image, rating: products.find((p) => p.id === editState.id)?.rating ?? 5 });
    setEditState(null);
  };

  const revenue = products.reduce((s, p) => s + p.price, 0);
  const stats = [
    { icon: 'DollarSign', t: 'Выручка', v: `${(revenue * 3).toLocaleString('ru')} ₽`, color: 'text-accent' },
    { icon: 'ShoppingBag', t: 'Заказов', v: '142', color: 'text-primary' },
    { icon: 'Package', t: 'Товаров', v: String(products.length), color: 'text-secondary' },
    { icon: 'Users', t: 'Клиентов', v: '10 248', color: 'text-primary' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Icon name="ShieldCheck" className="text-primary" size={28} />
        <h1 className="font-display font-extrabold text-3xl">Панель администратора</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <Card key={i} className="rounded-2xl p-5 border-border animate-float-up" style={{ animationDelay: `${i * 70}ms` }}>
            <Icon name={s.icon} className={`${s.color} mb-2`} size={24} />
            <p className="font-display font-black text-2xl">{s.v}</p>
            <p className="text-sm text-muted-foreground">{s.t}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl p-6 border-border">
          <h3 className="font-display font-bold text-lg mb-4">Добавить товар</h3>
          <div className="space-y-3">
            <Input placeholder="Название товара" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Цена ₽" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="rounded-xl" />
              <Input placeholder="Старая цена ₽" value={form.oldPrice} onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))} className="rounded-xl" />
            </div>
            <Input placeholder="Категория" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-xl" />
            <Input placeholder="Ссылка на фото" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="rounded-xl" />
            <Button onClick={handleAdd} className="w-full rounded-full gradient-brand border-0">
              <Icon name="Plus" size={16} className="mr-1" /> Опубликовать товар
            </Button>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 border-border">
          <h3 className="font-display font-bold text-lg mb-4">Товары на витрине ({products.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {products.map((p) =>
              editState?.id === p.id ? (
                <div key={p.id} className="p-3 rounded-xl bg-muted space-y-2">
                  <Input value={editState.name} onChange={(e) => setEditState((s) => s && ({ ...s, name: e.target.value }))} className="rounded-lg h-8 text-sm" placeholder="Название" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={editState.price} onChange={(e) => setEditState((s) => s && ({ ...s, price: e.target.value }))} className="rounded-lg h-8 text-sm" placeholder="Цена" />
                    <Input value={editState.oldPrice} onChange={(e) => setEditState((s) => s && ({ ...s, oldPrice: e.target.value }))} className="rounded-lg h-8 text-sm" placeholder="Старая цена" />
                  </div>
                  <Input value={editState.category} onChange={(e) => setEditState((s) => s && ({ ...s, category: e.target.value }))} className="rounded-lg h-8 text-sm" placeholder="Категория" />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" className="rounded-full gradient-brand border-0 flex-1 h-8 text-xs">Сохранить</Button>
                    <Button onClick={() => setEditState(null)} size="sm" variant="outline" className="rounded-full h-8 text-xs">Отмена</Button>
                  </div>
                </div>
              ) : (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted group">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.price.toLocaleString('ru')} ₽ · {p.category}</p>
                  </div>
                  <button
                    onClick={() => setEditState({ id: p.id, name: p.name, price: String(p.price), oldPrice: String(p.oldPrice ?? ''), category: p.category, image: p.image })}
                    className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="Pencil" size={16} />
                  </button>
                  <button onClick={() => onDelete(p.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
