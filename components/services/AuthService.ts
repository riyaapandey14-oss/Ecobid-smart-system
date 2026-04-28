
import { supabase } from '../lib/supabaseClient';
import { User } from './types';

export const AuthService = {

    async register(email: string, password: string, fullName: string, role: 'user' | 'admin' = 'user') {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        // Profile creation is handled by Database Trigger (handle_new_user)
        return { success: true, user: data.user };
    },

    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        const user = await this.getCurrentUser();
        return { success: true, user, role: user?.role };
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        return { success: !error, error: error?.message };
    },

    async getCurrentUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        // Fetch extended profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: profile?.full_name || session.user.user_metadata?.full_name,
            role: profile?.role || session.user.user_metadata?.role || 'user',
            createdAt: session.user.created_at,
            // Extended fields
            company: profile?.company,
            phone: profile?.phone,
            address: profile?.address,
            walletBalance: parseFloat(profile?.wallet_balance || 0),
            emdBlocked: parseFloat(profile?.emd_blocked || 0)
        };
        return user;
    },

    async getUsers() {
        // Admin only: Get all profiles
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
            console.error("Error fetching users:", error);
            return [];
        }
        return data;
    },

    async updateUserStatus(email: string, status: 'active' | 'disabled') {
        // Ideally update a status column in profiles, if meant for logic
        console.log("Update user status not fully implemented in schema yet");
        return true;
    }
};
