
export interface User {
    id: string;
    email: string;
    fullName?: string;
    role: 'user' | 'admin';
    createdAt?: string;
    location?: string;
    phone?: string;
    walletBalance?: number;
    emdBlocked?: number;
    company?: string;
    address?: string;
}

export interface Auction {
    id: number;
    title: string;
    description?: string;
    category: string;
    basePrice: number;
    currentBid: number;
    endsIn: number; // minutes remaining (calculated)
    endsAt: string; // ISO date
    location: string;
    image?: string;
    quantity?: string;
    status: 'active' | 'ended';
    sellerId: string;
}

export interface Bid {
    id: number;
    auctionId: number;
    bidderId: string;
    amount: number;
    createdAt: string;
}
