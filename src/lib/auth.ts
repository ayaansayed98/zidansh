import { supabase } from './supabase';

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error in signInWithGoogle:', err);
        throw err;
    }
};
