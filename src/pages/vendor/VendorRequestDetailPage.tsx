import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Check,
    AlertCircle,
    MessageSquare,
    Sparkles,
    Wand2,
    Image as ImageIcon,
    RefreshCw
} from 'lucide-react';
import { useRequests } from '@/contexts/RequestsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getTemplateById } from '@/data/mock-data';

export default function VendorRequestDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getRequestById, addOffer, sendMessage } = useRequests();

    const request = getRequestById(id || "");

    // Form States
    const [price, setPrice] = useState('');
    const [note, setNote] = useState('');
    const [readyDate, setReadyDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI States
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!request) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold">Talep bulunamadı</h2>
                <p className="text-muted-foreground mb-4">Aradığınız talep silinmiş veya mevcut değil.</p>
                <Button asChild variant="outline">
                    <Link to="/pastane/panel">Panele Dön</Link>
                </Button>
            </div>
        );
    }

    // Check if we already offered (In a real app, check if current vendor offered)
    // For now, simple check based on request status or a flag could be used, but allow multiple offers for demo.

    const template = request.spec.templateId ? getTemplateById(request.spec.templateId) : null;

    const handleGenerateAI = () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        // Simulate AI Gen
        setTimeout(() => {
            setGeneratedImage('https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800');
            setIsGenerating(false);
            toast({
                title: 'Görsel Oluşturuldu',
                description: 'Yapay zeka istediğiniz konsepti hazırladı.',
            });
        }, 1500);
    };

    const handleSubmitOffer = () => {
        if (!price || !readyDate) {
            toast({
                title: 'Eksik Bilgi',
                description: 'Lütfen fiyat ve tarih bilgilerini giriniz.',
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            addOffer(request.id, {
                totalPrice: parseFloat(price),
                earliestReady: new Date(readyDate).toISOString(),
                deliverySupported: true,
                pickupSupported: true,
                matchLevel: 'EXACT',
                flags: {
                    deliveryIncluded: false,
                    print2dIncluded: false,
                    figurine3dIncluded: false,
                    revisionsIncluded: false,
                    rushIncluded: false
                },
                note: note || "Talep detaylarına uygun olarak hazırlanacaktır."
            });

            toast({
                title: 'Teklif Gönderildi! 🎉',
                description: 'Müşteri teklifinizi değerlendirecek.',
            });

            setIsSubmitting(false);
            navigate('/pastane/panel');
        }, 1000);
    };

    return (
        <div className="space-y-6 container mx-auto py-6 max-w-4xl">
            <Link to="/pastane/panel" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Panele Dön
            </Link>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Request Details - Read Only */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="capitalize">{request.spec.occasion.replace("_", " ")} Pastası</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1">Oluşturulma: {new Date(request.createdAt).toLocaleDateString("tr-TR")}</p>
                                </div>
                                <Badge variant="secondary" className="capitalize">{request.status.replace("_", " ")}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Tarih</span>
                                    <p className="font-medium text-sm">{new Date(request.spec.eventDate).toLocaleDateString("tr-TR")}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Kişi</span>
                                    <p className="font-medium text-sm">{request.spec.portions} Kişilik</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Konum</span>
                                    <p className="font-medium text-sm">{request.spec.district}, {request.spec.city}</p>
                                </div>
                            </div>

                            <div className="border-t pt-3 space-y-2">
                                <p className="text-sm font-semibold">Detaylar</p>
                                <div className="text-sm grid grid-cols-2 gap-2 text-muted-foreground">
                                    <span>Şekil: <span className="text-foreground capitalize">{request.spec.shape}</span></span>
                                    <span>Kat: <span className="text-foreground">{request.spec.tiers}</span></span>
                                    <span>Kek: <span className="text-foreground capitalize">{request.spec.flavor}</span></span>
                                    <span>Dolgu: <span className="text-foreground capitalize">{request.spec.filling}</span></span>
                                </div>
                            </div>

                            {request.spec.colors.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {request.spec.colors.map(c => (
                                        <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                                    ))}
                                </div>
                            )}

                            {request.spec.notes && (
                                <div className="bg-secondary/20 p-3 rounded-lg mt-3">
                                    <p className="text-xs text-muted-foreground font-semibold mb-1">Müşteri Notu:</p>
                                    <p className="text-sm italic">"{request.spec.notes}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Section 1: Fixed Customer Request Visual */}
                    {(request.conceptImage || template) && (
                        <Card className="overflow-hidden border-2 border-slate-100 shadow-sm">
                            <CardHeader className="bg-slate-50 border-b p-4">
                                <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
                                    <ImageIcon className="h-4 w-4" /> Müşteri Talebi (Sabit)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative">
                                    <img
                                        src={request.conceptImage || template?.image}
                                        alt="Müşteri Talebi"
                                        className="w-full object-cover max-h-80 grayscale-[0.2]"
                                    />
                                    <div className="absolute bottom-3 left-3">
                                        {template ? (
                                            <Badge className="bg-blue-600 text-white border-0 shadow-lg">Şeblon Üzerinden</Badge>
                                        ) : (
                                            <Badge className="bg-slate-900 text-white border-0 shadow-lg">Özel Konsept</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 2: Vendor AI Counter-Offer / Concept */}
                    <Card className="border-2 border-purple-100 bg-purple-50/20 overflow-hidden shadow-sm">
                        <CardHeader className="p-4 border-b border-purple-100 bg-purple-50 flex flex-row items-center justify-between">
                            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-purple-700 flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Pastane Önerisi (AI)
                            </CardTitle>
                            {generatedImage && (
                                <Badge className="bg-purple-600 text-white border-0 text-[10px]">Yeni Konsept Üretildi</Badge>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            {generatedImage ? (
                                <div className="relative group">
                                    <img
                                        src={generatedImage}
                                        alt="Pastane Önerisi"
                                        className="w-full object-cover max-h-80"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-purple-900/80 to-transparent flex justify-end">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-white hover:bg-white/10 text-[10px] font-bold h-7"
                                            onClick={() => setGeneratedImage(null)}
                                        >
                                            <RefreshCw className="h-3 w-3 mr-1" /> Yeniden Üret
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Wand2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-700">Counter Offer için Görsel Üret</p>
                                        <p className="text-[10px] text-slate-500 max-w-[200px]">Müşteriye kendi yorumunuzu katmak için AI ile görsel hazırlayın.</p>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 border-t border-purple-100 bg-white">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Kendi konseptinizi tarif edin..."
                                        className="bg-slate-50 border-slate-200 text-sm focus-visible:ring-purple-500 h-10 rounded-xl"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                    />
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 shrink-0 h-10 w-10 p-0 rounded-xl transition-transform active:scale-95"
                                        onClick={handleGenerateAI}
                                        disabled={isGenerating || !aiPrompt.trim()}
                                    >
                                        {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Offer & Chat Column */}
                <div className="space-y-6">
                    {/* Offer Form */}
                    <div className="bg-card rounded-xl border shadow-sm h-fit">
                        <div className="p-6 border-b">
                            <CardTitle>Teklif Oluştur</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Bu talep için fiyat ve teslimat detaylarını giriniz.
                            </p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="price">Toplam Fiyat (₺)</Label>
                                <div className="relative">
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="50"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="pl-8 text-lg font-semibold"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₺</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">En Erken Teslim Tarihi</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    min={new Date().toISOString().slice(0, 16)}
                                    value={readyDate}
                                    onChange={e => setReadyDate(e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full h-11 text-base"
                                onClick={handleSubmitOffer}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Gönderiliyor..." : "Teklifi Gönder"}
                            </Button>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <Card className="rounded-xl overflow-hidden border-2 border-slate-100 h-[400px] flex flex-col">
                        <CardHeader className="p-4 bg-slate-50 border-b">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" /> Müşteri ile Mesajlaş
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 no-scrollbar">
                            {request.messages && request.messages.length > 0 ? (
                                request.messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.senderRole === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.senderRole === 'vendor' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                                            {msg.text}
                                            <p className={`text-[8px] mt-1 opacity-70 ${msg.senderRole === 'vendor' ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400 text-xs italic">
                                    Henüz mesajlaşma başlatılmadı. İlk mesajı siz atarak iletişime geçebilirsiniz.
                                </div>
                            )}
                        </CardContent>
                        <div className="p-4 bg-white border-t flex gap-2">
                            <Input
                                placeholder="Mesajınızı yazın..."
                                className="rounded-xl"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && note.trim()) {
                                        sendMessage(request.id, note, user?.id || 'v1', 'vendor');
                                        setNote('');
                                    }
                                }}
                            />
                            <Button size="icon" className="rounded-xl shrink-0" onClick={() => {
                                if (note.trim()) {
                                    sendMessage(request.id, note, user?.id || 'v1', 'vendor');
                                    setNote('');
                                }
                            }}>
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
