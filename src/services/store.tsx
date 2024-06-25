import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import _ from 'lodash';
import { createContext, useContext, useState } from 'react';
import { getArtRarities } from '../blockchain/auxiliary/api/getArtRarities';
import { getStakeableNonces } from '../blockchain/auxiliary/api/getStakeableNonces';
import { useGetStakingInfo as useGetMazeStakingInfo } from '../blockchain/auxiliary/hooks/useGetStakingInfo';
import { config } from '../blockchain/config';
import { useGetStakingInfo as useGetEnergyStakingInfo } from '../blockchain/game/hooks/useGetStakingInfo';
import { MazeStakingInfo, NFT, Rarity, SFT, Stake, StakingInfo } from '../blockchain/types';
import { getContractArtSFTs, getNFTsCount, getWalletNonces, getWalletSFTs } from './authentication';
import { pairwise, toHexNumber } from './helpers';

const CHUNK_SIZE = 25;

export interface StoreContextType {
    // Energy
    stakingInfo: StakingInfo | undefined;
    getStakingInfo: () => Promise<StakingInfo | undefined>;
    // Maze
    mazeStakingInfo: MazeStakingInfo | undefined;
    getMazeStakingInfo: () => Promise<StakingInfo | undefined>;
    travelers: NFT[] | undefined;
    elders: NFT[] | undefined;
    getWalletMainNFTs: () => Promise<void>;
    getWalletStakeableAoMSFTs: () => Promise<void>;
    walletArtTokens: SFT[] | undefined;
    getStakedAoMSFTs: () => Promise<void>;
    stakedArtTokens: SFT[] | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStoreContext = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    // Energy
    const { stakingInfo, getStakingInfo } = useGetEnergyStakingInfo();

    // Maze
    const { mazeStakingInfo, getMazeStakingInfo } = useGetMazeStakingInfo();

    let { address } = useGetAccountInfo();

    const [travelers, setTravelers] = useState<NFT[]>();
    const [elders, setElders] = useState<NFT[]>();

    const [stakeableAoMNonces, setStakeableAoMNonces] = useState<number[]>([]);

    const [walletArtTokens, setWalletArtTokens] = useState<SFT[]>();
    const [stakedArtTokens, setStakedArtTokens] = useState<SFT[]>();

    const [artRarities, setArtRarities] = useState<Rarity[]>([]);

    // Fetches Travelers & Elders from the user's wallet
    const getWalletMainNFTs = async () => {
        try {
            setTravelers(undefined);
            setElders(undefined);

            const { data: travelersCount } = await getNFTsCount(address, config.travelersCollectionId);
            const { data: elderscount } = await getNFTsCount(address, config.eldersCollectionId);

            const travelerChunks = new Array(Math.floor(travelersCount / CHUNK_SIZE))
                .fill(CHUNK_SIZE)
                .concat(travelersCount % CHUNK_SIZE);
            const travelersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

            pairwise(
                _(travelerChunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * CHUNK_SIZE + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, _: number) => {
                    travelersApiCalls.push(getWalletNonces(address, config.travelersCollectionId, from));
                }
            );

            const travelers = _(await Promise.all(travelersApiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
                .map((nft) => ({
                    ...nft,
                    tokenId: config.travelersCollectionId,
                }))
                .orderBy('nonce', 'asc')
                .value();

            const elderChunks = new Array(Math.floor(elderscount / CHUNK_SIZE))
                .fill(CHUNK_SIZE)
                .concat(elderscount % CHUNK_SIZE);
            const eldersApiCalls: Array<Promise<{ data: NFT[] }>> = [];

            pairwise(
                _(elderChunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * CHUNK_SIZE + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, _: number) => {
                    eldersApiCalls.push(getWalletNonces(address, config.eldersCollectionId, from));
                }
            );

            const elders = _(await Promise.all(eldersApiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
                .map((nft) => ({
                    ...nft,
                    tokenId: config.eldersCollectionId,
                }))
                .orderBy('nonce', 'asc')
                .value();

            setTravelers(travelers);
            setElders(elders);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetches the AoM SFTs which are stakeable from the user's wallet
    const getWalletStakeableAoMSFTs = async () => {
        try {
            let nonces: number[], rarities: Rarity[];

            if (_.isEmpty(stakeableAoMNonces)) {
                nonces = await getStakeableNonces();
                setStakeableAoMNonces(nonces);
            } else {
                nonces = stakeableAoMNonces;
            }

            if (_.isEmpty(artRarities)) {
                rarities = await getArtRarities();
                setArtRarities(rarities);
            } else {
                rarities = artRarities;
            }

            const { data: count } = await getNFTsCount(address, config.aomCollectionId);

            const chunks = new Array(Math.floor(count / CHUNK_SIZE)).fill(CHUNK_SIZE).concat(count % CHUNK_SIZE);
            const apiCalls: Array<
                Promise<{
                    data: Array<{
                        name: string;
                        nonce: number;
                        url: string;
                        balance: string;
                    }>;
                }>
            > = [];

            pairwise(
                _(chunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * CHUNK_SIZE + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, _: number) => {
                    apiCalls.push(getWalletSFTs(address, [config.aomCollectionId], from));
                }
            );

            const tokens = _(await Promise.all(apiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
                .filter((token) => _.includes(nonces, token.nonce))
                .map((token) => ({
                    ...token,
                    balance: Number.parseInt(token.balance),
                    artRarityClass: (_.find(rarities, (item) => item.nonce === token.nonce) as Rarity).rarityClass,
                    tokenId: config.aomCollectionId,
                }))
                .orderBy('nonce', 'asc')
                .value();

            setWalletArtTokens(tokens);
        } catch (error) {
            console.error(error);
        }
    };

    const getStakedAoMSFTs = async () => {
        if (!mazeStakingInfo) {
            return;
        }

        try {
            let rarities: Rarity[];

            if (_.isEmpty(artRarities)) {
                rarities = await getArtRarities();
                setArtRarities(rarities);
            } else {
                rarities = artRarities;
            }

            const nonces: number[] = _.map(mazeStakingInfo.tokens, (token) => token.nonce);

            setStakedArtTokens(undefined);

            const chunks = new Array(Math.floor(nonces.length / 25)).fill(25).concat(nonces.length % 25);
            const apiCalls: Array<Promise<{ data: SFT[] }>> = [];

            const ids = _.map(nonces, (nonce) => `${config.aomCollectionId}-${toHexNumber(nonce, nonce >= 256 ? 4 : 2)}`);

            pairwise(
                _(chunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 25 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (from: number, to: number) => {
                    const slice = ids.slice(from, to);
                    apiCalls.push(getContractArtSFTs(slice.join(',')));
                }
            );

            const contractTokens = _(await Promise.all(apiCalls))
                .flatten()
                .map((result) => result.data)
                .flatten()
                .map((token) => ({
                    ...token,
                    balance: (_.find(mazeStakingInfo.tokens, (item) => item.nonce === token.nonce) as Stake).amount,
                    artRarityClass: (_.find(rarities, (item) => item.nonce === token.nonce) as Rarity).rarityClass,
                    tokenId: config.aomCollectionId,
                }))
                .orderBy('nonce', 'asc')
                .value();

            setStakedArtTokens(contractTokens);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <StoreContext.Provider
            value={{
                stakingInfo,
                getStakingInfo,
                mazeStakingInfo,
                getMazeStakingInfo,
                travelers,
                elders,
                getWalletMainNFTs,
                getWalletStakeableAoMSFTs,
                walletArtTokens,
                getStakedAoMSFTs,
                stakedArtTokens,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};
