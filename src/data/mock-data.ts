// Centralized data access utilities
import { mockVendors } from './mock-vendors';
import { mockTemplates } from './mock-templates';
import { mockRequests, mockOffers, mockOrders } from './mock-requests';

// Lookup helpers
export const getVendorById = (id: string) => mockVendors.find(v => v.id === id);
export const getTemplateById = (id: string) => mockTemplates.find(t => t.id === id);
export const getRequestById = (id: string) => mockRequests.find(r => r.id === id);
export const getOffersByRequestId = (requestId: string) => mockOffers.filter(o => o.requestId === requestId);
export const getOrderById = (id: string) => mockOrders.find(o => o.id === id);

// Formatting
export const formatPrice = (price: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);

// Re-export for convenience
export { mockVendors, mockTemplates, mockTemplates as mockTemplateProducts, mockRequests, mockOffers, mockOrders };
