import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Camera, ShieldCheck, MapPin, Phone, User, Lock, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VendorSettingsPage() {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Ayarlar Kaydedildi",
                description: "Profil bilgileriniz başarıyla güncellendi.",
            });
        }, 1000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32">
            <div>
                <h1 className="text-3xl font-black font-display text-slate-900">Ayarlar</h1>
                <p className="text-slate-500 font-medium">Mağaza profilinizi ve güvenlik tercihlerinizi yönetin.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Left Column: Profile Pic & Bio */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] overflow-hidden border-2 border-slate-100 shadow-sm">
                        <CardContent className="p-6 flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                                    <img src={user?.avatar || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200"} className="w-full h-full object-cover" />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-center">
                                <h2 className="font-black text-slate-900">{user?.name}</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{user?.role === 'vendor' ? 'Sertifikalı Pastane' : user?.role}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Mağaza Bio</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Mağazanız hakkında kısa bir bilgi (Maks 80 karakter)"
                                maxLength={80}
                                className="rounded-2xl border-2 border-slate-100 min-h-[100px]"
                                defaultValue={user?.bio}
                            />
                            <p className="text-[10px] text-right text-slate-400 font-bold">80 / 80</p>
                        </CardContent>
                    </Card>

                    <Button variant="destructive" className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-red-100" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Hesaptan Çıkış Yap
                    </Button>
                </div>

                {/* Right Column: Form Fields */}
                <form onSubmit={handleSave} className="md:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Temel Bilgiler
                            </CardTitle>
                            <CardDescription className="font-medium">Müşterilerin göreceği genel bilgileriniz.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Kullanıcı Adı</Label>
                                    <Input defaultValue={user?.username || "seker_atolyesi"} className="rounded-xl border-2 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Telefon No (SMS Onaylı)</Label>
                                    <div className="relative">
                                        <Input defaultValue={user?.phone || "+90 555 123 4567"} className="rounded-xl border-2 h-11 pr-10" />
                                        <ShieldCheck className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Restoran Telefon No (Müşteri İletişimi)</Label>
                                    <div className="relative">
                                        <Input defaultValue={user?.phone || "+90 555 123 4567"} className="rounded-xl border-2 h-11 pr-10 border-primary/20" />
                                        <Phone className="absolute right-3 top-3 h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium italic">Müşteriler sipariş özelleştirmesi için bu numarayı arayacak.</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Adres</Label>
                                <div className="relative">
                                    <Textarea defaultValue={user?.address} className="rounded-xl border-2 min-h-[80px] pl-10 pt-3" />
                                    <MapPin className="absolute left-3 top-4 h-5 w-5 text-slate-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" /> Güvenlik & Şifre
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Yeni Şifre</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-xl border-2 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Şifre Tekrar</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-xl border-2 h-11" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" className="rounded-2xl px-8 h-12 font-bold" type="button">İptal</Button>
                        <Button className="rounded-2xl px-12 h-12 font-bold shadow-xl shadow-primary/20" type="submit" disabled={loading}>
                            {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
