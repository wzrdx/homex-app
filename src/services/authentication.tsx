import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { config } from '../blockchain/config';
import { getPlayerXp } from '../blockchain/game/api/getPlayerXp';
import { NFT, SFT } from '../blockchain/types';

export interface AuthenticationContextType {
    isAuthenticated: boolean;
    setAuthentication: React.Dispatch<React.SetStateAction<boolean>>;
    xp: number;
    getXp: () => Promise<void>;
}

export const getNFTsCount = (address: string, collection: string): Promise<{ data: number }> =>
    axios.get(`accounts/${address}/nfts/count`, {
        baseURL: config.apiUrl,
        params: {
            collection,
        },
    });

export const getWalletSFTs = (
    address: string,
    collections: string[],
    from = 0
): Promise<{
    data: Array<{
        name: string;
        nonce: number;
        url: string;
        balance: string;
    }>;
}> =>
    axios.get(`accounts/${address}/nfts`, {
        baseURL: config.apiUrl,
        params: {
            collections: collections.join(','),
            fields: 'nonce,name,url,balance',
            from,
        },
    });

export const getWalletNonces = (address: string, collection: string, from = 0): Promise<{ data: Array<NFT> }> =>
    axios.get(`accounts/${address}/nfts`, {
        baseURL: config.apiUrl,
        params: {
            search: collection,
            type: 'NonFungibleESDT',
            fields: 'nonce,name,url,rank',
            from,
        },
    });

export const getContractNFTs = (collection: string, identifiers: string): Promise<{ data: Array<NFT> }> =>
    axios.get(`accounts/${config.gameScAddress}/nfts`, {
        baseURL: config.apiUrl,
        params: {
            identifiers,
            collections: collection,
            fields: 'nonce,name,url,rank',
        },
    });

export const getContractArtSFTs = (identifiers: string): Promise<{ data: Array<SFT> }> =>
    axios.get(`accounts/${config.auxiliaryScAddress}/nfts`, {
        baseURL: config.apiUrl,
        params: {
            identifiers,
            collections: config.aomCollectionId,
            fields: 'nonce,name,url',
        },
    });

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const useAuthenticationContext = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
    const [isAuthenticated, setAuthentication] = useState(false);
    const [xp, setXp] = useState<number>(0);

    const getXp = async () => {
        setXp(await getPlayerXp());
    };

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, setAuthentication, xp, getXp }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
