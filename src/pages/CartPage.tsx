import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus, Tag, TicketPercent } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getTemplateById, getVendorById, formatPrice } from "@/data/mock-data";

const CartPage = () => {
    const navigate = useNavigate();
    const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.15 for 15%

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === "KEK15") {
            setAppliedDiscount(0.15);
        } else {
            setAppliedDiscount(0);
        }
    };

    const discountedTotal = useMemo(() => {
        return totalPrice * (1 - appliedDiscount);
    }, [totalPrice, appliedDiscount]);

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="mb-4 rounded-full bg-secondary/50 p-6">
                    <ArrowLeft className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
                <h2 className="font-display text-xl font-bold">Sepetiniz boş</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-[200px]">
                    Hazır tasarımlardan beğendiğiniz pastaları sepete ekleyin.
                </p>
                <Button className="mt-6" onClick={() => navigate("/tasarimlar")}>
                    Pastaları Keşfet
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col pb-32">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-md px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="font-display text-lg font-bold">Sepetim</h1>
                </div>
                <button
                    onClick={clearCart}
                    className="text-xs font-medium text-destructive hover:opacity-80"
                >
                    Temizle
                </button>
            </div>

            {/* Items */}
            <div className="p-4 space-y-4">
                {items.map((item, idx) => {
                    const template = getTemplateById(item.templateProductId);
                    const vendor = template ? getVendorById(template.vendorId) : undefined;
                    if (!template) return null;

                    // Resolve selected option labels (Updated for multi-select support)
                    const optionSummary = template.optionGroups
                        .map((group) => {
                            const selectedIds = item.selectedOptions[group.id] || [];
                            const labels = group.options
                                .filter((o) => selectedIds.includes(o.id))
                                .map((o) => o.label);
                            return labels.length > 0 ? `${group.name}: ${labels.join(", ")}` : null;
                        })
                        .filter(Boolean);

                    // item.unitPrice is calculated and stored in cart item
                    const unitPrice = item.unitPrice;

                    return (
                        <div
                            key={`${item.templateProductId}-${idx}`}
                            className="flex gap-4 rounded-xl border bg-card p-3 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                            onClick={() => navigate(`/sablonlar/${item.templateProductId}`, {
                                state: { editItem: item }
                            })}
                        >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold line-clamp-1">{template.name}</h3>
                                            <p className="text-[10px] text-muted-foreground">{vendor?.name}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeItem(item.templateProductId);
                                            }}
                                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {optionSummary.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {optionSummary.map((s, i) => (
                                                <span key={i} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item.templateProductId, item.quantity - 1);
                                            }}
                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item.templateProductId, item.quantity + 1);
                                            }}
                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold text-primary">
                                        {formatPrice(unitPrice * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Coupon Code Section */}
            <div className="px-4 mt-6">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Tag className="h-4 w-4 text-primary" />
                        <span>İndirim Kuponu</span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Kupon kodu (Örn: KEK15)"
                            className="bg-white rounded-xl border-slate-200"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button variant="secondary" className="rounded-xl px-6" onClick={handleApplyCoupon}>Uygula</Button>
                    </div>
                    {appliedDiscount > 0 && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 p-2 rounded-lg">
                            <TicketPercent className="h-3 w-3" />
                            <span>%15 İndirim Uygulandı!</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Continue Shopping */}
            <div className="px-4 mt-4">
                <Button
                    variant="outline"
                    className="w-full rounded-2xl border-dashed border-slate-300 h-12 text-muted-foreground hover:text-primary hover:border-primary/50"
                    onClick={() => navigate("/tasarimlar")}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Başka Ürünler Ekle
                </Button>
            </div>

            {/* Recently Viewed */}
            <RecentlyViewedSection />

            {/* Sticky bottom */}
            <div className="fixed bottom-0 inset-x-0 z-20 border-t bg-white/90 backdrop-blur-md px-4 py-4 safe-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Ara Toplam</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                            <span>İndirim (%15)</span>
                            <span>-{formatPrice(totalPrice * appliedDiscount)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-900">Toplam</span>
                        <span className="text-2xl font-display font-black text-primary">{formatPrice(discountedTotal)}</span>
                    </div>
                </div>
                <Button
                    size="lg"
                    className="w-full font-bold rounded-full h-12 shadow-lg shadow-primary/20"
                    onClick={() => navigate("/odeme")}
                >
                    Siparişi Tamamla
                </Button>
            </div>
        </div>
    );
};

const RecentlyViewedSection = () => {
    const navigate = useNavigate();
    const [viewedIds, setViewedIds] = useState<string[]>([]);

    useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        setViewedIds(viewed);
    }, []);

    const products = viewedIds
        .map(id => getTemplateById(id))
        .filter(Boolean) as any[];

    if (products.length === 0) return null;

    return (
        <div className="mt-12 mb-20">
            <div className="px-4 flex items-center justify-between mb-4">
                <h3 className="font-display font-bold">Son Baktıkların</h3>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Keşfetmeye Devam Et</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4">
                {products.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => navigate(`/sablonlar/${p.id}`)}
                        className="w-32 shrink-0 group cursor-pointer"
                    >
                        <div className="aspect-square rounded-xl overflow-hidden mb-2 border shadow-sm">
                            <img src={p.image} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <p className="text-[10px] font-bold line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-primary font-black mt-0.5">{formatPrice(p.basePrice)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartPage;
