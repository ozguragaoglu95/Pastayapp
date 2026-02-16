import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShieldCheck, Sparkles, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="flex-1 font-display text-lg font-bold">Hakkımızda</h1>
            </div>

            <div className="flex-1 px-6 py-8 space-y-12 max-w-2xl mx-auto">
                {/* Hero Section */}
                <section className="text-center space-y-4">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                        <Heart className="h-8 w-8 fill-current" />
                    </div>
                    <h2 className="font-display text-3xl font-black tracking-tight text-slate-900">
                        Kutlamalarınıza <span className="text-primary">Sihir</span> Katıyoruz
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        CakeCraft, İstanbul'un en yetenekli butik pastacılarını ve hayallerindeki pastaya ulaşmak isteyenleri bir araya getiren yenilikçi bir platformdur.
                    </p>
                </section>

                {/* Values */}
                <section className="grid gap-6">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                            <ChefHat className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Usta Ellerden</h3>
                            <p className="text-sm text-slate-500 mt-1">Platformumuzdaki tüm pastaneler titizlikle seçilir ve yüksek kalite standartlarımıza uyar.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Sınırsız Kişiselleştirme</h3>
                            <p className="text-sm text-slate-500 mt-1">İster şablonlardan seçin, ister hayalinizdeki tasarımı yapay zeka desteğiyle oluşturun.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Güvenli İşlem</h3>
                            <p className="text-sm text-slate-500 mt-1">Siparişinizden teslimata kadar tüm süreç CakeCraft güvencesi altındadır.</p>
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="bg-slate-50 rounded-3xl p-8 text-center space-y-4">
                    <h3 className="font-display text-xl font-bold italic">"Amacımız, her özel anı unutulmaz bir lezzetle taçlandırmak."</h3>
                    <p className="text-sm text-slate-500">
                        Sıradan pastaların ötesine geçiyor, sizin için özel olarak tasarlanmış sanat eserleri sunuyoruz. İstanbul'un her noktasına taze ve güvenli teslimat sağlıyoruz.
                    </p>
                </section>

                <div className="pt-8 flex justify-center">
                    <Button
                        size="lg"
                        className="rounded-full px-8 shadow-xl shadow-primary/20"
                        onClick={() => navigate("/tasarimlar")}
                    >
                        Pastaları Keşfet
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
