import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    BarChart3,
    Settings,
    Home,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleSwitcher from './RoleSwitcher';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../PageTransition';

const sidebarItems = [
    { to: '/pastane/panel', icon: LayoutDashboard, label: 'Panel' },
    { to: '/pastane/siparisler', icon: Package, label: 'Siparişler' },
    { to: '/pastane/finans', icon: BarChart3, label: 'Finansal Özet' },
];

export default function VendorLayout() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 240 }}
                className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border p-4 relative transition-all duration-300 ease-in-out"
            >
                <div className={`font-display font-bold text-lg text-sidebar-foreground mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                    {isCollapsed ? "🎂" : "🎂 Pastane"}
                </div>

                <nav className="flex flex-col gap-2">
                    {sidebarItems.map(({ to, icon: Icon, label }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 ${active ? '' : 'text-slate-400'}`} />
                                {!isCollapsed && <span>{label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto flex flex-col gap-2">
                    <Link
                        to="/pastane/ayarlar"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${location.pathname === '/pastane/ayarlar' ? 'bg-primary text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                            }`}
                    >
                        <Settings className="h-5 w-5 text-slate-400" />
                        {!isCollapsed && <span>Ayarlar</span>}
                    </Link>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent transition-all"
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        {!isCollapsed && <span>Paneli Gizle</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border h-14 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="md:hidden">
                            <Home className="h-5 w-5 text-primary" />
                        </Link>
                        <span className="font-display font-bold text-lg md:hidden">🎂 Pastane</span>

                        <Button variant="ghost" size="sm" asChild className="hidden md:flex text-muted-foreground hover:text-primary font-bold">
                            <Link to="/magaza/v1" className="gap-2">
                                <Home className="h-4 w-4" />
                                <span>Mağazayı Gör</span>
                            </Link>
                        </Button>
                    </div>
                    <RoleSwitcher />
                </header>
                <main className="flex-1 overflow-x-hidden bg-slate-50/50">
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                            <Outlet />
                        </PageTransition>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
