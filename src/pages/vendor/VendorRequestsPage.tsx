import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronRight,
    Gift,
    MessageSquare,
    Store,
    ArrowLeft,
    Clock,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRequests } from "@/contexts/RequestsContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

type RequestTab = 'marketplace' | 'specialized' | 'my_offers';

export default function VendorRequestsPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const { requests } = useRequests();

    // Initialize tab from URL or default to marketplace
    const initialTab = (searchParams.get('tab') as RequestTab) || 'marketplace';
    const [activeTab, setActiveTab] = useState<RequestTab>(initialTab);
    const [searchQuery, setSearchQuery] = useState("");

    // Sync activeTab if URL search params change (e.g., browser back button)
    useEffect(() => {
        const tab = (searchParams.get('tab') as RequestTab) || 'marketplace';
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tab: RequestTab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    const vendorId = user?.id || 'v1';

    // Filter logic
    const marketplaceRequests = requests.filter(r =>
        !r.spec.templateId &&
        (r.status === 'pending' || r.status === 'waiting_offers') &&
        !r.offers.some(o => o.vendorId === vendorId) &&
        !r.selectedOfferId
    );

    const specialRequests = requests.filter(r =>
        !!r.spec.templateId &&
        (r.status === 'pending' || r.status === 'waiting_offers') &&
        !r.offers.some(o => o.vendorId === vendorId)
    );

    const myOffersRequests = requests.filter(r =>
        r.offers.some(o => o.vendorId === vendorId) &&
        !r.selectedOfferId
    );

    const getFilteredRequests = () => {
        let base = [];
        if (activeTab === 'marketplace') base = marketplaceRequests;
        else if (activeTab === 'specialized') base = specialRequests;
        else base = myOffersRequests;

        if (!searchQuery) return base;

        return base.filter(r =>
            r.spec.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.spec.occasion.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const displayRequests = getFilteredRequests();

    return (
        <div className="flex flex-col gap-6 container mx-auto p-4 md:p-8 max-w-6xl pb-24">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/pastane/panel")} className="rounded-full -ml-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="font-display text-2xl font-black text-slate-900">Talepler & Teklifler</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Pazar yerindeki genel istekleri ve size gelen özel talepleri yönetin.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-full sm:w-fit">
                <button
                    onClick={() => handleTabChange('marketplace')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'marketplace' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    Pazar Yeri ({marketplaceRequests.length})
                </button>
                <button
                    onClick={() => handleTabChange('specialized')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'specialized' ? "bg-white text-cake-gold shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    Özel Talepler ({specialRequests.length})
                </button>
                <button
                    onClick={() => handleTabChange('my_offers')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'my_offers' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    Tekliflerim ({myOffersRequests.length})
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Talep içeriği veya etkinlik ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-2 border-slate-100 rounded-xl focus:ring-primary shadow-sm"
                    />
                </div>
                <Button variant="outline" className="rounded-xl border-2 border-slate-100 gap-2 font-bold bg-white">
                    <Filter className="h-4 w-4" /> Filtrele
                </Button>
            </div>

            {/* Requests Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {displayRequests.length > 0 ? (
                        displayRequests.map((req) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card
                                    className={`rounded-[2rem] border-2 transition-all hover:shadow-xl cursor-pointer group h-full flex flex-col ${activeTab === 'specialized' ? "hover:border-cake-gold/30 border-slate-100" : "hover:border-primary/30 border-slate-100"
                                        }`}
                                    onClick={() => navigate(`/pastane/talep/${req.id}`)}
                                >
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge className={`rounded-lg border-0 ${activeTab === 'specialized' ? "bg-cake-gold/10 text-cake-gold" : "bg-primary/10 text-primary"
                                                }`}>
                                                {req.spec.occasion.replace("_", " ")}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-2">
                                            {req.spec.notes || "Özel Tasarım Pasta İsteği"}
                                        </h3>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-100">
                                                {req.spec.portions} Kişilik
                                            </span>
                                            <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-100">
                                                {req.spec.flavor}
                                            </span>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                            {activeTab === 'my_offers' ? (
                                                <div className="flex items-center gap-1.5 text-primary font-black text-sm">
                                                    <MessageSquare className="h-4 w-4" />
                                                    Teklif Verildi
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 font-black text-sm group-hover:text-primary transition-colors">
                                                    <ChevronRight className="h-4 w-4" />
                                                    Detayları Gör
                                                </div>
                                            )}

                                            {req.offers.length > 0 && (
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                                    <Users className="h-3 w-3" />
                                                    {req.offers.length} Teklif
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                                <Search className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Talep Bulunamadı</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                {searchQuery ? "Aramanıza uygun talep bulunmuyor." : "Bu kategoride henüz aktif bir talep bulunmuyor."}
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
