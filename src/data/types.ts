// Re-export all types from the main types file
// This allows imports from "@/data/types" as used by newer components
export type {
    UserRole,
    User,
    VendorProfile,
    TemplateOption,
    TemplateOptionGroup,
    TemplateProduct,
    MatchLevel,
    CustomRequestSpec,
    RequestStatus,
    CustomRequest,
    Offer,
    ChatMessage,
    ChatThread,
    OrderStatus,
    OrderStatusHistory,
    Order,
    Review,
    CartItem,
    AppSettings,
} from '@/types';
