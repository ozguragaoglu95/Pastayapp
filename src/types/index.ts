// ---- Roles & Auth ----
export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    username?: string;
    bio?: string;
    taxId?: string; // For vendors
    address?: string; // For vendors
}

// ---- Vendor ----
export interface VendorProfile {
    id: string;
    userId: string;
    name: string;
    city: string;
    district: string;
    deliveryAreas: string[];
    minLeadTimeDays: number;
    styleTags: string[];
    portfolio: string[];
    rating: number;
    reviewCount: number;
    approved: boolean;
    contactPerson: string;
    phone?: string;
    totalOrders?: number;
    ratedOrders?: number;
    commentedOrders?: number;
    restaurantPhone?: string; // New: Specific order phone
}

// ---- Template Products ----
export interface TemplateOption {
    id: string;
    label: string;
    priceAdjustment: number; // added to base price
}

export interface TemplateOptionGroup {
    id: string;
    name: string; // e.g. "Boyut", "Dolgu"
    options: TemplateOption[];
    required: boolean;
    type: 'single' | 'multi';
}

export interface TemplateProduct {
    id: string;
    vendorId: string;
    name: string;
    description: string;
    basePrice: number;
    image: string;
    gallery: string[];
    category: string;
    optionGroups: TemplateOptionGroup[];
    prepTimeDays: number;
    portionCount: number;
    rating: number;
    reviewCount: number;
    occasion?: string;
    dietaryLabels?: string[]; // e.g., ["Glutensiz", "Vegan", "Şekersiz"]
}

// ---- Custom Request ----
export type MatchLevel = 'EXACT' | 'CLOSE' | 'INSPIRED';

export interface CustomRequestSpec {
    occasion: string; // "dogum_gunu", "nisan", "dugun", "kutlama", "diger"
    customOccasion?: string; // If occasion is "diger"
    portions: string; // "6-10", "10-15", "15+"
    shape: string; // "özel", "yuvarlak", "kare", "kalp"
    flavor: string;
    filling: string;
    frosting: string;
    message?: string;
    isCustomMessage?: boolean; // Default: false (Design message)
    notes?: string;
    aiPrompt?: string; // For GenAI phase
    aiImage?: string; // Generated AI image URL
    vendorId?: string; // For store-specific requests
    templateId?: string; // If started from a template
    eventDate: string;
    district: string;
    city: string;
    tiers: number;
    colors: string[];
    budgetMin?: number;
    budgetMax?: number;
    recipient?: string; // New: Who is the cake for (spouse, family, friend etc.)
    productTheme?: string; // New: User-defined theme on product page
    allergyInfo?: string; // New: Allergy information
    customOptions?: Record<string, string>; // New: Free text for 'Özel' options in wizard (groupId -> text)
}

export type RequestStatus = 'pending' | 'draft' | 'waiting_offers' | 'offers_received' | 'offer_selected' | 'agreed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';

export interface CustomRequest {
    id: string;
    userId: string;
    spec: CustomRequestSpec;
    referenceImages: string[];
    conceptImage?: string;
    conceptAttempts: number;
    status: RequestStatus;
    createdAt: string;
    offers: Offer[];
    selectedOfferId?: string;
    messages?: ChatMessage[]; // New: Direct chat between vendor & customer
}

// ---- Offers ----
export interface Offer {
    id: string;
    requestId: string;
    vendorId: string;
    totalPrice: number;
    earliestReady: string;
    deliverySupported: boolean;
    pickupSupported: boolean;
    matchLevel: MatchLevel;
    flags: {
        deliveryIncluded: boolean;
        print2dIncluded: boolean;
        figurine3dIncluded: boolean;
        revisionsIncluded: boolean;
        rushIncluded: boolean;
    };
    revisedConceptImage?: string;
    note: string;
    createdAt: string;
}

// ---- Chat ----
export interface ChatMessage {
    id: string;
    threadId: string;
    senderId: string;
    senderRole: UserRole;
    text: string;
    imageUrl?: string;
    createdAt: string;
}

export interface ChatThread {
    id: string;
    requestId: string;
    participants: string[]; // user IDs
    messages: ChatMessage[];
}

// ---- Orders ----
export type OrderStatus = 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';

export interface OrderStatusHistory {
    status: OrderStatus;
    timestamp: string;
    note?: string;
}

export interface Order {
    id: string;
    requestId?: string;
    templateProductId?: string;
    userId: string;
    vendorId: string;
    totalPrice: number;
    commission: number;
    status: OrderStatus;
    statusHistory: OrderStatusHistory[];
    agreedReferenceImage?: string;
    deliveryAddress?: string;
    hasChangeRequest?: boolean; // New: For vendor notification
    createdAt: string;
}

// ---- Review ----
export interface Review {
    id: string;
    orderId: string;
    userId: string;
    vendorId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

// ---- Cart ----
export interface CartItem {
    templateProductId: string;
    selectedOptions: Record<string, string[]>; // groupId -> optionId[]
    quantity: number;
    unitPrice: number;
    cakeNote?: string;
    recipient?: string;
    theme?: string;
    allergyInfo?: string;
    customExtras?: string[]; // e.g., ["Candle", "Greeting Card"]
}

// ---- Settings ----
export interface AppSettings {
    commissionRate: number;
    retentionDays: number;
    aiRegenerateLimit: number;
}
