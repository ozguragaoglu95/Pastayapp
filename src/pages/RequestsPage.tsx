import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Check, X, MessageSquare, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequests } from "@/contexts/RequestsContext";
import { getTemplateById } from "@/data/mock-data";
// import { mockRequests } from "@/data/mock-requests"; // Removed direct mock import
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    pending: { label: "Onay Bekliyor", color: "bg-yellow-500/10 text-yellow-500" },
    draft: { label: "Taslak", color: "bg-gray-500/10 text-gray-500" },
    waiting_offers: { label: "Teklif Bekleniyor", color: "bg-blue-500/10 text-blue-500" },
    offers_received: { label: "Teklifler Geldi", color: "bg-green-500/10 text-green-500" },
    offer_selected: { label: "Teklif Seçildi", color: "bg-purple-500/10 text-purple-500" },
    agreed: { label: "Anlaşıldı", color: "bg-green-500/10 text-green-500" },
    in_progress: { label: "Hazırlanıyor", color: "bg-orange-500/10 text-orange-500" },
    ready: { label: "Hazır", color: "bg-green-500/10 text-green-500" },
    delivered: { label: "Teslim Edildi", color: "bg-gray-500/10 text-gray-500" },
    cancelled: { label: "İptal Edildi", color: "bg-red-500/10 text-red-500" },
};

export default function RequestsPage() {
    const navigate = useNavigate();
    const { requests } = useRequests(); // Use context instead of mock data

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="mb-4 rounded-full bg-secondary/50 p-6">
                    <MessageSquare className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
                <h2 className="font-display text-xl font-bold">Henüz Talebiniz Yok</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-[200px]">
                    Hayalinizdeki pastayı tarif edin, pastacılar teklif versin.
                </p>
                <Button className="mt-6" onClick={() => navigate("/tasarla")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Talep Oluştur
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-md px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="font-display text-lg font-bold">Taleplerim</h1>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => navigate("/tasarla")}>
                    <Plus className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-4 space-y-4">
                {requests.map((req) => (
                    <div
                        key={req.id}
                        onClick={() => navigate(`/taleplerim/${req.id}`)}
                        className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                    >
                        <div className="flex gap-4">
                            <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                <img
                                    src={req.conceptImage || getTemplateById(req.spec.templateId || "")?.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200"}
                                    alt="Konsept"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {req.spec.templateId ? (
                                                <Badge className="bg-blue-50 text-blue-600 border-0 text-[9px] h-4 rounded-md">ŞABLONDAN</Badge>
                                            ) : (
                                                <Badge className="bg-purple-50 text-purple-600 border-0 text-[9px] h-4 rounded-md">ÖZEL TASARIM</Badge>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-slate-900 capitalize text-sm">
                                            {req.spec.occasion.replace("_", " ")} Pastası
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground font-medium">
                                            {req.spec.shape}, {req.spec.tiers} Katlı, {req.spec.portions} Kişilik
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${STATUS_MAP[req.status]?.color || "bg-secondary text-foreground"} border-0 text-[10px] font-bold`}
                                    >
                                        {STATUS_MAP[req.status]?.label || req.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(req.spec.eventDate).toLocaleDateString("tr-TR")}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {req.offers.length} Teklif
                                    </span>
                                </div>
                            </div>
                        </div>

                        {(req.status === 'offers_received' || req.status === 'offer_selected') && (
                            <div className="mt-1 flex items-center justify-between border-t pt-3">
                                <p className="text-xs font-semibold text-primary">
                                    {req.offers.length > 0 ? "Teklifleri İncele" : "Detayları Gör"}
                                </p>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
