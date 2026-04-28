
import { supabase } from '../components/lib/supabaseClient';

export const UserService = {
  // --- User Profile ---
  initializeSession: async (authUser: any) => {
    // In a real app with Supabase Auth, session initialization happens via Auth Provider
    // We just return the authUser for compatibility, or fetch extended profile
    return authUser;
  },

  // --- Session Management ---
  saveSession: (role: 'user' | 'admin', user: any) => {
    localStorage.setItem('eco_session', JSON.stringify({ role, user, timestamp: Date.now() }));
  },

  getSession: () => {
    const sessionStr = localStorage.getItem('eco_session');
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr);
      // Optional: Expiry check (e.g., 24 hours)
      if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('eco_session');
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem('eco_session');
  },

  getUserProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.full_name || user.email?.split('@')[0],
      email: data.email || user.email,
      company: data.company || data.full_name,
      phone: data.phone,
      address: data.address,
      type: data.role || 'Recycler',
      walletBalance: parseFloat(data.wallet_balance) || 0,
      emdBlocked: parseFloat(data.emd_blocked) || 0,
      avatar: data.avatar_url || (data.full_name ? data.full_name.charAt(0) : 'U')
    };
  },

  updateUserProfile: async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        company: updates.company,
        phone: updates.phone,
        address: updates.address,
        // Role is usually not updatable by user directly for security, but keeping if needed
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // --- Auctions (Read-only for User View, handled by AuctionService primarily) ---
  getAuctions: async () => {
    // Proxy to similar logic as AuctionService or just fetch active
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      basePrice: item.base_price,
      currentBid: item.current_bid,
      description: item.description,
      location: item.location,
      quantity: item.quantity,
      image: item.image_url,
      // Calculate endsIn
      endsIn: item.ends_at ? Math.max(0, Math.floor((new Date(item.ends_at).getTime() - Date.now()) / 60000)) : 0,
      endsAt: item.ends_at,
      status: item.status,
      sellerId: item.seller_id
    }));
  },

  // --- Bids ---
  getBids: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Join with auctions to get title
    const { data, error } = await supabase
      .from('bids')
      .select(`
        id,
        amount,
        status,
        created_at,
        auction:auctions (title)
      `)
      .eq('bidder_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((item: any) => ({
      id: item.id,
      auctionTitle: item.auction?.title || 'Unknown Auction',
      bidAmount: item.amount,
      status: item.status,
      date: new Date(item.created_at).toISOString().split('T')[0],
      transactionId: '-' // Could link related transaction if exists
    }));
  },

  placeBid: async (auctionId: number, amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Login required");

    // 1. Get User Profile for Balance Check
    const { data: profile } = await supabase
      .from('profiles')
      .select('wallet_balance, emd_blocked')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error("User profile not found");

    // 2. Fetch Auction for validation
    const { data: auction } = await supabase
      .from('auctions')
      .select('current_bid, title')
      .eq('id', auctionId)
      .single();

    if (!auction) throw new Error("Auction not found");
    if (amount <= auction.current_bid) throw new Error("Bid must be higher than current bid");

    // 3. EMD Logic: 5%
    const emdAmount = Math.floor(amount * 0.05);
    const availableBalance = (profile.wallet_balance || 0) - (profile.emd_blocked || 0);

    if (availableBalance < emdAmount) {
      throw new Error(`Insufficient Available Balance for EMD (₹${emdAmount})`);
    }

    // 4. Perform Updates (Ideally RPC for atomicity, but client-side sequence for now)

    // a. Create Bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        bidder_id: user.id,
        amount: amount,
        status: 'Leading'
      })
      .select()
      .single();

    if (bidError) throw bidError;

    // b. Update Auction Current Bid
    await supabase
      .from('auctions')
      .update({ current_bid: amount })
      .eq('id', auctionId);

    // c. Block EMD on User Profile
    await supabase
      .from('profiles')
      .update({ emd_blocked: (profile.emd_blocked || 0) + emdAmount })
      .eq('id', user.id);

    // d. Create Transaction Record
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'Debit',
        amount: emdAmount,
        description: `EMD Block - ${auction.title?.substring(0, 15)}...`,
        status: 'Pending'
      });

    // e. Create Notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'success',
        title: 'Bid Placed Successfully',
        message: `You are now leading for "${auction.title}" with ₹${amount.toLocaleString()}.`
      });

    return { success: true, newBid: bid };
  },

  // --- Transactions ---
  getTransactions: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((item: any) => ({
      id: item.id, // UUID
      type: item.type,
      amount: item.amount,
      desc: item.description,
      date: new Date(item.created_at).toISOString().split('T')[0],
      status: item.status
    }));
  },

  addFunds: async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Login required");

    // 1. Get current balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    // 2. Update Profile Balance
    const newBalance = (profile?.wallet_balance || 0) + amount;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // 3. Create Transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'Credit',
        amount: amount,
        description: 'Wallet Top-up',
        status: 'Success'
      });

    return newBalance;
  },

  // --- Notifications ---
  getNotifications: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((item: any) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: item.is_read
    }));
  },

  markNotificationsRead: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
  }
};