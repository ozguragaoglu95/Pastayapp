import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { mockTemplateProducts, getVendorById, formatPrice } from "@/data/mock-data";

type SortOption = "popular" | "price_asc" | "price_desc" | "newest";

export default function TemplatesPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [sortBy, setSortBy] = useState<SortOption>("popular");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

    // Derive unique categories and occasions from data
    const categories = useMemo(() => {
        const cats = new Set(mockTemplateProducts.map(p => p.category));
        return ["all", ...cats];
    }, []);

    const occasions = useMemo(() => {
        const occs = new Set(mockTemplateProducts.map(p => p.occasion).filter(Boolean) as string[]);
        return ["all", ...occs];
    }, []);

    const allDietaryLabels = useMemo(() => {
        const labels = new Set<string>();
        mockTemplateProducts.forEach(p => {
            p.dietaryLabels?.forEach(l => labels.add(l));
        });
        return Array.from(labels);
    }, []);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let result = mockTemplateProducts;

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        // Category
        if (selectedCategory !== "all") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Occasion
        if (selectedOccasion !== "all") {
            result = result.filter((p) => p.occasion === selectedOccasion);
        }

        // Dietary
        if (selectedDietary.length > 0) {
            result = result.filter((p) =>
                selectedDietary.every(label => p.dietaryLabels?.includes(label))
            );
        }

        // Price Range
        result = result.filter(
            (p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
        );

        // Sorting
        switch (sortBy) {
            case "price_asc":
                result.sort((a, b) => a.basePrice - b.basePrice);
                break;
            case "price_desc":
                result.sort((a, b) => b.basePrice - a.basePrice);
                break;
            case "newest":
                // Mock sorting for newest (using ID as proxy)
                result.sort((a, b) => b.id.localeCompare(a.id));
                break;
            case "popular":
            default:
                result.sort((a, b) => b.rating - a.rating); // Sort by rating for popularity
                break;
        }

        return result;
    }, [searchQuery, selectedCategory, selectedOccasion, priceRange, sortBy]);

    const activeFilterCount = [
        selectedCategory !== "all",
        selectedOccasion !== "all",
        priceRange[0] > 0 || priceRange[1] < 5000,
        selectedDietary.length > 0,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSelectedCategory("all");
        setSelectedOccasion("all");
        setPriceRange([0, 5000]);
        setSortBy("popular");
        setSelectedDietary([]);
    };

    const toggleDietary = (label: string) => {
        setSelectedDietary(prev =>
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        );
    };

    return (
        <div className="flex flex-col pb-20 min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 bg-secondary border-0 h-9"
                            placeholder="Pasta ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative shrink-0">
                                <SlidersHorizontal className="h-5 w-5" />
                                {activeFilterCount > 0 && (
                                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Filtrele & Sırala</SheetTitle>
                                <SheetDescription>
                                    İstediğiniz pastayı bulmak için seçenekleri daraltın.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-6 py-6">
                                {/* Sort */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium leading-none">Sıralama</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: "popular", label: "Popüler" },
                                            { id: "newest", label: "Yeni" },
                                            { id: "price_asc", label: "Fiyat (Artan)" },
                                            { id: "price_desc", label: "Fiyat (Azalan)" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setSortBy(opt.id as SortOption)}
                                                className={`px-3 py-2 rounded-md text-sm text-left transition-colors ${sortBy === opt.id
                                                    ? "bg-primary text-primary-foreground font-medium"
                                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium leading-none">Kategori</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <Badge
                                                key={cat}
                                                variant={selectedCategory === cat ? "default" : "secondary"}
                                                className="cursor-pointer capitalize px-3 py-1"
                                                onClick={() => setSelectedCategory(cat)}
                                            >
                                                {cat === "all" ? "Tümü" : cat}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Occasion */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium leading-none">Etkinlik</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {occasions.map((occ) => (
                                            <Badge
                                                key={occ}
                                                variant={selectedOccasion === occ ? "default" : "secondary"}
                                                className="cursor-pointer capitalize px-3 py-1"
                                                onClick={() => setSelectedOccasion(occ)}
                                            >
                                                {occ === "all" ? "Tümü" : occ.replace("_", " ")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Dietary Labels */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium leading-none">Özel Tercihler</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allDietaryLabels.map((label) => (
                                            <Badge
                                                key={label}
                                                variant={selectedDietary.includes(label) ? "default" : "outline"}
                                                className={`cursor-pointer px-3 py-1 transition-all ${selectedDietary.includes(label) ? "ring-2 ring-primary/20" : ""}`}
                                                onClick={() => toggleDietary(label)}
                                            >
                                                {label}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium leading-none">Fiyat Aralığı</h3>
                                        <span className="text-sm text-muted-foreground font-mono">
                                            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="100"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1 text-center">Maksimum Fiyat</p>
                                    </div>
                                </div>
                            </div>

                            <SheetFooter className="gap-2 mt-auto">
                                <SheetClose asChild>
                                    <Button variant="outline" onClick={clearFilters} className="w-full">Temizle</Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button className="w-full">Uygula ({filteredProducts.length})</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Quick Filter Bar */}
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar pb-3">
                    <Button
                        variant={selectedCategory === 'all' ? "default" : "outline"}
                        size="sm"
                        className="rounded-full h-8 text-xs shrink-0"
                        onClick={() => setSelectedCategory('all')}
                    >
                        Tümü
                    </Button>
                    {categories.filter(c => c !== 'all').map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            className="rounded-full h-8 text-xs shrink-0 capitalize"
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <motion.div
                layout
                className="p-4 grid grid-cols-2 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => {
                            const vendor = getVendorById(product.vendorId);
                            return (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => navigate(`/sablonlar/${product.id}`)}
                                    className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden bg-secondary">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        {product.rating >= 4.5 && (
                                            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center gap-0.5">
                                                ★ {product.rating}
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                            {product.dietaryLabels?.map(label => (
                                                <Badge key={label} variant="secondary" className="bg-white/90 backdrop-blur text-[9px] h-4 py-0 px-1.5 shadow-sm border-0">
                                                    {label}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col p-3">
                                        <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
                                            {product.name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Sparkles className="h-2 w-2 text-primary" />
                                            </div>
                                            <span className="line-clamp-1">{vendor?.name}</span>
                                        </div>
                                        <div className="mt-auto pt-3 flex items-center justify-between">
                                            <span className="text-sm font-bold text-primary">
                                                {formatPrice(product.basePrice)}
                                            </span>
                                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                <ArrowLeft className="h-3 w-3 rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-2 flex flex-col items-center justify-center py-20 text-center"
                        >
                            <Search className="h-10 w-10 text-muted-foreground opacity-20 mb-4" />
                            <h3 className="text-lg font-semibold">Sonuç Bulunamadı</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Arama kriterlerinizi değiştirerek tekrar deneyin.
                            </p>
                            <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">
                                Filtreleri Temizle
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
