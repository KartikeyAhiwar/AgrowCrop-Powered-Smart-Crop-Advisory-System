import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider, useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

const AuthContext = createContext(null);

// Local Auth Provider (Wraps existing logic)
const LocalAuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('agro_token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('agro_user') || 'null'));

    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('agro_token', newToken);
        localStorage.setItem('agro_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('agro_token');
        localStorage.removeItem('agro_user');
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            login,
            logout,
            isLoaded: true,
            isAuthenticated: !!token,
            mode: 'local',
            isClerk: false,
            isLocal: true
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Clerk Wrapper to adapt to our AuthContext
const ClerkAuthAdapter = ({ children }) => {
    const { getToken, isLoaded, isSignedIn, signOut } = useClerkAuth();
    const { user: clerkUser } = useUser();
    const [token, setToken] = useState(null);

    useEffect(() => {
        let mounted = true;
        const fetchToken = async () => {
            if (isSignedIn) {
                try {
                    const t = await getToken({ template: 'agrowcrop-api' });
                    if (mounted) setToken(t);
                } catch (e) {
                    console.error("Failed to fetch Clerk token", e);
                }
            }
        };
        fetchToken();
        return () => { mounted = false; };
    }, [isSignedIn, getToken]);

    const logout = () => {
        signOut();
        setToken(null);
    };

    // Transform Clerk user to match our app's user structure
    const user = clerkUser ? {
        id: clerkUser.id,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber,
        name: clerkUser.fullName,
        role: clerkUser.publicMetadata?.role || 'ROLE_FARMER' // Default or from metadata
    } : null;

    return (
        <AuthContext.Provider value={{
            token,
            user,
            login: () => { }, // No-op for Clerk (handled by Clerk UI)
            logout,
            isLoaded,
            isAuthenticated: isSignedIn,
            mode: 'clerk',
            isClerk: true,
            isLocal: false
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider = ({ children }) => {
    // If we have a Clerk key, we assume main.jsx has already wrapped the App in ClerkProvider.
    // We just need to use the adapter to expose the context.
    const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

    if (clerkPubKey) {
        return (
            <ClerkAuthAdapter>
                {children}
            </ClerkAuthAdapter>
        );
    }

    // Fallback to local auth if no Clerk key is found
    return <LocalAuthProvider>{children}</LocalAuthProvider>;
};

export const useAuth = () => useContext(AuthContext);
