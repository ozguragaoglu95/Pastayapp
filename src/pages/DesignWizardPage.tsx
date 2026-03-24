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
    { id: 1, title: "Temel Bilgiler", icon: Type },
    { id: 2, title: "İçerik & Alerji", icon: Palette },
    { id: 3, title: "AI Tasarım", icon: Sparkles },
];

export default function DesignWizardPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addRequest, updateRequestSpec, getRequestById } = useRequests();
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
    const [hasAllergy, setHasAllergy] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Smart Sticky Bar Logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling DOWN
                setIsVisible(false);
            } else {
                // Scrolling UP
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const [formData, setFormData] = useState<Partial<CustomRequestSpec>>({
        occasion: "dogum_gunu",
        portions: portionsParam || undefined,
        recipient: recipientParam || undefined,
        productTheme: themeParam || undefined,
        allergyInfo: allergyParam ? decodeURIComponent(allergyParam) : undefined,
        flavor: undefined,
        filling: undefined,
        frosting: undefined,
        isCustomMessage: false,
        vendorId: vendorId || undefined,
        templateId: templateId || undefined,
        customOptions: {},
        productThemeCustom: "",
        notes: "",
    });

    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const [selectedAIImage, setSelectedAIImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // AI Chat State
    const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user'; text: string; images?: string[]; imageNames?: string[]; selectedImage?: string }[]>([]);
    const [userPrompt, setUserPrompt] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [createdRequestId, setCreatedRequestId] = useState<string | null>(() => {
        const isReset = new URLSearchParams(window.location.search).get('reset') === 'true';
        return isReset ? null : localStorage.getItem('pending_request_id');
    });
    const [view, setView] = useState<'wizard' | 'summary'>(() => {
        const isReset = new URLSearchParams(window.location.search).get('reset') === 'true';
        return isReset ? 'wizard' : (localStorage.getItem('wizard_view') as any) || 'wizard';
    });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [editableDesignName, setEditableDesignName] = useState("");
    const [versionMap, setVersionMap] = useState<Record<string, number>>({});
    const [lastSelectedStyle, setLastSelectedStyle] = useState<string | null>(null);
    const [lastSelectedBaseName, setLastSelectedBaseName] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<{ id: string; label: string; options?: string[] } | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [isNotesDirty, setIsNotesDirty] = useState(false);
    const [originalNotes, setOriginalNotes] = useState("");

    // Restoration and Persistence
    useEffect(() => {
        const isReset = searchParams.get('reset') === 'true';
        const pendingData = localStorage.getItem('pending_design_data');

        // Reset if requested OR if it's a guest with old data (guests always start fresh)
        if (isReset || (!user && pendingData)) {
            localStorage.removeItem('wizard_view');
            localStorage.removeItem('pending_request_id');
            localStorage.removeItem('pending_design_data');
            localStorage.removeItem('pending_images');
            localStorage.removeItem('pending_chat');
            localStorage.removeItem('pending_step');
            localStorage.removeItem('pending_ai_image');
            localStorage.removeItem('pending_design_name');
            localStorage.removeItem('auto_submit');

            if (isReset || (!user && pendingData)) {
                setFormData({
                    occasion: "dogum_gunu",
                    portions: searchParams.get('portions') || undefined,
                    recipient: searchParams.get('recipient') || undefined,
                    productTheme: searchParams.get('theme') || undefined,
                    allergyInfo: searchParams.get('allergy') ? decodeURIComponent(searchParams.get('allergy')!) : undefined,
                    vendorId: vendorId || undefined,
                    templateId: templateId || undefined,
                    customOptions: {},
                    productThemeCustom: "",
                    notes: "",
                });
                setView('wizard');
                setCreatedRequestId(null);
                setCurrentStep(templateId ? 2 : 1);
                setChatMessages([]);
                setSelectedAIImage(null);
                setReferenceImages([]);
                if (isReset) return;
            }
        }

        if (pendingData && user) {
            try {
                const parsed = JSON.parse(pendingData);
                setFormData(parsed);
                if (parsed.allergyInfo) setHasAllergy(true);

                const savedImages = localStorage.getItem('pending_images');
                if (savedImages) setReferenceImages(JSON.parse(savedImages));

                const savedChat = localStorage.getItem('pending_chat');
                if (savedChat) setChatMessages(JSON.parse(savedChat));

                const savedStep = localStorage.getItem('pending_step');
                if (savedStep) setCurrentStep(parseInt(savedStep));

                const savedView = localStorage.getItem('pending_view');
                if (savedView) setView(savedView as any);

                const savedAIImage = localStorage.getItem('pending_ai_image');
                if (savedAIImage) setSelectedAIImage(savedAIImage);

                const savedDesignName = localStorage.getItem('pending_design_name');
                if (savedDesignName) setEditableDesignName(savedDesignName);

                // Clear persistence after restoration
                localStorage.removeItem('pending_chat');
                localStorage.removeItem('pending_step');
                localStorage.removeItem('pending_view');
                localStorage.removeItem('pending_ai_image');
                localStorage.removeItem('pending_design_name');

                if (localStorage.getItem('auto_submit') === 'true' && user) {
                    localStorage.removeItem('auto_submit');
                    handleCreateRequest(parsed, savedImages ? JSON.parse(savedImages) : []);
                }
            } catch (e) {
                console.error("Restoration failed", e);
            }
        }
    }, [user]);

    const handleCreateRequest = async (data: any, images: string[]) => {
        setLoading(true);
        try {
            const newRequest = addRequest({
                userId: user!.id,
                spec: data as CustomRequestSpec,
                referenceImages: images,
                conceptAttempts: 1,
            });
            setCreatedRequestId(newRequest.id);
            localStorage.setItem('pending_request_id', newRequest.id);
            setOriginalNotes(data.notes || "");
            setIsNotesDirty(false);
            setView('summary');
            localStorage.setItem('wizard_view', 'summary');
            toast({ title: "Talebiniz Oluşturuldu! 🥂", description: "Detayları aşağıda görebilirsiniz." });
        } catch (error) {
            toast({ title: "Hata", description: "Bir sorun oluştu.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const generateMeaningfulPrompt = (data: Partial<CustomRequestSpec>, hasAllergy: boolean) => {
        const getVal = (cat: string) => {
            const val = data[cat as keyof CustomRequestSpec] as string;
            if (val === 'Özel') return data.customOptions?.[cat] || '';
            return val;
        };

        const occasionText = data.occasion === 'diger' ? (data.customOccasion || 'Özel bir kutlama') : (data.occasion === 'dogum_gunu' ? 'doğum günü' : 'kutlama');
        const portions = data.portions ? `${data.portions} kişilik` : 'bir';
        const recipientText = data.recipient === 'Özel' ? data.customOptions?.recipient : data.recipient;
        const recipientPart = recipientText ? `${recipientText} için ` : "";

        const flavorPart = data.flavor ? `${getVal('flavor')} kekli, ` : "";
        const fillingPart = data.filling ? `${getVal('filling')} dolgulu ` : "";
        const frostingPart = data.frosting ? `ve ${getVal('frosting')} kaplamalı ` : "";
        const otherThemePart = (themeParam === 'diger' && data.productThemeCustom) ? `tema detayı olarak "${data.productThemeCustom}" konseptini içeren, ` : "";

        return `${recipientPart}${occasionText.toLowerCase()} konseptine uygun, ${portions}, ${otherThemePart}${flavorPart}${fillingPart}${frostingPart}harika bir pasta hayal ediyoruz.`;
    };

    // Initial AI message
    useEffect(() => {
        const isFirstVisit = chatMessages.length === 0 || (chatMessages.length === 1 && chatMessages[0].role === 'ai');
        if (currentStep === 3 && isFirstVisit) {
            const getVal = (cat: string) => {
                const val = formData[cat as keyof CustomRequestSpec] as string;
                if (val === 'Özel') return formData.customOptions?.[cat] || '';
                return val;
            };

            const recipientText = formData.recipient === 'Özel' ? formData.customOptions?.recipient : formData.recipient;
            const occasionText = formData.occasion === 'diger' ? (formData.customOccasion || 'Özel') : (formData.occasion === 'dogum_gunu' ? 'Doğum Günü' : formData.occasion?.replace("_", " "));
            const portionsText = formData.portions ? `${formData.portions} kişilik` : 'bir';
            const flavor = getVal('flavor') || '---';
            const filling = getVal('filling') || '---';
            const frosting = getVal('frosting') || '---';

            const summaryMessage = `"${recipientText} için ${flavor} kekli, ${filling} dolgulu ve ${frosting} kaplamalı ${portionsText} bir ${occasionText} pastası istediğini söyledin. Şimdi pastanın nasıl gözükmesini istediğini tarif edebilirsin."`;

            const initialMessage = wizardMode === 'template_revision' && template
                ? `Merhaba! Seçmiş olduğunuz "${template.name}" tasarımı üzerinde ne gibi özelleştirmeler yapalım? ${summaryMessage}`
                : `Merhaba! Hayalindeki pastayı tasarlamaya hazır mısın? ${summaryMessage}`;

            setChatMessages([{ role: 'ai', text: initialMessage }]);
        }
    }, [currentStep, formData]);

    const isStep1Valid = () => {
        const { occasion, portions, recipient, customOptions, customOccasion } = formData;
        const recipientValid = recipient ? (recipient === 'Özel' ? (customOptions?.recipient?.trim().length || 0) >= 3 : true) : false;
        const occasionValid = occasion ? (occasion === 'diger' ? (customOccasion?.trim().length || 0) >= 3 : true) : false;
        return !!(occasionValid && portions && recipientValid);
    };

    const isStep2Valid = () => {
        const cats = ['flavor', 'filling', 'frosting'];
        const ingredientsValid = cats.every(cat => {
            const val = formData[cat as keyof CustomRequestSpec] as string;
            if (!val) return false;
            if (val === 'Özel') return (formData.customOptions?.[cat]?.trim().length || 0) >= 3;
            return true;
        });
        const otherThemeValid = themeParam === 'diger' ? (formData.productThemeCustom?.trim().length || 0) >= 3 : true;
        const allergyValid = hasAllergy ? (formData.allergyInfo?.trim().length || 0) >= 5 : true;
        return ingredientsValid && otherThemeValid && allergyValid;
    };

    const handleNext = () => {
        if (currentStep === 1 && !isStep1Valid()) return;
        if (currentStep === 2 && !isStep2Valid()) return;
        if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        else navigate(-1);
    };

    const handleAISend = async () => {
        if (!userPrompt.trim()) return;
        setChatMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
        const currentPrompt = userPrompt;
        setUserPrompt("");
        setLoading(true);

        const getVal = (cat: string) => {
            const val = formData[cat as keyof CustomRequestSpec] as string;
            if (val === 'Özel') return formData.customOptions?.[cat] || '';
            return val;
        };
        const recipientText = formData.recipient === 'Özel' ? formData.customOptions?.recipient : formData.recipient;
        const recipientPart = recipientText ? `${recipientText} için ` : "";
        const flavorPart = formData.flavor ? `${getVal('flavor')} kekli, ` : "";
        const fillingPart = formData.filling ? `${getVal('filling')} dolgulu, ` : "";
        const frostingPart = formData.frosting ? `${getVal('frosting')} kaplamalı ` : "";
        const otherThemePart = themeParam === 'diger' && formData.productThemeCustom ? `Tema Detayı: ${formData.productThemeCustom}, ` : "";
        const contextPrompt = `İçerik: ${recipientPart}${formData.portions} kişilik, ${otherThemePart}${flavorPart}${fillingPart}${frostingPart}.`;

        await new Promise(r => setTimeout(r, 2500));

        let designNames: string[] = [];
        const styles = ["Zarif", "Modern", "Işıltılı", "Klasik", "Doğal", "Görkemli", "Minimalist", "Renkli"].sort(() => 0.5 - Math.random()).slice(0, 4);

        if (lastSelectedBaseName) {
            const nextVersion = (versionMap[lastSelectedBaseName] || 1) + 1;
            const styleToUse = lastSelectedStyle || "Özel";
            designNames = styles.map(() => `${lastSelectedBaseName} ${styleToUse} v${nextVersion}`);
            setVersionMap(prev => ({ ...prev, [lastSelectedBaseName]: nextVersion }));
        } else {
            const basePool = ["Büyülü Rüya", "Zarif Senfoni", "Işıltılı Vals", "Düşsel Bahçe", "Mistik Lezzet", "Kraliyet Tacı", "Gökkuşağı Esintisi", "Pudra Şekeri", "Kadifemsi Dokunuş", "Altın Oran", "Sonsuz Aşk", "Yıldız Tozu"].sort(() => 0.5 - Math.random()).slice(0, 4);
            designNames = basePool;
            const newMap = { ...versionMap };
            basePool.forEach(name => newMap[name] = 1);
            setVersionMap(newMap);
        }

        setChatMessages(prev => [...prev, {
            role: 'ai',
            text: `İsteklerinize göre tasarımları hazırladım. Lütfen birini seçin:`,
            images: [
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1464344580461-991823126764?auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&w=500&q=80"
            ],
            imageNames: designNames
        }]);
        setSelectedAIImage(null);
        setLoading(false);
    };

    const handleSelectImage = (msgIndex: number, imgUrl: string, name: string) => {
        setChatMessages(prev => prev.map((msg, idx) => ({ ...msg, selectedImage: (idx === msgIndex) ? imgUrl : undefined })));

        const basePool = ["Büyülü Rüya", "Zarif Senfoni", "Işıltılı Vals", "Düşsel Bahçe", "Mistik Lezzet", "Kraliyet Tacı", "Gökkuşağı Esintisi", "Pudra Şekeri", "Kadifemsi Dokunuş", "Altın Oran", "Sonsuz Aşk", "Yıldız Tozu"];
        const matchedBase = basePool.find(b => name.startsWith(b)) || name;
        const rest = name.replace(matchedBase, "").trim();
        const style = rest.split(" ")[0] || null;

        setLastSelectedBaseName(matchedBase);
        setLastSelectedStyle(style);
        setSelectedAIImage(imgUrl);
        setEditableDesignName(name);
        updateField("aiImage", imgUrl);
    };

    const resetAI = () => {
        setChatMessages([]);
        setSelectedAIImage(null);
        updateField("aiImage", undefined);
        setCurrentStep(2);
        setTimeout(() => setCurrentStep(3), 10);
    };

    const handleSubmit = async () => {
        if (!user) {
            // Save EVERYTHING for guest persistence
            localStorage.setItem('pending_design_data', JSON.stringify(formData));
            localStorage.setItem('pending_images', JSON.stringify(referenceImages));
            localStorage.setItem('pending_chat', JSON.stringify(chatMessages));
            localStorage.setItem('pending_step', currentStep.toString());
            localStorage.setItem('pending_view', view);
            localStorage.setItem('pending_ai_image', selectedAIImage || "");
            localStorage.setItem('pending_design_name', editableDesignName);
            localStorage.setItem('auto_submit', 'true');
            navigate("/register", { state: { from: { pathname: "/tasarla" } } });
            return;
        }
        handleCreateRequest(formData, referenceImages);
    };

    const updateField = (field: keyof CustomRequestSpec, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = () => {
        if (!editingField) return;
        const field = editingField.id as keyof CustomRequestSpec;
        const updated = { ...formData, [field]: editValue };
        setFormData(updated);
        if (createdRequestId) updateRequestSpec(createdRequestId, updated as CustomRequestSpec);
        setEditingField(null);
        toast({ title: "Güncellendi" });
    };

    const handleSaveNotes = () => {
        if (createdRequestId) {
            updateRequestSpec(createdRequestId, { notes: formData.notes } as any);
            setOriginalNotes(formData.notes || "");
            setIsNotesDirty(false);
            toast({ title: "Notlar Kaydedildi" });
        }
    };

    const isEditable = () => {
        if (!createdRequestId) return true;
        const req = getRequestById(createdRequestId);
        return req?.status === 'pending' || req?.status === 'draft' || req?.status === 'waiting_offers';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setReferenceImages(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    if (view === 'summary') {
        return (
            <div className="fixed inset-0 z-[50] bg-slate-50 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4 py-8 space-y-8 pb-32">
                    <div className="text-center space-y-2">
                        <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-10 w-10" />
                        </div>
                        <h1 className="text-3xl font-display font-black">Talep Oluşturuldu!</h1>
                        <p className="text-muted-foreground">Talebiniz başarıyla kaydedildi. İşte detaylar:</p>
                    </div>

                    <div className="bg-white rounded-3xl border-2 p-6 space-y-6 shadow-sm">
                        {selectedAIImage && (
                            <div className="pb-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Seçilen AI Tasarımı</p>
                                    <Badge variant="secondary" className="text-[10px] font-black">{editableDesignName}</Badge>
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden border-2 bg-slate-50">
                                    <img src={selectedAIImage} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <div className={`space-y-1 ${isEditable() ? 'cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors' : ''}`}
                                onClick={() => {
                                    if (isEditable()) {
                                        setEditingField({ id: 'occasion', label: 'Etkinlik', options: ["dogum_gunu", "nisan", "dugun", "kutlama", "diger"] });
                                        setEditValue(formData.occasion || "");
                                    }
                                }}>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Etkinlik</p>
                                <p className="font-bold capitalize">{formData.occasion?.replace("_", " ")}</p>
                            </div>
                            <div className={`space-y-1 ${isEditable() ? 'cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors' : ''}`}
                                onClick={() => {
                                    if (isEditable()) {
                                        setEditingField({ id: 'portions', label: 'Kişi Sayısı', options: ["6-10", "10-15", "15+"] });
                                        setEditValue(formData.portions || "");
                                    }
                                }}>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Kişi Sayısı</p>
                                <p className="font-bold">{formData.portions}</p>
                            </div>
                            <div className={`space-y-1 ${isEditable() ? 'cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors' : ''}`}
                                onClick={() => {
                                    if (isEditable()) {
                                        setEditingField({ id: 'recipient', label: 'Kim İçin', options: ["Eşim/Sevgilim", "Kendim", "Çocuğum", "Özel"] });
                                        setEditValue(formData.recipient || "");
                                    }
                                }}>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Kim İçin</p>
                                <p className="font-bold">{formData.recipient}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t grid grid-cols-3 gap-4">
                            <div className={`space-y-1 ${isEditable() ? 'cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors' : ''}`}
                                onClick={() => {
                                    if (isEditable()) {
                                        setEditingField({ id: 'flavor', label: 'Kek', options: ["Vanilya", "Çikolata", "Red Velvet"] });
                                        setEditValue(formData.flavor || "");
                                    }
                                }}>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Kek</p>
                                <p className="text-sm font-bold">{formData.flavor === 'Özel' ? formData.customOptions?.flavor : formData.flavor}</p>
                            </div>
                            <div className={`space-y-1 ${isEditable() ? 'cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors' : ''}`}
                                onClick={() => {
                                    if (isEditable()) {
                                        setEditingField({ id: 'filling', label: 'Dolgu', options: ["Antep Fıstığı", "Frambuaz", "Ganaj"] });
                                        setEditValue(formData.filling || "");
                                    }
                                }}>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Dolgu</p>
                                <p className="text-sm font-bold">{formData.filling === 'Özel' ? formData.customOptions?.filling : formData.filling}</p>
                            </div>
                            <div className={`space-y-1 ${isEditable() ? 'cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors' : ''}`}
                                onClick={() => {
                                    if (isEditable()) {
                                        setEditingField({ id: 'frosting', label: 'Kaplama', options: ["Şeker Hamuru", "Krem Şanti", "Naked"] });
                                        setEditValue(formData.frosting || "");
                                    }
                                }}>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Kaplama</p>
                                <p className="text-sm font-bold">{formData.frosting === 'Özel' ? formData.customOptions?.frosting : formData.frosting}</p>
                            </div>
                        </div>

                        {hasAllergy && (
                            <div className="pt-6 border-t p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-red-900">Alerji Bilgisi</p>
                                    <p className="text-sm text-red-800 font-medium">{formData.allergyInfo}</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" /> Ek Notlar & Tercihler (Opsiyonel)
                            </Label>
                            <div className="relative">
                                <Textarea
                                    placeholder="Satıcıya iletmek istediğiniz diğer detaylar veya özel ricalarınız..."
                                    className="min-h-[140px] rounded-2xl border-2 bg-slate-50 text-sm focus:bg-white transition-colors pr-16"
                                    value={formData.notes || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        updateField("notes", newValue);
                                        setIsNotesDirty(newValue !== (originalNotes || ""));
                                    }}
                                />
                                <Button
                                    size="sm"
                                    className="absolute bottom-3 right-3 h-8 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm"
                                    disabled={!isNotesDirty}
                                    onClick={handleSaveNotes}
                                >
                                    <Check className="h-3 w-3 mr-1" /> Kaydet
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Actions Footer - Sticky to stop at footer */}
                    <div className={`sticky bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md p-4 border-t flex flex-col gap-3 max-w-2xl mx-auto w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)] mt-auto transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" size="lg" className="rounded-2xl h-14" onClick={() => navigate("/")} disabled={isNotesDirty}>Anasayfa</Button>
                            <Button variant="outline" size="lg" className="rounded-2xl h-14" onClick={() => navigate("/taleplerim")} disabled={isNotesDirty}>Taleplerim</Button>
                        </div>
                        <Button
                            size="lg"
                            className="rounded-2xl h-14 font-black text-lg shadow-xl shadow-primary/20"
                            disabled={isNotesDirty}
                            onClick={() => {
                                localStorage.removeItem('wizard_view');
                                localStorage.removeItem('pending_request_id');
                                window.location.href = '/tasarla?reset=true';
                            }}
                        >
                            Yeni Tasarım
                        </Button>
                    </div>
                </div>

                {/* Edit Dialogs */}
                <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
                    <DialogContent className="rounded-3xl max-w-sm">
                        <DialogHeader><DialogTitle className="text-lg font-black">{editingField?.label} Güncelle</DialogTitle></DialogHeader>
                        <div className="py-4">
                            {editingField?.options ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {editingField.options.map(opt => (
                                        <button key={opt} onClick={() => setEditValue(opt)} className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${editValue === opt ? 'border-primary bg-primary/5 text-primary' : 'bg-white border-slate-100'}`}>
                                            {opt.replace("_", " ").toUpperCase()}
                                        </button>
                                    ))}
                                    <button onClick={() => setEditValue("Özel")} className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${editValue === 'Özel' ? 'border-primary bg-primary/5 text-primary' : 'bg-white border-slate-100'}`}>ÖZEL</button>
                                </div>
                            ) : (
                                <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="rounded-xl border-2 font-bold" />
                            )}
                        </div>
                        <DialogFooter><Button className="w-full rounded-xl h-12 font-bold" onClick={handleSaveEdit}>Kaydet</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 py-4 border-b">
                <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
                    <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors"><ArrowLeft className="h-5 w-5" /></button>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-1">Adım {currentStep} / {STEPS.length}</span>
                        <h1 className="font-display font-black text-sm">{STEPS[currentStep - 1].title}</h1>
                    </div>
                    <div className="w-9" />
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
            </div>

            <div className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-y-auto pb-32">
                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Hangi Etkinlik İçin?</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[{ id: "dogum_gunu", label: "Doğum Günü" }, { id: "nisan", label: "Nişan / Söz" }, { id: "dugun", label: "Düğün" }, { id: "kutlama", label: "Kutlama" }, { id: "diger", label: "Özel" }].map(opt => (
                                    <button key={opt.id} onClick={() => updateField("occasion", opt.id)} className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.occasion === opt.id ? "border-primary bg-primary/5" : "border-white bg-white hover:border-slate-200"}`}>
                                        <p className="text-sm font-bold">{opt.label}</p>
                                    </button>
                                ))}
                            </div>
                            {formData.occasion === 'diger' && <Input placeholder="Etkinliği belirtin" className="rounded-xl border-2 mt-2" value={formData.customOccasion || ""} onChange={e => updateField("customOccasion", e.target.value)} />}
                        </div>
                        <div className="space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Pastanız Kimin İçin?</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {["Eşim/Sevgilim", "Kendim", "Çocuğum", "Özel"].map(opt => (
                                    <button key={opt} onClick={() => updateField("recipient", opt)} className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.recipient === opt ? "border-primary bg-primary/5 text-primary" : "border-white bg-white"}`}>{opt}</button>
                                ))}
                            </div>
                            {formData.recipient === 'Özel' && <Input placeholder="Kimin için?" className="rounded-xl border-2 mt-2" value={formData.customOptions?.recipient || ""} onChange={e => updateField("customOptions", { ...formData.customOptions, recipient: e.target.value })} />}
                        </div>
                        <div className="space-y-4">
                            <Label className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Kaç Kişilik?</Label>
                            <div className="flex gap-3">
                                {["6-10", "10-15", "15+"].map(p => (
                                    <button key={p} onClick={() => updateField("portions", p)} className={`flex-1 p-4 rounded-2xl border-2 transition-all font-black ${formData.portions === p ? "border-primary bg-primary/5 text-primary" : "border-white bg-white"}`}>{p}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
                        {[
                            { id: "flavor", label: "Kek", options: ["Vanilya", "Çikolata", "Red Velvet"] },
                            { id: "filling", label: "Dolgu", options: ["Antep Fıstığı", "Frambuaz", "Ganaj"] },
                            { id: "frosting", label: "Kaplama", options: ["Şeker Hamuru", "Krem Şanti", "Naked"] }
                        ].map(group => (
                            <div key={group.id} className="space-y-4">
                                <Label className="text-base font-bold flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> {group.label}</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[...group.options, "Özel"].map(opt => (
                                        <button key={opt} onClick={() => updateField(group.id as any, opt)} className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData[group.id as keyof CustomRequestSpec] === opt ? "border-primary bg-primary/5 text-primary" : "border-white bg-white"}`}>{opt}</button>
                                    ))}
                                </div>
                                {formData[group.id as keyof CustomRequestSpec] === 'Özel' && <Textarea placeholder="Tercihinizi belirtin" className="rounded-xl border-2 mt-2" value={formData.customOptions?.[group.id] || ""} onChange={e => updateField("customOptions", { ...formData.customOptions, [group.id]: e.target.value })} />}
                            </div>
                        ))}

                        {themeParam === 'diger' && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <Label className="text-base font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Tema Detayı</Label>
                                <Textarea placeholder="Hayalinizdeki konsept..." className="rounded-xl border-2 min-h-[100px]" value={formData.productThemeCustom || ""} onChange={e => updateField("productThemeCustom", e.target.value)} />
                            </div>
                        )}

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <button onClick={() => setHasAllergy(!hasAllergy)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${hasAllergy ? "bg-red-50 border-red-200" : "bg-white border-slate-100"}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${hasAllergy ? "bg-red-500 text-white" : "bg-slate-100 text-slate-400"}`}><AlertCircle className="h-5 w-5" /></div>
                                    <p className={`text-sm font-black ${hasAllergy ? "text-red-900" : "text-slate-700"}`}>Alerjim Var</p>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative ${hasAllergy ? "bg-red-500" : "bg-slate-200"}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${hasAllergy ? "left-5" : "left-1"}`} /></div>
                            </button>
                            {hasAllergy && <Textarea placeholder="Detaylar..." className="rounded-xl border-red-200 min-h-[100px] mt-2" value={formData.allergyInfo || ""} onChange={e => updateField("allergyInfo", e.target.value)} />}
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-6 relative min-h-[70vh]">
                        {/* 3D Floating Chef (Clippy Style) - STICKY WITHIN CONTENT */}
                        <div className="sticky top-4 z-[40] pointer-events-none mb-[-60px] md:mb-[-100px]">
                            <div className="relative flex flex-row items-start animate-in slide-in-from-left-8 duration-700 max-w-[95vw] md:max-w-md">
                                {/* 3D Character */}
                                <div className="h-20 w-20 md:h-32 md:w-32 pointer-events-auto transform transition-all hover:scale-110 active:scale-95 duration-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] flex-shrink-0 z-10">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white/80 backdrop-blur-md relative shadow-inner">
                                        <img 
                                            src="/3d-chef.png" 
                                            className="w-full h-full object-cover scale-[1.3] translate-y-3" 
                                            alt="Chef" 
                                        />
                                    </div>
                                </div>

                                {/* Speech Bubble - Appears to the right of the character */}
                                {chatMessages.length > 0 && chatMessages[chatMessages.length - 1].role === 'ai' && (
                                    <div className="relative ml-2 mt-2 md:mt-4 p-3 md:p-5 bg-white rounded-2xl md:rounded-[2rem] border-2 border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] pointer-events-auto animate-in zoom-in-50 slide-in-from-left-5 duration-500 flex-1 max-w-[200px] md:max-w-full">
                                        <div className="relative">
                                            <p className="text-[9px] md:text-xs font-black text-slate-800 leading-tight uppercase tracking-wider text-primary">Şef Selin</p>
                                            <p className="mt-1 text-[11px] md:text-sm font-medium text-slate-700 leading-relaxed line-clamp-4 md:line-clamp-none">
                                                {chatMessages[chatMessages.length - 1].text.length > 150 
                                                    ? chatMessages[chatMessages.length - 1].text.substring(0, 150) + '...' 
                                                    : chatMessages[chatMessages.length - 1].text}
                                            </p>
                                        </div>
                                        {/* Bubble Pointer pointing LEFT towards the chef */}
                                        <div className="absolute top-4 md:top-6 -left-2 w-4 h-4 bg-white border-l-2 border-t-2 border-primary/20 -rotate-45" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Conversations Area (Traditional Chat but cleaner) */}
                        <div className="flex-1 space-y-6 overflow-y-visible pb-40 px-2 md:px-0">
                            {chatMessages.filter(m => m.role === 'user' || m.images).map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                                    <div className={`relative max-w-[85%] rounded-[1.8rem] p-5 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-white border-2 border-slate-100 text-slate-700'
                                        }`}>
                                        <p>{msg.text}</p>

                                        {msg.images && (
                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                {msg.images.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleSelectImage(i, img, msg.imageNames?.[idx] || "Tasarım")}
                                                        className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all duration-300 group ${msg.selectedImage === img
                                                            ? "border-primary shadow-xl shadow-primary/20 scale-100"
                                                            : "border-transparent opacity-90 grayscale-[30%] hover:grayscale-0"
                                                            }`}
                                                    >
                                                        <img src={img} className="w-full h-full object-cover" />
                                                        {msg.selectedImage === img && (
                                                            <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                                                                <Check className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-2 shadow-xl shadow-slate-200/50 focus-within:border-primary transition-all">
                                <div className="flex gap-2 p-2 px-4 h-10 overflow-x-auto no-scrollbar">
                                    {referenceImages.map((img, i) => (
                                        <div key={i} className="relative h-8 w-8 rounded-lg overflow-hidden border-2 border-slate-100 shrink-0 group">
                                            <img src={img} className="h-full w-full object-cover" />
                                            <button
                                                onClick={() => setReferenceImages(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {referenceImages.length === 0 && (
                                        <span className="text-xs text-slate-400 font-medium py-1">Referans fotoğraf ekleyebilirsin...</span>
                                    )}
                                </div>

                                <div className="flex items-end gap-2 p-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-12 w-12 rounded-full hover:bg-slate-100"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-5 w-5 text-slate-400" />
                                    </Button>

                                    <Textarea
                                        placeholder="Nasıl bir pasta hayal ediyorsun? (Örn: Mickey Mouse temalı, yıldızlı...)"
                                        className="min-h-[60px] max-h-[150px] border-0 focus-visible:ring-0 text-slate-700 bg-transparent py-3 placeholder:text-slate-300 font-medium"
                                        value={userPrompt}
                                        onChange={e => setUserPrompt(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAISend();
                                            }
                                        }}
                                    />

                                    <Button
                                        onClick={handleAISend}
                                        disabled={loading || !userPrompt.trim()}
                                        className="h-12 w-12 rounded-full shadow-lg shadow-primary/20 p-0"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {selectedAIImage && (
                            <div className="animate-in slide-in-from-bottom-5 duration-500 p-4 bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl flex items-center justify-between gap-4 sticky bottom-20 md:bottom-4 z-30">
                                <div className="flex items-center gap-3">
                                    <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/20">
                                        <img src={selectedAIImage} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Seçilen Tasarım</p>
                                        <h4 className="text-sm font-black text-white">{editableDesignName}</h4>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        className="h-12 w-12 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                                        onClick={resetAI}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        className="h-12 rounded-full px-6 font-black bg-white text-slate-900 hover:bg-slate-100"
                                        onClick={() => setShowConfirmDialog(true)}
                                    >
                                        Bunu İstiyorum ✨
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {view === 'wizard' && currentStep !== 3 && (
                <div className="fixed bottom-16 md:bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl bg-background/90 backdrop-blur-md px-4 py-4 border-t flex gap-3 shadow-lg">
                    {currentStep > 1 && <Button variant="outline" size="lg" className="flex-1 rounded-2xl h-14" onClick={handleBack}>Geri</Button>}
                    <Button size="lg" className="flex-[2] rounded-2xl h-14 font-black shadow-primary/20" onClick={handleNext} disabled={loading || (currentStep === 1 && !isStep1Valid()) || (currentStep === 2 && !isStep2Valid())}>
                        {currentStep === STEPS.length ? (loading ? 'Oluşturuluyor...' : 'Onayla ve Gönder') : 'Devam Et'}
                    </Button>
                </div>
            )}

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="rounded-3xl max-w-sm">
                    <DialogHeader><DialogTitle className="text-xl font-black text-center">Talep Gönderilsin mi?</DialogTitle></DialogHeader>
                    {selectedAIImage && <img src={selectedAIImage} className="w-40 h-40 mx-auto rounded-xl object-cover border-2 my-4" />}
                    <div className="space-y-4">
                        <Input value={editableDesignName} onChange={e => setEditableDesignName(e.target.value)} className="rounded-xl font-bold" placeholder="Tasarım adı..." />
                        <div className="flex gap-3"><Button variant="ghost" className="flex-1" onClick={() => setShowConfirmDialog(false)}>Vazgeç</Button><Button className="flex-1" onClick={() => { setShowConfirmDialog(false); handleSubmit(); }}>Gönder</Button></div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
