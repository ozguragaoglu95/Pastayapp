import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, Info, CheckCircle2, Calendar, Truck, Store, Check, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRequests } from "@/contexts/RequestsContext";
import { getVendorById, formatPrice, getTemplateById } from "@/data/mock-data";
import { toast } from "@/hooks/use-toast";
import { useOrders } from "@/contexts/OrdersContext";

export default function OfferDetailPage() {
    const { requestId, offerId } = useParams();
    const navigate = useNavigate();
    const { getRequestById, sendMessage, updateRequestStatus } = useRequests();
    const { createOrder } = useOrders();

    const request = getRequestById(requestId || "");
    const offer = request?.offers.find(o => o.id === offerId);
    const vendor = offer ? getVendorById(offer.vendorId) : null;
    const template = request?.spec.templateId ? getTemplateById(request.spec.templateId) : null;

    if (!request || !offer || !vendor) {
        return <div className="p-10 text-center">Teklif bulunamadı.</div>;
    }

    const handleAccept = () => {
        const orderId = createOrder({
            userId: "current-user-id",
            vendorId: offer.vendorId,
            requestId: request.id,
            totalPrice: offer.totalPrice,
            commission: offer.totalPrice * 0.1,
            deliveryAddress: `${request.spec.district}, ${request.spec.city}`
        });

        updateRequestStatus(request.id, 'agreed', offer.id);
        toast({ title: "Teklif Kabul Edildi!", description: "Siparişiniz oluşturuldu." });
        navigate(`/siparis/${orderId}`);
    };

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-slate-50/50">
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b">
                <button onClick={() => navigate(-1)} className="p-2 mr-2"><ArrowLeft className="h-5 w-5" /></button>
                <div className="flex-1">
                    <h1 className="font-bold text-lg">Teklif Detayı</h1>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">{vendor.name}</p>
                </div>
            </div>

            <div className="p-4 space-y-6 max-w-2xl mx-auto w-full">
                {/* Visual Context */}
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-xl aspect-video sm:aspect-auto sm:h-48">
                    <img
                        src={request.conceptImage || template?.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587"}
                        alt="Talep"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                        <h2 className="text-white font-black text-xl">{request.spec.occasion.replace("_", " ")} Pastası</h2>
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-0 mt-1">Özet Görünüm</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CardItems label="Teklif Fiyatı" value={formatPrice(offer.totalPrice)} icon={<Badge className="bg-primary/10 text-primary border-0">₺</Badge>} />
                    <CardItems label="Teslimat" value={offer.deliverySupported ? "Adrese Teslimat" : "Gel-Al"} icon={offer.deliverySupported ? <Truck className="h-4 w-4 text-blue-500" /> : <Store className="h-4 w-4 text-orange-500" />} />
                </div>

                {/* Offer Note */}
                <div className="bg-white rounded-[2rem] p-6 border-2 border-slate-100 shadow-sm">
                    <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Satıcı Notu</h3>
                    <p className="text-slate-600 italic text-sm leading-relaxed">"{offer.note || "Talep detaylarına uygun olarak büyük bir özenle hazırlayabilirim."}"</p>
                </div>

                {/* Chat Block - Specific to this offer */}
                <div className="space-y-4">
                    <h3 className="font-black text-slate-900 flex items-center gap-2 px-2">
                        <MessageSquare className="h-5 w-5 text-primary" /> Satıcı ile Mesajlaşın
                    </h3>
                    <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden flex flex-col h-[350px] shadow-sm">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {request.messages?.filter(m => m.senderId === offer.vendorId || m.senderRole === 'customer').length ? (
                                request.messages.filter(m => m.senderId === offer.vendorId || m.senderRole === 'customer').map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 px-4 rounded-2xl text-sm font-medium ${msg.senderRole === 'customer' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400 text-xs italic px-10">
                                    Teklif hakkında sormak istediklerinizi buradan iletebilirsiniz.
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 border-t flex gap-2">
                            <input
                                placeholder="Mesajınızı yazın..."
                                className="flex-1 bg-white rounded-xl border-2 border-slate-100 px-4 text-sm h-11 focus:outline-none focus:border-primary transition-all shadow-inner"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                                        sendMessage(request.id, (e.target as HTMLInputElement).value, 'current-user-id', 'customer');
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-4 left-0 right-0 px-4">
                    <Button
                        className="w-full h-14 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/40 gap-3 active:scale-95 transition-all"
                        onClick={handleAccept}
                    >
                        <Check className="h-6 w-6" />
                        Teklifi Kabul Et
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CardItems({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-100 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{label}</p>
                <p className="text-sm font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}
