import { TemplateProduct } from '@/types';

export const mockTemplates: TemplateProduct[] = [
    {
        id: 't1',
        vendorId: 'v1',
        name: 'Orman Meyveli Rüya',
        description: 'Taze orman meyveleri ve hafif krema ile hazırlanan, vanilya pandispanyalı özel tasarım pasta.',
        basePrice: 1200,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
        gallery: [
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800'
        ],
        category: 'Doğum Günü',
        occasion: 'Doğum Günü',
        prepTimeDays: 3,
        portionCount: 10,
        rating: 4.9,
        reviewCount: 42,
        dietaryLabels: ["Yumurta İçermez"],
        optionGroups: [
            {
                id: 'size',
                name: 'Boyut',
                required: true,
                type: 'single',
                options: [
                    { id: '10p', label: '10-12 Kişilik', priceAdjustment: 0 },
                    { id: '15p', label: '15-18 Kişilik', priceAdjustment: 400 },
                    { id: '20p', label: '20-25 Kişilik', priceAdjustment: 750 },
                ]
            },
            {
                id: 'flavor',
                name: 'İçerik',
                required: true,
                type: 'single',
                options: [
                    { id: 'vanilla', label: 'Vanilya & Meyve', priceAdjustment: 0 },
                    { id: 'chocolate', label: 'Çikolata & Fıstık', priceAdjustment: 150 },
                ]
            }
        ]
    },
    {
        id: 't2',
        vendorId: 'v1',
        name: 'Minimalist Nişan Pastası',
        description: 'Zarif detaylar ve altın dokunuşlarla hazırlanan iki katlı nişan pastası.',
        basePrice: 2500,
        image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
        gallery: [],
        category: 'Nişan',
        occasion: 'Nişan',
        prepTimeDays: 5,
        portionCount: 20,
        rating: 5.0,
        reviewCount: 18,
        dietaryLabels: ["Glutensiz"],
        optionGroups: [
            {
                id: 'flavor',
                name: 'İçerik',
                required: true,
                type: 'single',
                options: [
                    { id: 'vanilla', label: 'Vanilya & Frambuaz', priceAdjustment: 0 },
                    { id: 'red_velvet', label: 'Red Velvet', priceAdjustment: 200 },
                ]
            }
        ]
    },
    {
        id: 't3',
        vendorId: 'v2',
        name: 'Çikolata Şöleni',
        description: 'Yoğun Belçika çikolatası ve özel ganaj dolgulu, çikolata severler için özel yapım.',
        basePrice: 1400,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
        gallery: [],
        category: 'Doğum Günü',
        occasion: 'Doğum Günü',
        prepTimeDays: 2,
        portionCount: 12,
        rating: 4.8,
        reviewCount: 56,
        optionGroups: [
            {
                id: 'drip',
                name: 'Sos Seçimi',
                required: true,
                type: 'single',
                options: [
                    { id: 'milk', label: 'Sütlü Çikolata', priceAdjustment: 0 },
                    { id: 'dark', label: 'Bitter Çikolata', priceAdjustment: 50 },
                ]
            }
        ]
    },
    {
        id: 't4',
        vendorId: 'v2',
        name: 'Görkemli Düğün Pastası',
        description: 'Dört katlı, el yapımı şeker çiçekleriyle süslenmiş klasik düğün pastası.',
        basePrice: 8500,
        image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?w=800',
        gallery: [],
        category: 'Düğün',
        occasion: 'Düğün',
        prepTimeDays: 10,
        portionCount: 50,
        rating: 4.9,
        reviewCount: 12,
        optionGroups: [
            {
                id: 'tiers',
                name: 'Kat Sayısı',
                required: true,
                type: 'single',
                options: [
                    { id: '4t', label: '4 Katlı', priceAdjustment: 0 },
                    { id: '5t', label: '5 Katlı', priceAdjustment: 2000 },
                ]
            }
        ]
    },
    {
        id: 't5',
        vendorId: 'v1',
        name: 'Mavi Bulut Baby Shower',
        description: 'Bebek cinsiyet partileri ve baby shower kutlamaları için yumuşak tonlarda tasarım pasta.',
        basePrice: 1800,
        image: 'https://images.unsplash.com/photo-1535254023120-35863347cc0c?w=800',
        gallery: [],
        category: 'Baby Shower',
        occasion: 'Baby Shower',
        prepTimeDays: 4,
        portionCount: 15,
        rating: 4.7,
        reviewCount: 25,
        dietaryLabels: ["Vegan", "Şekersiz"],
        optionGroups: []
    }
];
