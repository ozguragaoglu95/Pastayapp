import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings, Shield, MapPin, Store, Camera, Save, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
    const { user, logout, register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Initial split for name
    const getNameParts = (fullName: string) => {
        const parts = fullName.trim().split(' ');
        if (parts.length > 1) {
            return {
                firstName: parts.slice(0, -1).join(' '),
                lastName: parts[parts.length - 1]
            };
        }
        return { firstName: fullName, lastName: '' };
    };

    const initialName = getNameParts(user?.name || '');

    // Form States
    const [personalInfo, setPersonalInfo] = useState({
        firstName: initialName.firstName,
        lastName: initialName.lastName,
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const [vendorData, setVendorData] = useState({
        address: user?.address || '',
        taxId: user?.taxId || '',
        description: 'Taze ve doğal malzemelerle en lezzetli pastalarımızı sizin için hazırlıyoruz.',
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast({ title: 'Çıkış Yapıldı', description: 'Tekrar görüşmek üzere!' });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Use register as a mock update since it handles user object creation in our context
        await register({
            name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
            email: personalInfo.email,
            phone: personalInfo.phone,
            role: user?.role || 'customer',
            address: vendorData.address,
            taxId: vendorData.taxId
        });

        setIsLoading(false);
        toast({ title: 'Başarılı', description: 'Profil bilgileriniz güncellendi.' });
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast({ title: 'Hata', description: 'Yeni şifreler eşleşmiyor.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setPasswordData({ current: '', new: '', confirm: '' });
        toast({ title: 'Başarılı', description: 'Şifreniz başarıyla değiştirildi.' });
    };

    return (
        <div className="flex flex-col min-h-screen pb-20 p-4 space-y-6 container max-w-2xl mx-auto">
            <div className="flex items-center justify-between mt-4">
                <h1 className="font-display text-2xl font-bold">Profil Ayarları</h1>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>

            {/* Header / Avatar Section */}
            <div className="flex flex-col items-center text-center space-y-3 py-4">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-12 w-12 text-primary" />
                        )}
                    </div>
                    {/* Only Show for Vendor */}
                    {user?.role === 'vendor' && (
                        <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md">
                            <Camera className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <div>
                    <h2 className="font-display text-xl font-bold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role === 'vendor' ? 'Pastane Sahibi' : 'Müşteri'}</p>
                </div>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 mb-2">
                    <TabsTrigger value="account" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Hesap</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Güvenlik</span>
                    </TabsTrigger>
                    {user?.role === 'vendor' ? (
                        <TabsTrigger value="vendor" className="gap-2">
                            <Store className="h-4 w-4" />
                            <span className="hidden sm:inline">Mağaza</span>
                        </TabsTrigger>
                    ) : (
                        <TabsTrigger value="address" className="gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline">Adres</span>
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kişisel Bilgiler</CardTitle>
                            <CardDescription>Hesap bilgilerinizi buradan güncelleyebilirsiniz.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleUpdateProfile}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Ad</Label>
                                        <Input
                                            id="firstName"
                                            value={personalInfo.firstName}
                                            onChange={e => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                                            placeholder="Adınız"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Soyad</Label>
                                        <Input
                                            id="lastName"
                                            value={personalInfo.lastName}
                                            onChange={e => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                                            placeholder="Soyadınız"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta {personalInfo.email ? "" : "(Opsiyonel)"}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-9"
                                            value={personalInfo.email}
                                            onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                            placeholder="E-posta adresinizi ekleyin"
                                        />
                                    </div>
                                    {!personalInfo.email && <p className="text-[10px] text-muted-foreground italic">E-posta ekleyerek kampanya ve bildirimlerden haberdar olabilirsiniz.</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefon Numarası</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            className="pl-9"
                                            value={personalInfo.phone}
                                            onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Şifre Ayarları</CardTitle>
                            <CardDescription>Hesap güvenliğiniz için şifrenizi düzenli olarak güncelleyin.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleUpdatePassword}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Mevcut Şifre</Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        value={passwordData.current}
                                        onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new">Yeni Şifre</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        value={passwordData.new}
                                        onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Yeni Şifre (Tekrar)</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        value={passwordData.confirm}
                                        onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading} variant="secondary">
                                    {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                {/* Vendor Settings Tab */}
                {user?.role === 'vendor' && (
                    <TabsContent value="vendor">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pastane Bilgileri</CardTitle>
                                <CardDescription>Müşterilerin gördüğü pastane detaylarını yönetin.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUpdateProfile}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="taxId">Vergi Numarası</Label>
                                        <Input
                                            id="taxId"
                                            value={vendorData.taxId}
                                            onChange={e => setVendorData({ ...vendorData, taxId: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="address">İşletme Adresi</Label>
                                            <Button
                                                type="button"
                                                variant="link"
                                                size="sm"
                                                className="h-auto p-0 flex items-center gap-1 text-[10px]"
                                                onClick={() => {
                                                    if ("geolocation" in navigator) {
                                                        navigator.geolocation.getCurrentPosition(pos => {
                                                            setVendorData({ ...vendorData, address: `Konum: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` });
                                                            toast({ title: "Konum Güncellendi" });
                                                        });
                                                    }
                                                }}
                                            >
                                                <MapPin className="h-3 w-3" /> Konum Al
                                            </Button>
                                        </div>
                                        <Textarea
                                            id="address"
                                            value={vendorData.address}
                                            onChange={e => setVendorData({ ...vendorData, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="desc">Pastane Açıklaması</Label>
                                        <Textarea
                                            id="desc"
                                            className="h-24"
                                            value={vendorData.description}
                                            onChange={e => setVendorData({ ...vendorData, description: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isLoading}>
                                        Mağaza Bilgilerini Kaydet
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                )}

                {/* Customer Address Tab */}
                {user?.role === 'customer' && (
                    <TabsContent value="address">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Adreslerim</CardTitle>
                                    <CardDescription>Siparişleriniz için kayıtlı adreslerinizi yönetin.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline">Yeni Ekle</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border rounded-lg p-3 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-sm">Ev Adresi</span>
                                        <Badge variant="outline">Varsayılan</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Kadıköy, İstanbul - No: 15 Kat: 4 Daire: 8
                                    </p>
                                    <div className="flex gap-2 pt-2">
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">Düzenle</Button>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-destructive">Sil</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}

// Simple Badge component if not exists
function Badge({ variant = "default", className = "", children }: any) {
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${variant === 'outline' ? 'border border-border text-muted-foreground' : 'bg-primary text-primary-foreground'
            } ${className}`}>
            {children}
        </span>
    );
}
