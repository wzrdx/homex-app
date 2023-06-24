import { createContext, useContext, useState } from 'react';
import { StakingInfo, useGetStakingInfo } from '../blockchain/hooks/useGetStakingInfo';
import { useGetUserTokenNonces } from '../blockchain/hooks/useGetUserTokenNonces';
import { NFT, NFTType } from '../blockchain/types';
import { getNFTsCount, getWalletNonces } from './authentication';
import { pairwise } from './helpers';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import _ from 'lodash';
import { TRAVELERS_COLLECTION_ID, ELDERS_COLLECTION_ID } from '../blockchain/config';

export interface StoreContextType {
    stakingInfo: StakingInfo | undefined;
    getStakingInfo: () => Promise<StakingInfo | undefined>;
    nonces:
        | {
              travelers: number[];
              elders: number[];
          }
        | undefined;
    getUserTokenNonces: () => Promise<{
        travelers: number[];
        elders: number[];
    }>;
    travelers: NFT[] | undefined;
    elders: NFT[] | undefined;
    getWalletNFTs: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStoreContext = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const { stakingInfo, getStakingInfo } = useGetStakingInfo();
    const { nonces, getUserTokenNonces } = useGetUserTokenNonces();
    let { address } = useGetAccountInfo();

    const [travelers, setTravelers] = useState<NFT[]>();
    const [elders, setElders] = useState<NFT[]>();

    const getWalletNFTs = async () => {
        try {
            setTravelers(undefined);
            setElders(undefined);

            const { data: travelersCount } = await getNFTsCount(address, TRAVELERS_COLLECTION_ID);
            const { data: elderscount } = await getNFTsCount(address, ELDERS_COLLECTION_ID);

            const travelerChunks = new Array(Math.floor(travelersCount / 25)).fill(25).concat(travelersCount % 25);
            const travelersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

            pairwise(
                _(travelerChunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 25 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, _: number) => {
                    travelersApiCalls.push(getWalletNonces(address, TRAVELERS_COLLECTION_ID, from));
                }
            );

            const travelers = _(await Promise.all(travelersApiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
                .map((nft) => ({
                    ...nft,
                    // url: `https://ipfs.io/ipfs/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/${nft.nonce}.png`,
                    type: NFTType.Traveler,
                }))
                .orderBy('nonce', 'asc')
                .value();

            const elderChunks = new Array(Math.floor(elderscount / 25)).fill(25).concat(elderscount % 25);
            const eldersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

            pairwise(
                _(elderChunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 25 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, _: number) => {
                    eldersApiCalls.push(getWalletNonces(address, ELDERS_COLLECTION_ID, from));
                }
            );

            const elders = _(await Promise.all(eldersApiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
                .map((nft) => ({
                    ...nft,
                    type: NFTType.Elder,
                }))
                .orderBy('nonce', 'asc')
                .value();

            setTravelers(travelers);
            setElders(elders);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <StoreContext.Provider
            value={{ stakingInfo, getStakingInfo, nonces, getUserTokenNonces, travelers, elders, getWalletNFTs }}
        >
            {children}
        </StoreContext.Provider>
    );
};
