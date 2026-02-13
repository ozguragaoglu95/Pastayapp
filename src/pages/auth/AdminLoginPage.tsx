import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Default admin credentials for demo
    const [email, setEmail] = useState("admin@cakecraft.tr");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            if (email === "admin@cakecraft.tr") {
                login(email, 'admin');
                toast({
                    title: "Admin Girişi Başarılı",
                    description: "Yönetim paneline yönlendiriliyorsunuz.",
                });
                navigate("/admin");
            } else {
                toast({
                    variant: "destructive",
                    title: "Hatalı Giriş",
                    description: "Admin yetkisi bulunamadı.",
                });
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 bg-slate-50">
            <Card className="w-full max-w-md border-t-4 border-t-primary">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-display">Yönetici Paneli</CardTitle>
                        <CardDescription>
                            Sistem yönetimi için giriş yapın
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Kullanıcı Adı</Label>
                            <Input
                                id="email"
                                type="email"
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
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Kontrol Ediliyor..." : "Giriş Yap"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
