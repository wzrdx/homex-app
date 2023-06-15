import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../blockchain/config';
import { NFT } from '../blockchain/types';

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

export const getWalletNonces = (address: string, collection: string, from = 0): Promise<{ data: Array<NFT> }> =>
    axios.get(`accounts/${address}/nfts`, {
        baseURL: API_URL,
        params: {
            search: collection,
            type: 'NonFungibleESDT',
            fields: 'nonce,name,url',
            from,
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
