import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { API_URL, TOKEN_ID } from '../blockchain/config';

export const getTokenCount = (address: string): Promise<{ data: number }> =>
    axios.get(`accounts/${address}/nfts/count`, {
        baseURL: API_URL,
        params: {
            collection: TOKEN_ID,
        },
    });

export const getTokenNonces = (address: string): Promise<{ data: Array<{ nonce: number }> }> =>
    axios.get(`accounts/${address}/nfts`, {
        baseURL: API_URL,
        params: {
            search: TOKEN_ID,
            type: 'NonFungibleESDT',
            fields: 'nonce',
        },
    });

export interface AuthenticationContextType {
    isAuthenticated: boolean;
    setAuthentication: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const useAuthenticationContext = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
    const [isAuthenticated, setAuthentication] = useState(false);

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, setAuthentication }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
