import { createContext, useContext, useState, ReactNode, useEffect } from 'react';



interface AuthUser {
    user: any;
    token: string;
}

interface AuthContextType {
    authUser: AuthUser | null;
    login: (user: any, token: string) => void;
    logout: () => void;
}

const defaultAuthContext: AuthContextType = {
    authUser: null,
    login: () => { },
    logout: () => { },
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const getStoredAuth = (): AuthUser | null => {

    if(typeof window === 'undefined' || !window.localStorage) return null;

    try {
        const storedAuth = localStorage.getItem('auth');
        if (!storedAuth) return null;

        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth.user && parsedAuth.token) {
            return parsedAuth;
        }
        return null;
    } catch (error) {
        console.error('Error retrieving authentication data', error);
        return null;
    }
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuth());

    const login = (user: any, token: string): void => {
        // console.log('Login function called with:', { user, token });
        const authData: AuthUser = { user, token };
        try {
            localStorage.setItem('auth', JSON.stringify(authData));
            setAuthUser(authData);
            // console.log('Auth data stored successfully:', {
            //     user: authData.user,
            //     token: authData.token
            // });
        } catch (error) {
            console.error('Error saving auth data:', error); 
            throw error;
        }
    };

    const logout = (): void => {
        setAuthUser(null);
        localStorage.removeItem('auth');
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'auth') {
                setAuthUser(getStoredAuth());
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);

