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

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // Get return url from location state or default to home/dashboard
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (role: UserRole) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login(email || `${role}@example.com`, role);
            setIsLoading(false);

            toast({
                title: "Giriş Başarılı",
                description: `Hoş geldiniz! ${role === 'vendor' ? 'Satıcı' : 'Müşteri'} olarak giriş yaptınız.`,
            });

            // Redirect based on role if no specific return url
            if (from === "/") {
                if (role === 'vendor') navigate("/pastane/panel");
                else navigate("/");
            } else {
                navigate(from, { replace: true });
            }
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-display">Giriş Yap</CardTitle>
                    <CardDescription>
                        Devam etmek için lütfen giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="customer" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="customer">Müşteri</TabsTrigger>
                            <TabsTrigger value="vendor">Satıcı (Pastane)</TabsTrigger>
                        </TabsList>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <TabsContent value="customer">
                            <Button
                                className="w-full mt-4"
                                onClick={() => handleLogin('customer')}
                                disabled={isLoading}
                            >
                                {isLoading ? "Giriş Yapılıyor..." : "Müşteri Girişi Yap"}
                            </Button>
                        </TabsContent>

                        <TabsContent value="vendor">
                            <Button
                                className="w-full mt-4"
                                onClick={() => handleLogin('vendor')}
                                disabled={isLoading}
                            >
                                {isLoading ? "Giriş Yapılıyor..." : "Pastane Girişi Yap"}
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

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Veya
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => navigate("/tasarla")}>
                        Üye Olmadan Tasarıma Başla
                    </Button>

                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-4">
                    <div className="text-sm text-muted-foreground">
                        Hesabınız yok mu?{" "}
                        <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/register")}>
                            Kayıt Olun
                        </Button>
                    </div>
                    {/* Admin link hidden or moved to footer strictly if needed, removing from main view as requested */}
                </CardFooter>
            </Card>
        </div>
    );
}
