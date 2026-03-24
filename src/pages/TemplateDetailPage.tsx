import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Users, Sparkles, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getTemplateById, getVendorById, formatPrice } from "@/data/mock-data";
import { useCart } from "@/contexts/CartContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TemplateDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { addItem } = useCart();

    const template = getTemplateById(id || "");
    const vendor = template ? getVendorById(template.vendorId) : undefined;

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
    const [portionCount, setPortionCount] = useState<number>(0);
    const [cakeCount, setCakeCount] = useState<number>(1);
    const [activeImage, setActiveImage] = useState(0);
    const [cakeNote, setCakeNote] = useState("");
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [theme, setTheme] = useState("");
    const [recipient, setRecipient] = useState("");
    const [hasAllergy, setHasAllergy] = useState(false);
    const [allergyInfo, setAllergyInfo] = useState("");
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

    const extrasList = [
        { id: 'candle', label: 'Mum (Ücretsiz)', price: 0 },
        { id: 'card', label: 'Not Kartı', price: 20 },
        { id: 'gift_wrap', label: 'Hediye Paketi', price: 50 },
    ];

    // Recently Viewed Logic
    useEffect(() => {
        if (!id) return;
        const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        const updated = [id, ...viewed.filter((vid: string) => vid !== id)].slice(0, 10);
        localStorage.setItem('recently_viewed', JSON.stringify(updated));
    }, [id]);

    // Edit Mode / State Restoration
    useEffect(() => {
        const state = location.state as any;
        if (state?.editItem) {
            const item = state.editItem;
            setSelectedOptions(item.selectedOptions || {});
            setPortionCount(item.quantity || 1);
            setCakeCount(1); // Standardizing to 1 cake per list item
            setCakeNote(item.cakeNote || "");

            if (item.customExtras) {
                const extraIds = item.customExtras.map((label: string) =>
                    extrasList.find(e => e.label === label)?.id
                ).filter(Boolean);
                setSelectedExtras(extraIds);
            }

            toast({
                title: "Düzenleme Modu",
                description: "Mevcut seçimleriniz yüklendi.",
            });
        }
    }, [location.state]);

    const allImages = useMemo(() => {
        if (!template) return [];
        return [template.image, ...template.gallery];
    }, [template]);

    const totalPrice = useMemo(() => {
        if (!template) return 0;
        let price = template.basePrice;

        // Portions Price Diff (Surcharge based on range)
        if (portionCount >= 10 && portionCount < 15) price += 150;
        if (portionCount >= 15) price += 300;

        const extrasPrice = selectedExtras.reduce((sum, extraId) => {
            const extra = extrasList.find(e => e.id === extraId);
            return sum + (extra?.price || 0);
        }, 0);

        return (price + extrasPrice) * cakeCount;
    }, [template, portionCount, selectedExtras, cakeCount]);

    const isFormValid = useMemo(() => {
        return theme !== "" && recipient !== "" && portionCount > 0;
    }, [theme, recipient, portionCount]);

    if (!template || !vendor) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-20">
                <p className="text-muted-foreground">Ürün bulunamadı.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/tasarimlar")}>
                    Geri dön
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col pb-40">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-3 border-b">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="flex-1 font-display text-lg font-bold truncate">{template.name}</h1>
            </div>

            {/* Gallery */}
            <div className="relative">
                <div className="aspect-square overflow-hidden">
                    <img
                        src={allImages[activeImage]}
                        alt={template.name}
                        className="h-full w-full object-cover"
                    />
                </div>
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`h-1.5 rounded-full transition-all ${i === activeImage ? "w-6 bg-primary" : "w-1.5 bg-white/60"}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-4 pt-4">
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="secondary" className="text-[10px]">
                            {template.occasion}
                        </Badge>
                        <h2 className="mt-1 font-display text-xl font-extrabold">{template.name}</h2>
                    </div>
                    <p className="text-xl font-display font-extrabold text-primary">
                        {formatPrice(template.basePrice)}
                    </p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {template.description}
                </p>

                {/* Vendor & Quick Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="col-span-2 flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                        <img
                            src={vendor.portfolio[0]}
                            alt={vendor.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{vendor.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {vendor.district}
                                </span>
                                <span className="flex items-center gap-0.5 text-cake-gold">
                                    <Star className="h-3 w-3 fill-current" />
                                    {vendor.rating}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-2.5 text-center col-span-2">
                        <Clock className="h-4 w-4 mx-auto text-muted-foreground" />
                        <p className="mt-0.5 text-xs font-semibold">{template.prepTimeDays} gün önceden sipariş</p>
                    </div>
                </div>

                {/* Selection Groups */}
                <div className="mt-6 px-4 space-y-8">
                    {/* 1. Theme Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-bold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" /> Pasta Teması
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            {["Doğum Günü", "Düğün / Nişan", "Kutlama", "Baby Shower", "Yıl Dönümü", "Diğer"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all ${theme === t ? "border-primary bg-primary/5 text-primary" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Recipient Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-bold flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" /> Pastanın Kime Yapılacağı?
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {["Eş / Sevgili", "Aile", "Arkadaş", "Akraba", "Çocuk / Bebek", "Diğer"].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRecipient(r)}
                                    className={`px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all ${recipient === r ? "border-primary bg-primary/5 text-primary" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Portions Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-bold flex items-center gap-2">
                            <Plus className="h-4 w-4 text-primary" /> Kaç Kişilik?
                        </Label>
                        <div className="flex gap-2">
                            {["6-10", "10-15", "15+"].map((p) => {
                                const isSelected = (p === "6-10" && portionCount > 0 && portionCount < 10) || (p === "10-15" && portionCount >= 10 && portionCount < 15) || (p === "15+" && portionCount >= 15);
                                let priceDiff = 0;
                                if (p === "10-15") priceDiff = 150;
                                if (p === "15+") priceDiff = 300;

                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPortionCount(p === "6-10" ? 8 : (p === "10-15" ? 12 : 20))}
                                        className={`flex-1 px-2 py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${isSelected ? "border-primary bg-primary/5 text-primary" : "border-slate-100 bg-white text-slate-500"
                                            }`}
                                    >
                                        <span className="text-xs font-black">{p}</span>
                                        {priceDiff > 0 && <span className="text-[9px] font-bold opacity-70">+{priceDiff}₺ Fark</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Smart Sticky bottom bar - Hides on scroll down, stop at footer */}
            <div className={`sticky bottom-0 left-0 right-0 z-20 w-full border-t bg-white/95 backdrop-blur-xl px-4 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] mt-auto transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Mobile BottomNav offset for sticky bar */}
                <div className="md:hidden h-[72px] absolute -top-[72px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
                    <div className="hidden md:block">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">TOPLAM FİYAT</p>
                        <p className="text-2xl font-display font-black text-primary">
                            {portionCount > 0 ? formatPrice(totalPrice) : "---"}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="md:hidden flex-1">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">TOPLAM</p>
                            <p className="text-xl font-display font-black text-primary">
                                {portionCount > 0 ? formatPrice(totalPrice) : "---"}
                            </p>
                        </div>
                        
                        <Button
                            variant="outline"
                            size="lg"
                            disabled={!isFormValid}
                            className="flex-1 md:w-48 h-14 rounded-2xl font-bold border-2 border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-all"
                            onClick={() => {
                                addItem({
                                    templateProductId: template.id,
                                    unitPrice: totalPrice / cakeCount,
                                    quantity: cakeCount,
                                    selectedOptions: {
                                        "Tema": [theme],
                                        "Alıcı": [recipient],
                                        "Kişi Sayısı": [portionCount <= 10 ? "6-10 Kişi" : (portionCount <= 15 ? "10-15 Kişi" : "15+ Kişi")]
                                    },
                                    recipient,
                                    theme
                                });
                                navigate('/sepet');
                            }}
                        >
                            Sipariş Ver
                        </Button>

                        <Button
                            size="lg"
                            disabled={!isFormValid}
                            className="flex-1 md:w-56 h-14 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-lg shadow-primary/20 gap-2 disabled:opacity-40 transition-all"
                            asChild
                        >
                            {!isFormValid ? (
                                <span className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-yellow-300 opacity-50" />
                                    Özelleştir
                                </span>
                            ) : (
                                <Link to={`/tasarla?reset=true&template=${template.id}&vendor=${vendor.id}&recipient=${recipient}&theme=${theme}&portions=${portionCount <= 10 ? "6-10" : (portionCount <= 15 ? "10-15" : "15+")}`}>
                                    <Sparkles className="h-5 w-5 text-yellow-300" />
                                    Özelleştir
                                </Link>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateDetail;
