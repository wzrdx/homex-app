import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../blockchain/config';

export interface AuthenticationContextType {
    isAuthenticated: boolean;
    setAuthentication: React.Dispatch<React.SetStateAction<boolean>>;
}

export const getNFTsCount = (address: string, collection: string): Promise<{ data: number }> =>
    axios.get(`accounts/${address}/nfts/count`, {
        baseURL: API_URL,
        params: {
            collection,
        },
    });

export const getNonces = (address: string, collection: string): Promise<{ data: Array<{ nonce: number }> }> =>
    axios.get(`accounts/${address}/nfts`, {
        baseURL: API_URL,
        params: {
            search: collection,
            type: 'NonFungibleESDT',
            fields: 'nonce',
        },
    });

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
