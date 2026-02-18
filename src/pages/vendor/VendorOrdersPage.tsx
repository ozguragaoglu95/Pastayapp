import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Search, Filter, MoreHorizontal, Package, CheckCircle2, Clock, MapPin } from "lucide-react";
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
        case 'on_the_way':
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
    const { orders, updateOrderStatus } = useOrders();
    const { getRequestById } = useRequests();

    const vendorId = user?.id || 'v1';
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
                        className="pl-9 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-9 w-[180px]">
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
                            <div key={order.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-all">
                                <div className="flex flex-1 items-start gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-secondary overflow-hidden shrink-0">
                                        {productImage ? (
                                            <img src={productImage} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                                            <Badge variant="outline" className={`text-[10px] h-5 border-0 rounded-lg ${STATUS_Styles[order.status] || "bg-secondary"}`}>
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold line-clamp-1">{productName}</h3>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                                            {order.deliveryAddress && (
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.deliveryAddress}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between md:justify-end gap-3 md:w-auto pt-3 md:pt-0 border-t md:border-0 pl-3">
                                    <div className="text-right md:mr-4">
                                        <p className="text-sm font-bold">{formatPrice(order.totalPrice)}</p>
                                        <p className="text-[10px] text-muted-foreground">Komisyon: {formatPrice(order.commission)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Status Update Actions */}
                                        {order.status === 'confirmed' && (
                                            <Button size="sm" className="h-8 text-[11px] font-bold" onClick={() => updateOrderStatus(order.id, 'preparing')}>Hazırlığa Başla</Button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <Button size="sm" variant="outline" className="h-8 text-[11px] font-bold border-cyan-200 text-cyan-600" onClick={() => updateOrderStatus(order.id, 'completed')}>Tamamla</Button>
                                        )}
                                        {order.status === 'completed' && (
                                            <Button size="sm" variant="outline" className="h-8 text-[11px] font-bold border-purple-200 text-purple-600" onClick={() => updateOrderStatus(order.id, 'shipped')}>Yola Çıkar</Button>
                                        )}
                                        {order.status === 'shipped' && (
                                            <Badge variant="secondary" className="bg-purple-50 text-purple-600 text-[10px]">Teslimat Bekleniyor</Badge>
                                        )}

                                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <h3 className="font-semibold text-lg">Sipariş Bulunamadı</h3>
                        <p className="text-muted-foreground text-sm">Henüz bir sipariş almadınız.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
