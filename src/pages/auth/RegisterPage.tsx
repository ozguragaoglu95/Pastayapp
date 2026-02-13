import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // Type casting for location state
    const state = location.state as { from?: { pathname: string } } | null;

    const [isLoading, setIsLoading] = useState(false);

    // Customer Form State
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPassword, setCustomerPassword] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    // Vendor Form State
    const [vendorBusinessName, setVendorBusinessName] = useState(""); // Maps to name
    const [vendorContactPerson, setVendorContactPerson] = useState(""); // Kept for reference but user name will be business name or contact person? Let's use Business Name as User Name for simplicity or concat
    const [vendorEmail, setVendorEmail] = useState("");
    const [vendorPassword, setVendorPassword] = useState("");
    const [vendorPhone, setVendorPhone] = useState("");
    const [vendorTaxId, setVendorTaxId] = useState("");
    const [vendorAddress, setVendorAddress] = useState("");

    const handleRegister = async (role: UserRole) => {
        setIsLoading(true);
        setTimeout(() => {
            if (role === 'customer') {
                register({
                    email: customerEmail,
                    name: customerName,
                    role: 'customer',
                    phone: customerPhone
                });
            } else {
                register({
                    email: vendorEmail,
                    name: vendorBusinessName, // Using business name as display name
                    role: 'vendor',
                    phone: vendorPhone,
                    taxId: vendorTaxId,
                    address: vendorAddress
                });
            }

            setIsLoading(false);

            toast({
                title: "Kayıt Başarılı",
                description: `Aramıza hoş geldiniz! ${role === 'vendor' ? 'Satıcı' : 'Müşteri'} hesabınız oluşturuldu.`,
            });

            if (role === 'vendor') {
                navigate("/pastane/panel");
            } else {
                const from = state?.from?.pathname || "/";
                navigate(from, { replace: true });
            }
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] px-4 py-8">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-display">Kayıt Ol</CardTitle>
                    <CardDescription>
                        CakeCraft dünyasına katılmak için form doldurun
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="customer" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="customer">Müşteri</TabsTrigger>
                            <TabsTrigger value="vendor">Satıcı (Pastane)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="customer" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="c-name">Ad Soyad</Label>
                                <Input id="c-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Adınız Soyadınız" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c-email">E-posta</Label>
                                <Input id="c-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="ornek@email.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c-phone">Telefon Numarası</Label>
                                <Input id="c-phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="0555 555 55 55" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c-password">Şifre</Label>
                                <Input id="c-password" type="password" value={customerPassword} onChange={(e) => setCustomerPassword(e.target.value)} />
                            </div>

                            <Button className="w-full" onClick={() => handleRegister('customer')} disabled={isLoading}>
                                {isLoading ? "Kayıt Olunuyor..." : "Müşteri Olarak Kayıt Ol"}
                            </Button>
                        </TabsContent>

                        <TabsContent value="vendor" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="v-name">İşletme Adı</Label>
                                <Input id="v-name" value={vendorBusinessName} onChange={(e) => setVendorBusinessName(e.target.value)} placeholder="Pastane Adı" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="v-contact">Yetkili Kişi</Label>
                                <Input id="v-contact" value={vendorContactPerson} onChange={(e) => setVendorContactPerson(e.target.value)} placeholder="Ad Soyad" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="v-email">E-posta</Label>
                                    <Input id="v-email" type="email" value={vendorEmail} onChange={(e) => setVendorEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="v-phone">Telefon</Label>
                                    <Input id="v-phone" type="tel" value={vendorPhone} onChange={(e) => setVendorPhone(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="v-tax">Vergi Numarası</Label>
                                <Input id="v-tax" value={vendorTaxId} onChange={(e) => setVendorTaxId(e.target.value)} placeholder="Vergi No" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="v-address">Tam Açık Adres</Label>
                                <Input id="v-address" value={vendorAddress} onChange={(e) => setVendorAddress(e.target.value)} placeholder="Mahalle, Cadde, Sokak, No, İlçe/İl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="v-password">Şifre</Label>
                                <Input id="v-password" type="password" value={vendorPassword} onChange={(e) => setVendorPassword(e.target.value)} />
                            </div>

                            <Button className="w-full" onClick={() => handleRegister('vendor')} disabled={isLoading}>
                                {isLoading ? "Kayıt Olunuyor..." : "Pastane Olarak Kayıt Ol"}
                            </Button>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Veya şununla devam et
                            </span>
                        </div>
                    </div>

                    <SocialLoginButtons />

                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Zaten hesabınız var mı?{" "}
                        <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
                            Giriş Yap
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
