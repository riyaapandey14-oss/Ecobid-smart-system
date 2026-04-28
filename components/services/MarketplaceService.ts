import { supabase } from '../lib/supabaseClient';

export interface MarketplaceItem {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    quantity?: string;
    location?: string;
    image?: string;
    sellerId?: string;
    status: 'active' | 'sold';
    createdAt: string;
    isGradient?: boolean; // For frontend compatibility if image fails or is missing
}

export const MarketplaceService = {

    async getItems() {
        const { data, error } = await supabase
            .from('marketplace_items')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching marketplace items:', error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            location: item.location,
            image: item.image_url,
            sellerId: item.seller_id,
            status: item.status,
            createdAt: item.created_at,
            isGradient: !item.image_url // Fallback flag
        }));
    },

    async createItem(itemData: Partial<MarketplaceItem>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('marketplace_items')
            .insert({
                title: itemData.title,
                description: itemData.description,
                category: itemData.category,
                price: itemData.price,
                quantity: itemData.quantity || '1 unit',
                location: itemData.location || 'Unknown',
                image_url: itemData.image,
                seller_id: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateItemStatus(id: number, status: 'active' | 'sold') {
        const { error } = await supabase
            .from('marketplace_items')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async deleteItem(id: number) {
        const { error } = await supabase
            .from('marketplace_items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Delete Item Error:", error);
            throw error;
        }
        return true;
    }
};
