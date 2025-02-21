import React, { createContext, useContext, useState, ReactElement } from 'react';

interface AuthUser {
    user: string;
    token: string;
}

interface AuthContextType {
    authUser: AuthUser | null;
    login: (user: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }): ReactElement => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuth());

    const login = (user: string, token: string) => {
        const authData: AuthUser = { user, token };
        setAuthUser(authData);
        localStorage.setItem('auth', JSON.stringify(authData));
    };

    const logout = () => {
        setAuthUser(null);
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ authUser, login, logout }}>
    { children }
    </AuthContext.Provider>
);

};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const getStoredAuth = (): AuthUser | null => {
    try {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? (JSON.parse(storedAuth) as AuthUser) : null;
    } catch (error) {
        console.error('Error retrieving authentication data', error);
        return null;
    }
};
