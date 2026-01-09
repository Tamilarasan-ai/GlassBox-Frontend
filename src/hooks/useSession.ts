import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
}

export interface Session {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export function useSession() {
    const [session, setSession] = useState<Session>(() => {
        // Initialize from localStorage
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        const user = userStr ? JSON.parse(userStr) : null;

        return {
            user,
            token,
            isAuthenticated: !!token && !!user,
        };
    });

    const login = (user: User, token: string) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        setSession({
            user,
            token,
            isAuthenticated: true,
        });
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        setSession({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    };

    const updateUser = (user: Partial<User>) => {
        if (!session.user) return;

        const updatedUser = { ...session.user, ...user };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        setSession(prev => ({
            ...prev,
            user: updatedUser,
        }));
    };

    return {
        session,
        user: session.user,
        token: session.token,
        isAuthenticated: session.isAuthenticated,
        login,
        logout,
        updateUser,
    };
}
