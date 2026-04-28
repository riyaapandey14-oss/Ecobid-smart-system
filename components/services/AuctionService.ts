
import { supabase } from '../lib/supabaseClient';
import { Auction } from './types';

export const AuctionService = {

    async getAuctions() {
        const { data, error } = await supabase
            .from('auctions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching auctions:", error);
            return [];
        }

        // Transform data to match frontend model
        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            basePrice: item.base_price,
            currentBid: item.current_bid || item.base_price,
            description: item.description,
            location: item.location,
            quantity: item.quantity,
            image: item.image_url,
            endsIn: item.ends_at ? Math.max(0, Math.floor((new Date(item.ends_at).getTime() - Date.now()) / 60000)) : 0,
            endsAt: item.ends_at,
            status: item.status,
            sellerId: item.seller_id
        }));
    },

    async createAuction(auctionData: Partial<Auction>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Make sure we have a profile
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
        if (!profile) throw new Error("User profile not found. Please log in again.");

        const { data, error } = await supabase
            .from('auctions')
            .insert({
                title: auctionData.title,
                category: auctionData.category,
                base_price: auctionData.basePrice,
                current_bid: auctionData.basePrice,
                description: auctionData.description,
                location: auctionData.location || 'Unknown',
                quantity: auctionData.quantity || '1 Lot',
                image_url: auctionData.image,
                seller_id: user.id,
                status: 'active',
                ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Default 24h
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Note: placeBid is now handled transactionally in UserService to manage EMD/Wallet, 
    // but we can keep a simple version here or redirect to UserService if needed.
    // For now, removing the standalone placeBid here to avoid duplication/inconsistency
    // or keeping it as a wrapper if specific components call it. 
    // Ideally, we consolidate. Let's redirect to UserService logic or keep simple update if EMD not needed for all.
    // Given the requirements, I'll remove it to force usage of the robust UserService.placeBid

    async removeAuction(id: number) {
        const { error } = await supabase.from('auctions').delete().eq('id', id);
        return !error;
    },

    async updateAuction(id: number, updates: Partial<Auction>) {
        const { data, error } = await supabase
            .from('auctions')
            .update({
                title: updates.title,
                description: updates.description,
                category: updates.category,
                base_price: updates.basePrice,
                quantity: updates.quantity,
                location: updates.location,
                image_url: updates.image
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    }
};
