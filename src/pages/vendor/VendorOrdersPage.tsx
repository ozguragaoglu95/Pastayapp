import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Search, Package, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders } from "@/contexts/OrdersContext";
import { getTemplateById, formatPrice } from "@/data/mock-data";
import { useRequests } from "@/contexts/RequestsContext";

const STATUS_Styles: Record<string, string> = {
    confirmed: "bg-blue-500/10 text-blue-600 border-blue-200",
    preparing: "bg-orange-500/10 text-orange-600 border-orange-200",
    shipped: "bg-purple-500/10 text-purple-600 border-purple-200",
    delivered: "bg-gray-500/10 text-gray-600 border-gray-200",
    completed: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
    returned: "bg-red-500/10 text-red-600 border-red-200",
    cancelled: "bg-slate-500/10 text-slate-600 border-slate-200",
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'confirmed': return 'Kabul Edildi';
        case 'preparing': return 'Hazırlanıyor';
        case 'shipped': return 'Yolda';
        case 'delivered': return 'Teslim Edildi';
        case 'completed': return 'Tamamlandı';
        case 'returned': return 'İade';
        case 'cancelled': return 'İptal';
        default: return status;
    }
};

export default function VendorOrdersPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders } = useOrders();
    const { getRequestById } = useRequests();

    const vendorId = user?.id || 'u-vendor1';
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Filter orders based on search and status
    let filteredOrders = orders.filter(o => o.vendorId === vendorId);

    // Apply status filter
    if (statusFilter !== "all") {
        filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    } else {
        // Default: show active orders (Waiting for delivery or in preparation)
        filteredOrders = filteredOrders.filter(o =>
            o.status !== 'delivered' &&
            o.status !== 'cancelled' &&
            o.status !== 'returned'
        );
    }

    // Apply search filter
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(o =>
            o.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return (
        <div className="flex flex-col gap-6 container mx-auto p-6 max-w-6xl pb-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/pastane/panel")} className="rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="font-display text-2xl font-bold">Sipariş Yönetimi</h1>
                        <p className="text-sm text-slate-500">Aktif siparişlerinizi ve iş akışınızı yönetin.</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center bg-card p-3 rounded-xl border">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Sipariş no, müşteri adı..."
                        className="pl-9 h-9 border-none bg-slate-50 focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-9 w-[180px] bg-slate-50 border-none">
                            <SelectValue placeholder="Durum Filtrele" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Aktif</SelectItem>
                            <SelectItem value="confirmed">Kabul Edildi</SelectItem>
                            <SelectItem value="preparing">Hazırlanıyor</SelectItem>
                            <SelectItem value="completed">Tamamlandı</SelectItem>
                            <SelectItem value="shipped">Yolda</SelectItem>
                            <SelectItem value="delivered">Teslim Edildi</SelectItem>
                            <SelectItem value="returned">İade</SelectItem>
                            <SelectItem value="cancelled">İptal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        // Resolve product name (Template or Custom Request)
                        let productName = "Özel Talep";
                        let productImage = null;

                        if (order.templateProductId) {
                            const tmpl = getTemplateById(order.templateProductId);
                            if (tmpl) {
                                productName = tmpl.name;
                                productImage = tmpl.image;
                            }
                        } else if (order.requestId) {
                            const req = getRequestById(order.requestId);
                            if (req) {
                                productName = `${req.spec.flavor} / ${req.spec.filling} (${req.spec.occasion})`;
                                productImage = req.conceptImage;
                            }
                        }

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-[1.5rem] p-5 border-2 border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group"
                                onClick={() => navigate(`/pastane/siparis/${order.id}`)}
                            >
                                <div className="flex flex-1 items-start gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                                        {productImage ? (
                                            <img src={productImage} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary">
                                                <Package className="h-6 w-6 opacity-40" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">#{order.id}</span>
                                            <Badge className={`text-[10px] h-5 border-0 rounded-lg ${STATUS_Styles[order.status] || "bg-secondary"}`}>
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-slate-900 line-clamp-1">{productName}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                                            {order.deliveryAddress && (
                                                <span className="flex items-center gap-1.5 line-clamp-1"><MapPin className="h-3.5 w-3.5" /> {order.deliveryAddress.split(',')[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-1 border-t md:border-0 pt-3 md:pt-0">
                                    <span className="text-sm font-black text-slate-900">{formatPrice(order.totalPrice)}</span>
                                    <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Detayı Yönet →
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <Package className="h-12 w-12 mx-auto text-slate-200 mb-4" />
                        <h3 className="font-black text-slate-900 text-lg">Sipariş Bulunamadı</h3>
                        <p className="text-slate-400 text-sm font-medium">Henüz bu kriterlere uygun sipariş bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
