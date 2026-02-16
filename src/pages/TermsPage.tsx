import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Info } from "lucide-react";

const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-200">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="flex-1 font-display text-lg font-bold">Kullanım Koşulları</h1>
            </div>

            <div className="max-w-3xl mx-auto w-full px-6 py-8 space-y-8">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-black text-slate-900">Kullanım Koşulları</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Son Güncelleme: 15 Şubat 2026</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-xs">01</span> Hizmet Kapsamı
                            </h3>
                            <p>
                                KEK.craft, butik pastacılar ile müşterileri bir araya getiren bir platformdur. Platformumuz üzerinden pasta tasarlayabilir, hazır tasarımları inceleyebilir ve satıcılardan teklif alarak sipariş oluşturabilirsiniz.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-xs">02</span> Sipariş ve Ödeme
                            </h3>
                            <p>
                                Teklifin onaylanmasıyla birlikte sipariş süreci başlar. Ödemeler platform üzerinden güvenli bir şekilde gerçekleştirilir. Sipariş onaylanmadan üretime başlanmaz.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-xs">03</span> İptal ve İade
                            </h3>
                            <p>
                                Üretime başlanmamış siparişler, hazırlık süresi başlamadan makul bir süre önce iptal edilebilir. Hijyen ve gıda güvenliği kuralları gereği, kişiye özel üretilen gıda ürünlerinde cayma hakkı sınırlıdır.
                            </p>
                        </section>

                        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                            <Info className="h-6 w-6 text-primary shrink-0 mt-1" />
                            <p className="text-xs text-primary/80 leading-relaxed font-medium">
                                Bu koşullar platformun güvenliğini ve hem satıcının hem de alıcının haklarını korumak amacıyla düzenlenmiştir. Devam ederek bu koşulları kabul etmiş sayılırsınız.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
