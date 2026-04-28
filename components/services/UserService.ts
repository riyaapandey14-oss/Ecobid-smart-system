
import { supabase } from '../lib/supabaseClient';
import { Bid, Auction } from './types';

export const UserService = {

    async getBids() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('bids')
            .select(`
                id,
                amount,
                status,
                created_at,
                auctions ( 
                    title, 
                    category, 
                    quantity,
                    location,
                    image_url,
                    seller_id
                )
            `)
            .eq('bidder_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            auctionTitle: item.auctions?.title || 'Unknown Auction',
            bidAmount: item.amount,
            date: new Date(item.created_at).toLocaleDateString(),
            status: item.status,
            auctions: item.auctions // Pass full object for reports
        }));
    },

    async getTransactions() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            desc: item.description,
            amount: item.amount,
            date: new Date(item.created_at).toLocaleDateString(),
            type: item.type,
            status: item.status
        }));
    },

    async getNotifications() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            time: new Date(item.created_at).toLocaleDateString(), // Simplification
            read: item.is_read,
            type: item.type
        }));
    },

    async markNotificationsRead() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id);

        return !error;
    },

    async addFunds(amount: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // 1. Create Transaction
        const { error: txnError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                type: 'Credit',
                amount: amount,
                description: 'Wallet Deposit',
                status: 'Success'
            });

        if (txnError) throw txnError;

        // 2. Update Profile Balance (RPC or direct update)
        // Ideally use an RPC for atomicity, but direct update for now:
        const { data: profile } = await supabase
            .from('profiles')
            .select('wallet_balance')
            .eq('id', user.id)
            .single();

        const newBalance = (profile?.wallet_balance || 0) + amount;

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ wallet_balance: newBalance })
            .eq('id', user.id);

        if (profileError) throw profileError;

        return true;
    },

    async placeBid(auctionId: number, amount: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Please log in to place a bid");

        // 1. Check wallet balance
        // 2. Block EMD
        // 3. Insert bid to 'bids' table
        // 4. Update auction 'current_bid'

        // Simplified for this step:
        const { error } = await supabase
            .from('bids')
            .insert({
                auction_id: auctionId,
                bidder_id: user.id,
                amount: amount,
                status: 'placed'
            });

        if (error) throw error;

        // Update auction current bid (should ideally be trigger or transaction)
        await supabase
            .from('auctions')
            .update({ current_bid: amount })
            .eq('id', auctionId);

        return true;
    },

    // Mapping helper if needed, but we try to use AuthService
};
