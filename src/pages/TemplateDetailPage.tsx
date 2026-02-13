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
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [cakeNote, setCakeNote] = useState("");
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [theme, setTheme] = useState(template?.name || "");
    const [recipient, setRecipient] = useState("");
    const [hasAllergy, setHasAllergy] = useState(false);
    const [allergyInfo, setAllergyInfo] = useState("");

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
            setQuantity(item.quantity || 1);
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

        // Portions Price Diff
        if (quantity >= 10 && quantity < 15) price += 150;
        if (quantity >= 15) price += 300;

        const extrasPrice = selectedExtras.reduce((sum, extraId) => {
            const extra = extrasList.find(e => e.id === extraId);
            return sum + (extra?.price || 0);
        }, 0);

        return (price + extrasPrice) * quantity;
    }, [template, quantity, selectedExtras]);

    if (!template || !vendor) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-20">
                <p className="text-muted-foreground">Ürün bulunamadı.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/sablonlar")}>
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
                    <div className="rounded-xl bg-secondary/50 p-2.5 text-center">
                        <Users className="h-4 w-4 mx-auto text-muted-foreground" />
                        <p className="mt-0.5 text-xs font-semibold">{template.portionCount} kişi</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-2.5 text-center">
                        <Clock className="h-4 w-4 mx-auto text-muted-foreground" />
                        <p className="mt-0.5 text-xs font-semibold">{template.prepTimeDays} gün</p>
                    </div>
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
                            const isSelected = (p === "6-10" && quantity < 10) || (p === "10-15" && quantity >= 10 && quantity < 15) || (p === "15+" && quantity >= 15);
                            let priceDiff = 0;
                            if (p === "10-15") priceDiff = 150;
                            if (p === "15+") priceDiff = 300;

                            return (
                                <button
                                    key={p}
                                    onClick={() => setQuantity(p === "6-10" ? 8 : (p === "10-15" ? 12 : 20))}
                                    className={`flex-1 px-2 py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${isSelected ? "border-primary bg-primary/5 text-primary" : "border-slate-100 bg-white text-slate-500"
                                        }`}
                                >
                                    <span className="text-xs font-black">{p}</span>
                                    {priceDiff > 0 && <span className="text-[9px] font-bold opacity-70">+{priceDiff}₺</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Allergy Warning */}
                <div className="space-y-3">
                    <button
                        onClick={() => setHasAllergy(!hasAllergy)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${hasAllergy ? "bg-red-50 border-red-200" : "bg-white border-slate-100"
                            }`}
                        type="button"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl transition-colors ${hasAllergy ? "bg-red-500" : "bg-slate-100"}`}>
                                <AlertCircle className={`h-5 w-5 ${hasAllergy ? "text-white" : "text-slate-400"}`} />
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-black ${hasAllergy ? "text-red-900" : "text-slate-700"}`}>Alerjim Var*</p>
                                <p className="text-[10px] text-muted-foreground">Gıda duyarlılığınız varsa lütfen belirtin.</p>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${hasAllergy ? "bg-red-500" : "bg-slate-200"}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${hasAllergy ? "left-5" : "left-1"}`} />
                        </div>
                    </button>

                    {hasAllergy && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <Textarea
                                placeholder="Lütfen alerjinizi belirtin (Örn: Yer fıstığı, Çilek vb. - Maks 500 karakter)"
                                maxLength={500}
                                className="rounded-xl border-red-200 focus:ring-red-500 focus:border-red-500 min-h-[120px] bg-white text-sm"
                                value={allergyInfo}
                                onChange={(e) => setAllergyInfo(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky bottom bar */}
            <div className="fixed bottom-16 inset-x-0 z-20 border-t bg-white/90 backdrop-blur-md px-4 py-3 safe-bottom">
                <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">TOPLAM</p>
                        <p className="text-2xl font-display font-black text-primary">
                            {formatPrice(totalPrice)}
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="gap-2 rounded-full font-black flex-1 max-w-[200px] shadow-lg shadow-primary/20 h-14 bg-slate-900 hover:bg-slate-800 text-white"
                        asChild
                    >
                        <Link to={`/tasarla?template=${template.id}&vendor=${vendor.id}&recipient=${recipient}&theme=${theme}&portions=${quantity <= 10 ? "6-10" : (quantity <= 15 ? "10-15" : "15+")}&allergy=${hasAllergy ? encodeURIComponent(allergyInfo) : ""}`}>
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                            Tasarla 🎂
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TemplateDetail;
