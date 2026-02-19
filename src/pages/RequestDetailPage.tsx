import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Share2, MoreHorizontal, MessageSquare, Info, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { getTemplateById } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRequests } from "@/contexts/RequestsContext";
import { useOrders } from "@/contexts/OrdersContext";
import { Offer } from "@/types";
import { toast } from "@/hooks/use-toast";
import OfferCard from "@/components/OfferCard";

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

export default function RequestDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getRequestById, updateRequestStatus, sendMessage } = useRequests();
    const { createOrder } = useOrders();

    const request = getRequestById(id || "");

    if (!request) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <p className="text-muted-foreground">Talep bulunamadı.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/taleplerim")}>
                    Geri Dön
                </Button>
            </div>
        );
    }

    const handleAcceptOffer = (offer: Offer) => {
        // 1. Create Order
        const newOrderId = createOrder({
            userId: "current-user-id", // Mock user
            vendorId: offer.vendorId,
            requestId: request.id,
            totalPrice: offer.totalPrice,
            commission: offer.totalPrice * 0.1, // 10% commission mock
            // Address would normally come from user profile or checkout form
            deliveryAddress: `${request.spec.district}, ${request.spec.city}`
        });

        // 2. Update Request Status
        updateRequestStatus(request.id, 'agreed', offer.id);

        // 3. Notify and Navigate
        toast({
            title: "Teklif Kabul Edildi! 🎉",
            description: "Siparişiniz oluşturuldu, satıcı onay bekliyor.",
        });

        navigate(`/siparis/${newOrderId}`);
    };

    const template = request.spec.templateId ? getTemplateById(request.spec.templateId) : null;

    return (
        <div className="flex flex-col pb-20 container mx-auto max-w-2xl px-0 sm:px-4">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-md px-4 py-3 border-b sm:border-0 sm:bg-transparent">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-secondary">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-secondary">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Status & Title */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Badge
                            variant="outline"
                            className={`${STATUS_MAP[request.status]?.color || "bg-secondary text-foreground"} border-0`}
                        >
                            {STATUS_MAP[request.status]?.label || request.status}
                        </Badge>
                        {request.status === 'agreed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </div>
                    <h1 className="font-display text-2xl font-bold capitalize">
                        {request.spec.occasion.replace("_", " ")} Pastası
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Oluşturulma: {new Date(request.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                </div>

                {/* Spec Summary */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-secondary/30 p-3">
                        <p className="text-xs text-muted-foreground">Tarih</p>
                        <p className="font-semibold text-sm mt-0.5">
                            {new Date(request.spec.eventDate).toLocaleDateString("tr-TR")}
                        </p>
                    </div>
                    <div className="rounded-xl bg-secondary/30 p-3">
                        <p className="text-xs text-muted-foreground">Kişi Sayısı</p>
                        <p className="font-semibold text-sm mt-0.5">{request.spec.portions} Kişilik</p>
                    </div>
                    <div className="rounded-xl bg-secondary/30 p-3">
                        <p className="text-xs text-muted-foreground">İçerik</p>
                        <p className="font-semibold text-sm mt-0.5 capitalize text-nowrap overflow-hidden text-ellipsis">{request.spec.flavor} / {request.spec.filling}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/30 p-3">
                        <p className="text-xs text-muted-foreground">Konum</p>
                        <p className="font-semibold text-sm mt-0.5 line-clamp-1">{request.spec.district}, {request.spec.city}</p>
                    </div>
                </div>

                {/* Concept Visual (Always Shown) */}
                <div className="space-y-3">
                    <h2 className="font-display text-lg font-bold flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-primary" /> Talebiniz
                    </h2>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-white aspect-video sm:aspect-auto sm:h-64">
                        <img
                            src={request.conceptImage || template?.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800"}
                            alt="Talebiniz"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                            {template ? (
                                <Badge className="bg-blue-600 text-white border-0 shadow-xl">Şablon Görseli</Badge>
                            ) : (
                                <Badge className="bg-purple-600 text-white border-0 shadow-xl">AI Tasarımınız</Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Offers Section */}
                <div>
                    <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                        Teklifler
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                            {request.offers.length}
                        </span>
                    </h2>

                    {request.offers.length > 0 ? (
                        <div className="space-y-4">
                            {request.offers.map(offer => (
                                <OfferCard
                                    key={offer.id}
                                    offer={offer}
                                    requestId={request.id}
                                    isAccepted={request.selectedOfferId === offer.id}
                                    onAccept={!request.selectedOfferId ? () => handleAcceptOffer(offer) : undefined}
                                    onClick={() => navigate(`/taleplerim/${request.id}/teklif/${offer.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed p-6 text-center">
                            <Info className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm font-medium">Henüz teklif gelmedi</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Talebiniz pastacılara iletildi. Yakında teklifler gelmeye başlayacak.
                            </p>
                        </div>
                    )}
                </div>

                {/* Chat & Contact Section (Conditional) */}
                {(request.spec.templateId || request.status === 'agreed' || request.status === 'offer_selected') ? (
                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="font-display text-lg font-bold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            {request.spec.templateId ? "Satıcı ile İletişim" : "Anlaşılan Satıcı ile Mesajlaşın"}
                        </h2>

                        {/* Chat Box */}
                        <div className="rounded-2xl border-2 border-slate-100 overflow-hidden flex flex-col h-[300px] bg-white shadow-sm">
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                                {request.messages && request.messages.length > 0 ? (
                                    request.messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.senderRole === 'customer' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                                                {msg.text}
                                                <p className={`text-[8px] mt-1 opacity-70 ${msg.senderRole === 'customer' ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-400 text-[11px] italic px-10">
                                        {request.spec.templateId
                                            ? "Şablon siparişiniz için satıcıya buradan soru sorabilirsiniz."
                                            : "Satıcı ile anlaştığınıza göre detayları buradan konuşabilirsiniz."}
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-slate-50 border-t flex gap-2">
                                <input
                                    placeholder="Mesajınızı yazın..."
                                    className="flex-1 bg-white rounded-xl border-2 border-slate-100 px-4 text-sm focus:outline-none focus:border-primary transition-colors h-10"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                                            sendMessage(request.id, (e.target as HTMLInputElement).value, 'current-user-id', 'customer');
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Call Option - Only if vendor sent at least one message */}
                        {request.messages?.some(m => m.senderRole === 'vendor') && (
                            <div className="bg-primary/5 rounded-2xl p-4 border-2 border-primary/10 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                        <Info className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Satıcı ile Sesli Görüşme</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Detayları telefonda konuşabilirsiniz.</p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full rounded-xl h-11 font-bold gap-2 text-white shadow-lg shadow-primary/20"
                                    onClick={() => window.open(`tel:+905551234567`)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    Satıcıyı Ara
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Info For Custom Requests without Decision */
                    <div className="p-4 py-6 bg-orange-50 border-2 border-orange-100 rounded-2xl text-[11px] text-orange-700 font-medium leading-relaxed flex flex-col items-center text-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-orange-500" />
                        </div>
                        <p className="max-w-[280px]">
                            Özel tasarım taleplerinizde satıcılarla mesajlaşmak için önce gelen teklifleri inceleyin. Bir teklifi seçtiğinizde o satıcı ile direkt iletişim kanalınız açılacaktır.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
