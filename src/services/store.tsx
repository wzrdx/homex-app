import _ from 'lodash';
import { createContext, useContext, useState } from 'react';
import { useGetStakingInfo as useGetEnergyStakingInfo } from '../blockchain/game/hooks/useGetStakingInfo';
import { useGetStakingInfo as useGetMazeStakingInfo } from '../blockchain/auxiliary/hooks/useGetStakingInfo';
import { NFT, StakingInfo } from '../blockchain/types';
import { getNFTsCount, getWalletNonces } from './authentication';
import { pairwise } from './helpers';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { TRAVELERS_COLLECTION_ID, ELDERS_COLLECTION_ID } from '../blockchain/config';

export interface StoreContextType {
    // Energy
    stakingInfo: StakingInfo | undefined;
    getStakingInfo: () => Promise<StakingInfo | undefined>;
    // Maze
    mazeStakingInfo: StakingInfo | undefined;
    getMazeStakingInfo: () => Promise<StakingInfo | undefined>;
    travelers: NFT[] | undefined;
    elders: NFT[] | undefined;
    getWalletNFTs: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStoreContext = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    // Energy
    const { stakingInfo, getStakingInfo } = useGetEnergyStakingInfo();

    // Maze
    const { stakingInfo: mazeStakingInfo, getStakingInfo: getMazeStakingInfo } = useGetMazeStakingInfo();

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
                    tokenId: TRAVELERS_COLLECTION_ID,
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
                    tokenId: ELDERS_COLLECTION_ID,
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
            value={{ stakingInfo, getStakingInfo, mazeStakingInfo, getMazeStakingInfo, travelers, elders, getWalletNFTs }}
        >
            {children}
        </StoreContext.Provider>
    );
};
