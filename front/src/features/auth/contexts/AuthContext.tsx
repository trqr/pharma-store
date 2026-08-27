import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import {getCurrentUserWithToken, login as loginApi, register as registerApi} from '../api/auth.api';
import type {LoginRequest} from '../types/LoginRequest';
import type {RegisterRequest} from '../types/RegisterRequest';
import {useCart} from "../../cart/contexts/CartContext.tsx";
import type {AuthResponse, User} from "../types/AuthResponse.ts";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<AuthResponse>;
    register: (data: RegisterRequest) => Promise<AuthResponse>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {setCart} = useCart();

    const getUserWithToken = async () => {
        try {
            const response : AuthResponse = await getCurrentUserWithToken();
            localStorage.setItem('token', response.token);
            setUser(response.user);
            setCart(response.user.cartItems);
            return response;
        } catch (e) {
            setUser(null);
            return e;
        }
    }

    const login = async (data: LoginRequest) => {
        const response : AuthResponse = await loginApi(data);
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setCart(response.user.cartItems);
        return response;
    };

    const register = async (data: RegisterRequest) => {
        const response : AuthResponse = await registerApi(data);
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setCart(response.user.cartItems);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await getUserWithToken();
                }
            } finally {
                setIsLoading(false);
            }
        }
        void initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
