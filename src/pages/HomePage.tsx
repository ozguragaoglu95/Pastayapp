import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, PenTool, Send, Package, Gift, Percent } from 'lucide-react';
import { mockTemplates } from '@/data/mock-templates';
import { mockVendors } from '@/data/mock-vendors';

const steps = [
    { icon: PenTool, title: 'Tasarla', desc: 'Hayalindeki pastayı tarif et veya hazır tasarımlardan seç' },
    { icon: Send, title: 'Teklif Al', desc: "İstanbul'un en iyi pastanelerinden fiyat teklifi al" },
    { icon: Package, title: 'Teslim Al', desc: 'Özel pastanı kapında veya mağazadan teslim al' },
];

export default function HomePage() {
    const featured = mockTemplates.slice(0, 4);

    return (
        <div className="space-y-10 p-4 pb-20">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden gradient-hero p-6 py-12 text-white text-center shadow-2xl shadow-primary/20">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 space-y-5">
                    <Sparkles className="mx-auto h-12 w-12 text-gold animate-float" />
                    <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight">
                        Hayalindeki Pastayı <br /> <span className="text-white">Tasarla</span>
                    </h1>
                    <p className="text-white/90 max-w-md mx-auto text-lg">
                        İstanbul'un en usta butik pastacıları ile hayallerini gerçeğe dönüştür.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-slate-50 font-bold px-8 h-14 shadow-xl">
                            <Link to="/tasarla?reset=true">Hemen Tasarla</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold px-8 h-14 backdrop-blur-sm">
                            <Link to="/tasarimlar">Tasarımları Keşfet</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Campaign Banner */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden group">
                    <div className="relative z-10 space-y-2">
                        <Badge className="bg-white/20 hover:bg-white/20 text-white border-0">YENİ ÜYE ÖZEL</Badge>
                        <h3 className="text-2xl font-black font-display">İlk Siparişine %15 İndirim!</h3>
                        <p className="text-white/80 text-sm">Kod: <span className="font-mono font-bold text-white">KEK15</span></p>
                        <Button variant="secondary" size="sm" className="rounded-full mt-2 font-bold text-indigo-600">Fırsatı Yakala</Button>
                    </div>
                    <Percent className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 -rotate-12 group-hover:scale-110 transition-transform" />
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white relative overflow-hidden group">
                    <div className="relative z-10 space-y-2">
                        <Badge className="bg-white/20 hover:bg-white/20 text-white border-0">SEVGİLİLER GÜNÜ</Badge>
                        <h3 className="text-2xl font-black font-display">Aşk Dolu Pastalarda %20 Fırsat</h3>
                        <p className="text-white/80 text-sm">Seçili satıcılarda geçerlidir.</p>
                        <Button variant="secondary" size="sm" className="rounded-full mt-2 font-bold text-pink-600">Hemen İncele</Button>
                    </div>
                    <Gift className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 -rotate-12 group-hover:scale-110 transition-transform" />
                </div>
            </section>

            {/* How it works */}
            <section className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="font-display text-2xl font-black">Nasıl Çalışır?</h2>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">3 kolay adımda hayalindeki lezzete ulaş.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {steps.map((step, i) => (
                        <div key={i} className="text-center space-y-4 p-6 rounded-3xl bg-secondary/30 relative">
                            <div className="absolute top-4 right-4 text-4xl font-display font-black text-primary/5">0{i + 1}</div>
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                <step.icon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-display font-bold text-lg">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed px-4">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured templates */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-black">Popüler Tasarımlar</h2>
                        <p className="text-muted-foreground text-xs mt-1">Sizin için seçtiğimiz en favori tasarımlar.</p>
                    </div>
                    <Button asChild variant="ghost" className="rounded-full font-bold text-primary">
                        <Link to="/tasarimlar">Tümünü Gör</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {featured.map(t => {
                        const vendor = mockVendors.find(v => v.id === t.vendorId);
                        return (
                            <Link key={t.id} to={`/tasarimlar/${t.id}`}>
                                <Card className="overflow-hidden border-0 bg-white shadow-md hover:shadow-xl transition-all group rounded-2xl">
                                    <div className="aspect-[4/5] relative overflow-hidden">
                                        <img
                                            src={t.image}
                                            alt={t.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-black/60 backdrop-blur-md text-white border-0 text-[10px] rounded-lg">
                                                {t.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 space-y-2">
                                        <h3 className="font-bold truncate text-slate-800">{t.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                    <Star className="h-2.5 w-2.5 text-gold fill-current" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{t.rating}</span>
                                            </div>
                                            <span className="font-black text-primary text-sm">{t.basePrice}₺</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
