import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Sparkles, Users, Type, Palette, Send, Trash2, Upload, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequests } from "@/contexts/RequestsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { CustomRequestSpec } from "@/types";
import { getTemplateById } from "@/data/mock-data";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const STEPS = [
    { id: 1, title: "Temel & Şekil", icon: Type },
    { id: 2, title: "İçerik", icon: Palette },
    { id: 3, title: "AI Tasarım", icon: Sparkles },
    { id: 4, title: "Detaylar", icon: Check },
];

const GUEST_LIMIT = 5;

export default function DesignWizardPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addRequest } = useRequests();
    const { user } = useAuth();

    const templateId = searchParams.get('template');
    const vendorId = searchParams.get('vendor');
    const recipientParam = searchParams.get('recipient');
    const portionsParam = searchParams.get('portions');
    const themeParam = searchParams.get('theme');
    const allergyParam = searchParams.get('allergy');
    const template = templateId ? getTemplateById(templateId) : null;
    const wizardMode = template ? 'template_revision' : 'scratch';

    const [currentStep, setCurrentStep] = useState(wizardMode === 'template_revision' ? 2 : 1);
    const [loading, setLoading] = useState(false);
    const [showLimitDialog, setShowLimitDialog] = useState(false);
    const [hasAllergy, setHasAllergy] = useState(false);

    const [formData, setFormData] = useState<Partial<CustomRequestSpec>>({
        occasion: template?.occasion?.toLowerCase() || "dogum_gunu",
        portions: portionsParam || (template?.portionCount ? `${template.portionCount}` : "10-15"),
        recipient: recipientParam || undefined,
        productTheme: themeParam || undefined,
        allergyInfo: allergyParam ? decodeURIComponent(allergyParam) : undefined,
        shape: "yuvarlak",
        flavor: "Vanilya",
        filling: "Çikolata",
        frosting: "Krem Şanti",
        isCustomMessage: false,
        vendorId: vendorId || undefined,
        templateId: templateId || undefined,
        customOptions: {},
    });

    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check for pending data on mount (Persistence & Auto-Submit Fix)
    useEffect(() => {
        const pendingData = localStorage.getItem('pending_design_data');
        const autoSubmit = localStorage.getItem('auto_submit') === 'true';

        if (pendingData) {
            try {
                const parsed = JSON.parse(pendingData);
                setFormData(parsed);
                if (parsed.allergyInfo) setHasAllergy(true);

                // If images were saved in localStorage
                const savedImages = localStorage.getItem('pending_images');
                if (savedImages) {
                    setReferenceImages(JSON.parse(savedImages));
                }

                if (user && autoSubmit) {
                    // AUTO-SUBMIT Flow
                    handleCreateRequest(parsed, JSON.parse(savedImages || "[]"));
                } else if (!user) {
                    // Just restore for guest
                    setCurrentStep(4);
                }

                if (user) {
                    localStorage.removeItem('pending_design_data');
                    localStorage.removeItem('pending_images');
                    localStorage.removeItem('auto_submit');
                }
            } catch (e) {
                console.error("Restoration failed", e);
            }
        }
    }, [user]);

    const handleCreateRequest = async (data: any, images: string[]) => {
        setLoading(true);
        try {
            addRequest({
                userId: user!.id,
                spec: data as CustomRequestSpec,
                referenceImages: images,
                conceptAttempts: 1,
            });
            toast({ title: "Talebiniz Alındı! 🥂", description: "Pastacılar tasarımlarınıza bakıp teklif verecekler." });
            navigate("/taleplerim");
        } catch (error) {
            toast({ title: "Hata", description: "Bir sorun oluştu.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user'; text: string; image?: string }[]>([]);
    const [userPrompt, setUserPrompt] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Initial AI message when entering step 3
    useEffect(() => {
        if (currentStep === 3 && chatMessages.length === 0) {
            let initialMessage = "";
            let initialPrompt = "";

            const flavorPart = formData.flavor ? `${formData.flavor} kekli, ` : "";
            const fillingPart = formData.filling ? `${formData.filling} dolgulu, ` : "";
            const frostingPart = formData.frosting ? `${formData.frosting} kaplamalı ` : "";

            if (wizardMode === 'template_revision' && template) {
                const themePart = formData.productTheme ? `"${formData.productTheme}" temalı, ` : "";
                const recipientPart = formData.recipient ? `${formData.recipient} için ` : "";
                initialPrompt = `${themePart}${recipientPart}${formData.portions} kişilik, ${formData.shape} formunda, ${flavorPart}${fillingPart}${frostingPart}yeni bir tasarım...`;
                initialMessage = `Merhaba! Seçmiş olduğunuz "${template.name}" pastası üzerinde ${formData.productTheme ? `"${formData.productTheme}" temasına uygun` : "ne gibi"} özelleştirmeler yapalım? İşte başlangıç fikrimiz: "${initialPrompt}"`;
            } else {
                const themePart = formData.productTheme ? `"${formData.productTheme}" temalı, ` : "";
                const recipientPart = formData.recipient ? `${formData.recipient} için ` : "";
                initialPrompt = `${themePart}${recipientPart}${formData.portions} kişilik, ${formData.shape} formunda, ${flavorPart}${fillingPart}${frostingPart}harika bir pasta...`;
                initialMessage = `Merhaba! Hayalindeki pastayı tasarlamaya hazır mısın? Seçimlerine göre şöyle bir başlangıç yapabiliriz: "${initialPrompt}"`;
            }

            setChatMessages([{
                role: 'ai',
                text: initialMessage
            }]);
            setUserPrompt(initialPrompt);
        }
    }, [currentStep, wizardMode, template, formData.portions, formData.shape, formData.occasion, formData.flavor, formData.filling, formData.frosting]);

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1);
        }
    };

    const handleAISend = async () => {
        if (!userPrompt.trim()) return;

        const newMsg = { role: 'user' as const, text: userPrompt };
        setChatMessages(prev => [...prev, newMsg]);
        setUserPrompt("");
        setLoading(true);

        // Simulate AI thinking and image generation
        await new Promise(r => setTimeout(r, 2000));

        const aiMsgText = wizardMode === 'template_revision'
            ? "Seçtiğiniz şablonu verdiğiniz detaylarla harika bir şekilde güncelledim! İşte revize edilmiş tasarım:"
            : "Harika bir fikir! İşte hayalinizdeki pastanın yapay zeka tarafından oluşturulmuş tasarımı. Nasıl görünüyor?";

        const aiMsg = {
            role: 'ai' as const,
            text: aiMsgText,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop"
        };

        setChatMessages(prev => [...prev, aiMsg]);
        updateField("aiImage", aiMsg.image);
        updateField("aiPrompt", newMsg.text);
        setLoading(false);
    };

    const resetAI = () => {
        setChatMessages([]);
        updateField("aiImage", undefined);
        updateField("aiPrompt", undefined);
        // Trigger initial AI message again
        setCurrentStep(2);
        setTimeout(() => setCurrentStep(3), 10);
    };

    const handleSubmit = async () => {
        if (!user) {
            localStorage.setItem('pending_design_data', JSON.stringify(formData));
            localStorage.setItem('pending_images', JSON.stringify(referenceImages));
            localStorage.setItem('auto_submit', 'true');
            navigate("/register", { state: { from: { pathname: "/tasarla" } } });
            return;
        }

        handleCreateRequest(formData, referenceImages);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReferenceImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const updateField = (field: keyof CustomRequestSpec, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            {/* Nav */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 py-4 border-b">
                <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
                    <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-1">Adım {currentStep} / {STEPS.length}</span>
                        <h1 className="font-display font-black text-sm">{STEPS[currentStep - 1].title}</h1>
                    </div>
                    <div className="w-9" />
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
            </div>

            <div className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-y-auto pb-32">
                {/* Step 1: Occasion, Portions, Shape */}
                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" /> Hangi Etkinlik İçin?
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "dogum_gunu", label: "Doğum Günü" },
                                    { id: "nisan", label: "Nişan / Söz" },
                                    { id: "dugun", label: "Düğün" },
                                    { id: "kutlama", label: "Kutlama" },
                                    { id: "diger", label: "Özel Sebebim Var" },
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => updateField("occasion", opt.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all text-left group ${formData.occasion === opt.id
                                            ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                            : "border-white bg-white hover:border-slate-200"
                                            }`}
                                    >
                                        <p className={`text-sm font-bold ${formData.occasion === opt.id ? "text-primary" : "text-slate-600"}`}>{opt.label}</p>
                                    </button>
                                ))}
                            </div>
                            {formData.occasion === 'diger' && (
                                <Input
                                    placeholder="Etkinliği kısaca belirtin (Maks 50 karakter)"
                                    maxLength={50}
                                    className="rounded-xl border-2 border-primary/20 bg-white"
                                    value={formData.customOccasion || ""}
                                    onChange={(e) => updateField("customOccasion", e.target.value)}
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" /> Kaç Kişilik?
                            </Label>
                            <div className="flex gap-3">
                                {["6-10", "10-15", "15+"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => updateField("portions", p)}
                                        className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center ${formData.portions === p
                                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                                            : "border-white bg-white hover:border-slate-200 text-slate-500"
                                            }`}
                                    >
                                        <span className="font-black">{p}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2">
                                <Palette className="h-4 w-4 text-primary" /> Pasta Şekli
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "özel", label: "Özel Tasarım" },
                                    { id: "yuvarlak", label: "Yuvarlak" },
                                    { id: "kare", label: "Kare" },
                                    { id: "kalp", label: "Kalp" },
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => updateField("shape", s.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all text-center ${formData.shape === s.id
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-white bg-white hover:border-slate-200 text-slate-500"
                                            }`}
                                    >
                                        <span className="text-sm font-bold">{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Allergy Warning */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
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
                                        <p className="text-[10px] text-muted-foreground">Lütfen detayları belirtin.</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${hasAllergy ? "bg-red-500" : "bg-slate-200"}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${hasAllergy ? "left-5" : "left-1"}`} />
                                </div>
                            </button>

                            {hasAllergy && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <Textarea
                                        placeholder="Lütfen alerjik durumunuzu belirtin (Maks 500 karakter)"
                                        maxLength={500}
                                        className="rounded-xl border-red-200 focus:ring-red-500 focus:border-red-500 min-h-[100px] bg-white text-sm"
                                        value={formData.allergyInfo || ""}
                                        onChange={(e) => updateField("allergyInfo", e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Flavors & Ingredients (Free Text) */}
                {currentStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                        {[
                            { id: "flavor", label: "Kek (Pandispanya)", placeholder: "Örn: Vanilyalı, Kavunlu..." },
                            { id: "filling", label: "Dolgu Kreması", placeholder: "Örn: Antep Fıstıklı, Frambuazlı..." },
                            { id: "frosting", label: "Dış Kaplama", placeholder: "Örn: Şeker Hamuru, Naked..." },
                        ].map((group) => (
                            <div key={group.id} className="space-y-3">
                                <Label className="text-base font-bold flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-primary" /> {group.label}
                                </Label>
                                <Input
                                    placeholder={group.placeholder}
                                    maxLength={25}
                                    className="rounded-xl border-2 border-slate-100 h-12 bg-white focus:border-primary/30"
                                    value={formData[group.id as keyof CustomRequestSpec] as string || ""}
                                    onChange={(e) => updateField(group.id as any, e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground pl-1">Maksimum 25 karakter girebilirsiniz.</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 3: GenAI Chat */}
                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-[60vh] flex flex-col gap-4">
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border-2'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        {msg.image && (
                                            <div className="mt-3 rounded-xl overflow-hidden shadow-lg border-2 border-slate-100">
                                                <img src={msg.image} alt="Tasarım" className="w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border-2 rounded-2xl p-4 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">AI tasarlıyor...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="relative group">
                            <div className="absolute -top-12 left-0 right-0 flex gap-2 h-10 overflow-x-auto pb-2 px-1">
                                {referenceImages.map((img, i) => (
                                    <div key={i} className="relative h-8 w-8 shrink-0 rounded-md overflow-hidden border-2 border-primary/20">
                                        <img src={img} className="h-full w-full object-cover" />
                                        <button
                                            onClick={() => setReferenceImages(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                                        >
                                            <Trash2 className="h-2 w-2" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Textarea
                                placeholder="Tasarımı detaylandırın (Örn: Üzerine kırmızı güller ekle, ismi yaz...)"
                                className="min-h-[100px] rounded-2xl border-2 pr-24 focus:ring-primary/20 bg-white"
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAISend();
                                    }
                                }}
                            />
                            <div className="absolute bottom-3 right-3 flex gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    <Upload className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleAISend}
                                    disabled={loading || !userPrompt.trim()}
                                    className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 transition-all hover:scale-105"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {(formData.aiImage || referenceImages.length > 0) && (
                            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-2xl border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border bg-white flex items-center justify-center">
                                        {formData.aiImage ? (
                                            <img src={formData.aiImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-primary uppercase tracking-wider">
                                            {referenceImages.length > 0 ? `${referenceImages.length} Görsel Yüklendi` : "Mevcut Tasarım"}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                            {formData.aiPrompt || "Referans görselleriniz hazır."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold" onClick={() => {
                                        resetAI();
                                        setReferenceImages([]);
                                    }}>Sıfırla</Button>
                                    <Button size="sm" className="h-8 text-[10px] font-bold gap-1 rounded-lg" onClick={handleNext}>Sonraki Adım <ArrowRight className="h-3 w-3" /></Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Final Details (Simplified) */}
                {currentStep === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" /> Ek Notlar & Tercihler (Opsiyonel)
                            </Label>
                            <Textarea
                                placeholder="Eklemek istediğiniz diğer detaylar veya özel ricalarınız..."
                                className="min-h-[200px] rounded-2xl border-2 bg-white text-sm"
                                value={formData.notes || ""}
                                onChange={(e) => updateField("notes", e.target.value)}
                            />
                            <p className="text-[11px] text-muted-foreground italic">
                                * Pasta üzerine yazılacak notu veya teslimat detaylarını buradan belirtebilirsiniz.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* General Footer Navigation for all steps except AI step */}
            {currentStep !== 3 && (
                <div className="fixed bottom-0 inset-x-0 z-20 bg-background/90 backdrop-blur-md px-4 py-4 border-t flex gap-3 max-w-2xl mx-auto w-full">
                    {currentStep > 1 && (
                        <Button variant="outline" size="lg" className="flex-1 rounded-2xl h-14" onClick={handleBack} disabled={loading}>Geri</Button>
                    )}
                    <Button
                        size="lg"
                        className="flex-[2] rounded-2xl h-14 font-black text-lg gap-2 shadow-xl shadow-primary/20"
                        onClick={handleNext}
                        disabled={loading}
                    >
                        {currentStep === STEPS.length ? (loading ? 'Oluşturuluyor...' : 'Talebi Gönder') : 'Devam Et'}
                        {!loading && <ArrowRight className="h-5 w-5" />}
                    </Button>
                </div>
            )}
        </div>
    );
}
