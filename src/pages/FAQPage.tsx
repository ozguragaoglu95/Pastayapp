import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const faqs = [
    {
        question: "Sipariş süreci nasıl işler?",
        answer: "Beğendiğiniz bir pasta şablonunu seçip kişiselleştirebilir veya 'Tasarla' bölümünden kendi hayalinizdeki pastayı tarif ederek satıcılardan teklif alabilirsiniz. Teklifi onayladıktan sonra ödemenizi yaparak siparişinizi kesinleştirirsiniz."
    },
    {
        question: "Özel tasarım pasta için görsel yükleyebilir miyim?",
        answer: "Evet! 'Tasarla' bölümünde hayalinizdeki pastayı anlatırken elinizdeki referans görselleri de yükleyebilirsiniz. Şeflerimiz bu görsellere göre size en uygun teklifi sunacaktır."
    },
    {
        question: "Teslimat bölgeleri nerelerdir?",
        answer: "Şu an için sadece İstanbul genelinde hizmet vermekteyiz. Her satıcının kendi teslimat alanı (Kadıköy, Beşiktaş vb.) profilinde açıkça belirtilmiştir."
    },
    {
        question: "Siparişimi ne kadar önceden vermeliyim?",
        answer: "Butik pastalar hazırlık gerektirdiği için her ürünün farklı bir hazırlık süresi vardır (genellikle 2-5 gün). Ürün detay sayfasında 'Hazırlık Süresi' bilgisini görebilirsiniz."
    },
    {
        question: "İptal ve iade koşulları nelerdir?",
        answer: "Üretime başlanmamış siparişlerinizi hazırlık süresi başlamadan 24 saat öncesine kadar iptal edebilirsiniz. Özel üretim ürünlerde üretime başlandıktan sonra iade yapılamamaktadır."
    }
];

const FAQPage = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-200">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="flex-1 font-display text-lg font-bold">Soru & Cevap</h1>
            </div>

            <div className="px-6 py-8 space-y-8 max-w-2xl mx-auto w-full">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-display font-black text-slate-900">Size nasıl yardımcı olabiliriz?</h2>
                    <p className="text-slate-500 text-sm">Merak ettiğiniz tüm konuları burada bulabilirsiniz.</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Soru ara..."
                        className="pl-10 h-12 rounded-2xl border-white shadow-sm focus:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Accordion */}
                <div className="space-y-3">
                    {filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="font-bold text-slate-800 text-sm">{faq.question}</span>
                                {openIndex === index ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                            </button>
                            {openIndex === index && (
                                <div className="px-5 pb-5 pt-0">
                                    <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            Aradığınız kriterlere uygun sonuç bulunamadı.
                        </div>
                    )}
                </div>

                {/* Support Box */}
                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex flex-col items-center text-center space-y-4 mt-8">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <MessageCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-slate-900">Hala yardıma mı ihtiyacınız var?</h4>
                        <p className="text-[11px] text-slate-500 px-4">Destek ekibimiz her türlü sorunuz için yanınızda.</p>
                    </div>
                    <Button size="sm" className="rounded-full px-6">Bize Ulaşın</Button>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
