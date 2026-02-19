import { Calendar, Check, Truck, Store, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Offer } from "@/types";
import { getVendorById, formatPrice } from "@/data/mock-data";

interface OfferCardProps {
    offer: Offer;
    requestId?: string;
    onAccept?: () => void;
    onClick?: () => void;
    isAccepted?: boolean;
}

export default function OfferCard({ offer, onAccept, onClick, isAccepted }: OfferCardProps) {
    const vendor = getVendorById(offer.vendorId);

    // Calculate if it's a good match based on some mocked logic or just display match level
    const matchColor = {
        'EXACT': 'bg-green-500/10 text-green-600 border-green-200',
        'CLOSE': 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
        'INSPIRED': 'bg-blue-500/10 text-blue-600 border-blue-200',
    }[offer.matchLevel] || 'bg-secondary text-secondary-foreground';

    return (
        <Card
            className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${isAccepted ? 'ring-2 ring-primary border-primary' : ''}`}
            onClick={onClick}
        >
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden">
                        {/* Avatar placeholder */}
                        <div className="h-full w-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {vendor?.name.substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">{vendor?.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className={`text-[10px] h-5 ${matchColor} border-0`}>
                                {offer.matchLevel === 'EXACT' ? 'Tam Eşleşme' : offer.matchLevel === 'CLOSE' ? 'Yakın Eşleşme' : 'Benzer Tarz'}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">★ {vendor?.rating}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="font-display font-bold text-lg text-primary">
                        {formatPrice(offer.totalPrice)}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(offer.earliestReady).toLocaleDateString("tr-TR")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {offer.deliverySupported ? <Truck className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                        <span>{offer.deliverySupported ? 'Teslimat Var' : 'Sadece Gel-Al'}</span>
                    </div>
                </div>

                {offer.note && (
                    <div className="bg-secondary/30 p-2.5 rounded-lg">
                        <p className="text-xs italic text-muted-foreground">"{offer.note}"</p>
                    </div>
                )}

                {/* Flags */}
                <div className="flex flex-wrap gap-1.5">
                    {offer.flags.deliveryIncluded && <Badge variant="secondary" className="text-[10px]">Ücretsiz Teslimat</Badge>}
                    {offer.flags.revisionsIncluded && <Badge variant="secondary" className="text-[10px]">Revizyon Hakkı</Badge>}
                </div>
            </CardContent>

            <CardFooter className="p-3 bg-secondary/10 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={onClick}>
                    <Info className="mr-1.5 h-3.5 w-3.5" /> Detaylar
                </Button>
                {onAccept && !isAccepted && (
                    <Button size="sm" className="flex-1 text-xs h-8" onClick={onAccept}>
                        <Check className="mr-1.5 h-3.5 w-3.5" /> Kabul Et
                    </Button>
                )}
                {isAccepted && (
                    <Button size="sm" variant="secondary" className="flex-1 text-xs h-8 cursor-default hover:bg-secondary">
                        <Check className="mr-1.5 h-3.5 w-3.5" /> Kabul Edildi
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
