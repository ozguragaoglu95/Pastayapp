import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Store, User as UserIcon, Mail, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { formatPrice } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { user, register } = useAuth();

    const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
    const [address, setAddress] = useState("");
    const [date, setDate] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Guest / Registration State
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [guestPassword, setGuestPassword] = useState(""); // If filled, register user
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Smart Sticky Bar Logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling DOWN
                setIsVisible(false);
            } else {
                // Scrolling UP
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    if (items.length === 0 && !confirmed) {
        navigate("/sepet");
        return null;
    }

    if (confirmed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <Store className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="font-display text-2xl font-bold">Sipariş Alındı! 🎉</h2>
                <p className="mt-2 text-muted-foreground">
                    Siparişiniz pastacıya iletildi. Hazırlık sürecini Siparişlerim sayfasından takip edebilirsiniz.
                </p>
                <div className="mt-8 flex flex-col w-full gap-3">
                    <Button onClick={() => navigate("/taleplerim")}>
                        Siparişlerimi Gör
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        Ana Sayfaya Dön
                    </Button>
                </div>
            </div>
        );
    }

    const handleConfirm = async () => {
        // Validation
        if (!user) {
            if (!guestName || !guestEmail || !guestPhone) {
                toast({ title: "Eksik Bilgi", description: "Lütfen iletişim bilgilerinizi doldurun.", variant: "destructive" });
                return;
            }
        }

        if (deliveryType === "delivery" && !address.trim()) {
            toast({ title: "Hata", description: "Lütfen teslimat adresini girin.", variant: "destructive" });
            return;
        }
        if (!date) {
            toast({ title: "Hata", description: "Lütfen teslimat tarihini seçin.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            // If guest provided password, register them
            if (!user && guestPassword) {
                await register({
                    name: guestName,
                    email: guestEmail,
                    phone: guestPhone,
                    role: 'customer'
                });
                toast({ title: "Hesap Oluşturuldu", description: "Siparişinizle birlikte hesabınız da oluşturuldu." });
            } else if (!user) {
                // Guest checkout without registration (store guest info in order - mock)
                // For now, we simulate guest checkout as just placing order
                // In real app, we'd pass guest info to creating order API
            }

            // Simulate Order Creation API call
            setTimeout(() => {
                clearCart();
                setConfirmed(true);
                toast({ title: "Başarılı", description: "Siparişiniz başarıyla oluşturuldu!" });
                setIsLoading(false);
            }, 1500);

        } catch (error) {
            toast({ title: "Hata", description: "Bir sorun oluştu.", variant: "destructive" });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col pb-28">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-3 border-b">
                <button onClick={() => navigate("/sepet")} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="flex-1 font-display text-lg font-bold">Sipariş Özeti</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Guest / User Info Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">İletişim Bilgileri</h3>
                    {user ? (
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="guest-name">Ad Soyad</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="guest-name" className="pl-9" placeholder="Adınız Soyadınız" value={guestName} onChange={e => setGuestName(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="guest-email">E-posta</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="guest-email" type="email" className="pl-9" placeholder="ornek@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guest-phone">Telefon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="guest-phone" type="tel" className="pl-9" placeholder="0555..." value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="guest-password">Şifre (İsteğe Bağlı)</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="guest-password"
                                        type="password"
                                        className="pl-9"
                                        placeholder="Hesap oluşturmak için şifre belirleyin"
                                        value={guestPassword}
                                        onChange={e => setGuestPassword(e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground pl-1">
                                    * Şifre girerseniz siparişinizle birlikte hesabınız da oluşturulur.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delivery type */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Teslimat Yöntemi</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(["delivery", "pickup"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setDeliveryType(type)}
                                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all ${deliveryType === type
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/40"
                                    }`}
                            >
                                {type === "delivery" ? (
                                    <>
                                        <Truck className="h-6 w-6" />
                                        Adrese Teslimat
                                    </>
                                ) : (
                                    <>
                                        <Store className="h-6 w-6" />
                                        Gel Al
                                    </>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Address */}
                {deliveryType === "delivery" && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Teslimat Adresi</h3>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Tam adresinizi girin..."
                            className="bg-card"
                        />
                    </div>
                )}

                {/* Date */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Teslimat Tarihi</h3>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-card"
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>

                {/* Order summary */}
                <div className="rounded-xl border bg-card p-4 space-y-3">
                    <h3 className="text-sm font-medium">Sipariş Özeti</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ürünler ({items.length})</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Teslimat</span>
                        <span className="text-green-600 font-medium">Ücretsiz</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold">
                        <span>Toplam</span>
                        <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                </div>

                {/* Mock payment */}
                <div className="rounded-xl bg-secondary/30 p-4 flex gap-3 items-start">
                    <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Ödeme</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Ödeme entegrasyonu yakında aktif olacak. Şimdilik siparişiniz ön onaylı olarak oluşturulacaktır. Ödeme için pastane sizinle iletişime geçecektir.
                        </p>
                    </div>
                </div>
            </div>

            {/* Smart Sticky confirm - Integrated with flow to stop at footer */}
            <div className={`sticky bottom-0 inset-x-0 z-20 border-t bg-background/95 backdrop-blur-md px-4 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] mt-auto transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-xl mx-auto">
                    <Button
                        size="lg"
                        className="w-full font-bold rounded-2xl h-14 shadow-lg shadow-primary/20"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span>İşleniyor...</span>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <span>Siparişi Onayla</span>
                                <span className="opacity-40">|</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
