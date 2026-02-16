import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, ClipboardList, User } from 'lucide-react';

const navItems = [
    { to: '/', icon: Home, label: 'Ana Sayfa' },
    { to: '/tasarimlar', icon: Search, label: 'Tasarımlar' },
    { to: '/tasarla', icon: PlusCircle, label: 'Tasarla' },
    { to: '/taleplerim', icon: ClipboardList, label: 'Taleplerim' },
    { to: '/profil', icon: User, label: 'Profil' },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom md:hidden">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {navItems.map(({ to, icon: Icon, label }) => {
                    const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon className={`h-5 w-5 ${to === '/tasarla' ? 'h-6 w-6' : ''}`} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
