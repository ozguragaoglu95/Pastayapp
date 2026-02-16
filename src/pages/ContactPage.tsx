import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const ContactPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Mesajınız Alındı",
                description: "En kısa sürede size geri dönüş yapacağız.",
            });
            navigate("/");
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-200">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="flex-1 font-display text-lg font-bold">İletişim</h1>
            </div>

            <div className="max-w-2xl mx-auto w-full px-6 py-8 space-y-10">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-display font-black text-slate-900">Bize Ulaşın</h2>
                    <p className="text-slate-500">Her türlü soru, öneri ve destek için ekibimiz yanınızda.</p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                            <Phone className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-900">Telefon</p>
                        <p className="text-[10px] text-slate-500">+90 212 123 4567</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                            <Mail className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-900">E-posta</p>
                        <p className="text-[10px] text-slate-500">merhaba@kekcraft.com</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-900">Adres</p>
                        <p className="text-[10px] text-slate-500">Zeytinburnu, İstanbul</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 rounded-xl text-white">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-display font-bold">Mesaj Gönderin</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500 ml-1">Adınız</Label>
                                    <Input id="name" required placeholder="Ad Soyad" className="h-12 rounded-2xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 ml-1">E-posta</Label>
                                    <Input id="email" type="email" required placeholder="orne@email.com" className="h-12 rounded-2xl border-slate-200" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-xs font-bold uppercase text-slate-500 ml-1">Konu</Label>
                                <Input id="subject" required placeholder="Hangi konuda yazıyorsunuz?" className="h-12 rounded-2xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs font-bold uppercase text-slate-500 ml-1">Mesajınız</Label>
                                <Textarea id="message" required placeholder="Detaylı mesajınız..." className="min-h-[150px] rounded-2xl border-slate-200 py-4" />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 bg-slate-900 hover:bg-slate-800"
                                disabled={loading}
                            >
                                {loading ? "Gönderiliyor..." : "Mesajı Gönder"} <Send className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
