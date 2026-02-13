import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Brand */}
                <div className="space-y-4">
                    <div className="text-2xl font-display font-black text-white">
                        🎂 KEK<span className="text-primary text-sm">.craft</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">
                        İstanbul'un en iyi butik pastacıları ile hayallerinizi gerçeğe dönüştürüyoruz. Her lokma bir sanat eseri.
                    </p>
                    <div className="flex gap-4">
                        <Instagram className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                        <Facebook className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                        <Twitter className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Kurumsal</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                        <li><Link to="/sss" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
                        <li><Link to="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
                        <li><Link to="/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">İletişim</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                            <span>Merkez Efendi, Zeytinburnu, İstanbul</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-primary shrink-0" />
                            <span>+90 (212) 123 45 67</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary shrink-0" />
                            <span>merhaba@kekcraft.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 uppercase tracking-widest">
                © 2026 CakeCraft Platformu. Tüm Hakları Saklıdır.
            </div>
        </footer>
    );
};

export default Footer;
