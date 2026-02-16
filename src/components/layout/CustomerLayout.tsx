import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../PageTransition';

export default function CustomerLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pb-20 max-w-5xl mx-auto w-full overflow-x-hidden">
                <Outlet />
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
}
