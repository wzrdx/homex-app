import { createContext, useContext, useState } from 'react';
import {
    getEXOTicket,
    getFullTicket,
    getLogoBox,
    getMvxLogo,
    getRaffleGiants,
    getRaffleHomeX,
    getRaffleRektNerds,
    getRaffleSuperVictor,
} from './assets';
import { RESOURCE_ELEMENTS } from './resources';
import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { API_URL } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { getElderRewards } from '../blockchain/api/getElderRewards';
import CPANFT from '../assets/images/cpa_nft.png';
import CPAChest from '../assets/images/cpa_chest.jpg';
import CPALogo from '../assets/images/cpa.png';

export enum RewardType {
    Prizes,
    SingleImage,
    NFT,
}

const getNFTPrize = (amount: number, type: 'Elders' | 'Travelers') => ({
    backgroundColor: '#421218',
    imageSrc: getLogoBox(),
    height: { md: '44px', lg: '56px' },
    textColor: 'primaryDark',
    text: `${amount} ${type}`,
});

export const getEGLDPrize = (amount: number = 0) => ({
    backgroundColor: '#2b2d31',
    imageSrc: getMvxLogo(),
    height: { md: '30px', lg: '42px' },
    textColor: 'whitesmoke',
    text: `${amount} EGLD`,
});

export const getTicketsPrize = (amount: number) => ({
    backgroundColor: '#8c5816',
    imageSrc: getFullTicket(),
    height: { md: '36px', lg: '50px' },
    textColor: 'brightWheat',
    text: `${amount} Golden Ticket${amount > 1 ? 's' : ''}`,
});

const getEssencePrize = (amount: number) => ({
    backgroundColor: '#3f1931',
    imageSrc: RESOURCE_ELEMENTS.essence.icon,
    height: { md: '30px', lg: '38px' },
    textColor: 'resources.essence',
    text: `${amount} ESSENCE`,
});

const getEnergyPrize = (amount: number) => ({
    backgroundColor: '#101e2b',
    imageSrc: RESOURCE_ELEMENTS.energy.icon,
    height: { md: '30px', lg: '38px' },
    textColor: 'resources.energy',
    text: `${amount} ENERGY`,
});

const getCPAPrize = (amount: number = 0) => ({
    backgroundColor: '#2b2d31',
    imageSrc: CPALogo,
    height: { md: '30px', lg: '42px' },
    textColor: 'whitesmoke',
    text: `${amount} CPA Token`,
});

let ID = 0;
const getId = () => ++ID;

export const RAFFLES: any[] = [
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getNFTPrize(2, 'Elders'), getEGLDPrize(25), getTicketsPrize(20)],
        winners: 30,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getNFTPrize(6, 'Travelers'), getEGLDPrize(10), getTicketsPrize(32), getEssencePrize(1000)],
        winners: 30,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(10), getTicketsPrize(26), getEnergyPrize(3400)],
        winners: 20,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getEXOTicket(),
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getEXOTicket(),
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getEXOTicket(),
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(2)],
        winners: 2,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(2)],
        winners: 2,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getTicketsPrize(50)],
        winners: 5,
    },
    // Trial 5
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getRaffleSuperVictor(),
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getRaffleSuperVictor(),
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getRaffleGiants(),
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getRaffleRektNerds(),
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getRaffleRektNerds(),
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: getRaffleHomeX(),
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getTicketsPrize(50)],
        winners: 5,
    },
    // Trial 6 - Starts with ID 17
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #1013',
        nonce: 5482,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/1013.png',
        rank: 'Green Corporal',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #3616',
        nonce: 3640,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/3616.png',
        rank: 'Green Corporal',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #5889',
        nonce: 8838,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/5889.png',
        rank: 'Green Corporal',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #6055',
        nonce: 6808,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/6055.png',
        rank: 'Green Corporal',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #6891',
        nonce: 9968,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/6891.png',
        rank: 'Green Corporal',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #1962',
        nonce: 4417,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/1962.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #2662',
        nonce: 3765,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/2662.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #3031',
        nonce: 3766,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/3031.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #3656',
        nonce: 4928,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/3656.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #3806',
        nonce: 3538,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/3806.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #4754',
        nonce: 3768,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/4754.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #6131',
        nonce: 4690,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/6131.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #6692',
        nonce: 3990,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/6692.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #7367',
        nonce: 4328,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/7367.png',
        rank: 'Private',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'BHAGENTS #741',
        nonce: 3706,
        url: 'https://media.elrond.com/nfts/asset/QmdWMd2tKWeN4Jdj4Xzgsuc3VLxQwEJycLLp8YKxr55kwj/741.png',
        rank: 'Private',
    },
    // Trial 7 - Starts with ID 31
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.SingleImage,
        id: getId(),
        imageSrc: CPAChest,
        winners: 1,
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'ArtCPAclub_Founder #1141',
        nonce: 380,
        url: CPANFT,
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'ArtCPAclub_Founder #2147',
        nonce: 382,
        url: CPANFT,
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'ArtCPAclub_Founder #3213',
        nonce: 404,
        url: CPANFT,
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'ArtCPAclub_Founder #3919',
        nonce: 306,
        url: CPANFT,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getCPAPrize(200000)],
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getCPAPrize(200000)],
        winners: 1,
    },
    // Trial 8 - Starts with ID 58
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Dreamy Whale #3765',
        nonce: 5889,
        url: 'https://media.elrond.com/nfts/asset/QmTeciY8tKbJgRjS8NX668oGZmx1TW1Le4NzGK4HTpbNa2/3765.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Dreamy Whale #5166',
        nonce: 5888,
        url: 'https://media.elrond.com/nfts/asset/QmTeciY8tKbJgRjS8NX668oGZmx1TW1Le4NzGK4HTpbNa2/5166.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Dreamy Whales Boop Pass',
        nonce: 98,
        url: 'https://media.elrond.com/nfts/asset/QmcqP13As6xAhwapqP5pbpS1heCCqd3jftdN3bPZQBeN2C/1.png',
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEssencePrize(1000)],
        winners: 1,
    },
    // Trial 9 - Starts with ID 62
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'EcoBottle Mint Pass',
        url: 'https://media.elrond.com/nfts/thumbnail/ECOBOTTLE-e5e2a6-d9f2af8c',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #2346',
        nonce: 118,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/2346.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #474',
        nonce: 1456,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/474.png',
    },
    // Trial 10 - Starts with ID 72
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Hero #4208',
        nonce: 4208,
        url: 'https://ipfs.io/ipfs/QmNNPwgsnoY72U32bTJshUn9miYPtkEBwZ9XZEjrMqXh81/9874.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Hero #4213',
        nonce: 4213,
        url: 'https://ipfs.io/ipfs/QmNNPwgsnoY72U32bTJshUn9miYPtkEBwZ9XZEjrMqXh81/8728.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Hero #4261',
        nonce: 4261,
        url: 'https://ipfs.io/ipfs/QmNNPwgsnoY72U32bTJshUn9miYPtkEBwZ9XZEjrMqXh81/5302.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Hero #4265',
        nonce: 4265,
        url: 'https://ipfs.io/ipfs/QmNNPwgsnoY72U32bTJshUn9miYPtkEBwZ9XZEjrMqXh81/8759.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Hero #4267',
        nonce: 4267,
        url: 'https://ipfs.io/ipfs/QmNNPwgsnoY72U32bTJshUn9miYPtkEBwZ9XZEjrMqXh81/2561.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #2246',
        nonce: 608,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/2246.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #1707',
        nonce: 3219,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/1707.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #1585',
        nonce: 3223,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/1585.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #690',
        nonce: 3297,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/690.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #454',
        nonce: 3333,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/454.png',
    },
    // Trial 11 - Starts with ID 82
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'DragonsArena #2281',
        nonce: 5850,
        url: 'https://media.elrond.com/nfts/asset/QmYYsQBWWto5NDVGbu26YY5nTRXEmuUmU72CBW747PxYqz/2281.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'DragonsArena #1214',
        nonce: 5871,
        url: 'https://media.elrond.com/nfts/asset/QmYYsQBWWto5NDVGbu26YY5nTRXEmuUmU72CBW747PxYqz/1214.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #3133',
        nonce: 993,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/3133.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #920',
        nonce: 2294,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/920.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #232',
        nonce: 84,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/232.png',
    },
    // Trial 12 - Starts with ID 87
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #2192',
        nonce: 618,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/2192.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #2360',
        nonce: 615,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/2360.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #1362',
        nonce: 2537,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/1362.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #891',
        nonce: 2338,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/891.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'Home X Traveler #2898',
        nonce: 614,
        url: 'https://media.elrond.com/nfts/asset/bafybeidixut3brb7brnjow42l2mu7fbw7dbkghbpsavbhaewcbeeum7mpi/2898.png',
    },
    // Trial 13 - Starts with ID 92
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.75)],
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.75)],
        winners: 1,
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'GenesisSpaceApe #12573',
        nonce: 13790,
        url: 'https://media.elrond.com/nfts/asset/bafybeicsa2ygmod3btvjtdvf6pofhp4vtjgfzgpmjhmgiryunrceccxmee/12573.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'GenesisSpaceApe #9994',
        nonce: 3863,
        url: 'https://media.elrond.com/nfts/asset/bafybeicsa2ygmod3btvjtdvf6pofhp4vtjgfzgpmjhmgiryunrceccxmee/9994.png',
    },
    // Trial 14 - Starts with ID 96
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.75)],
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.75)],
        winners: 1,
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'High Street Wolf Society #738',
        nonce: 738,
        url: 'https://ipfs.io/ipfs/QmemHXkBYZwUFZ4fMEgaTupzPS4PALnTmB7HEHSZm5Kt5J/738.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'L1 Werewolf #3363',
        nonce: 2434,
        url: 'https://ipfs.io/ipfs/QmXGPKjSn2huDEanmxrWq8WqiWvBgmQjTHqDsu1Qj6smuw/3363.png',
    },
    {
        type: RewardType.NFT,
        id: getId(),
        winners: 1,
        name: 'NFTIM #6691',
        nonce: 3317,
        url: 'https://ipfs.io/ipfs/bafybeigfsavl3figwpet6uy6bcllpahkmuabxioxahuxbvrdx36kqfcjt4/6691.png',
    },
    // Trial 15 - Starts with ID 101
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.5)],
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.5)],
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.5)],
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.5)],
        winners: 1,
    },
    {
        type: RewardType.Prizes,
        id: getId(),
        prizes: [getEGLDPrize(0.5)],
        winners: 1,
    },
];

export const BATTLES: any[] = [
    {
        id: getId(),
        amount: 60,
        winners: 30,
    },
    {
        id: getId(),
        amount: 54,
        winners: 15,
    },
];

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });

const RAFFLES_FUNCTION_NAME = 'getRaffles';
const BATTLES_FUNCTION_NAME = 'getBattles';

export interface RewardsContextType {
    raffles: Competition[] | undefined;
    getRaffles: () => Promise<any>;
    battles: Competition[] | undefined;
    getBattles: () => Promise<any>;
    ticketsAmount: number | undefined;
    getTicketsAmount: () => Promise<void>;
}

export interface Competition {
    id: number;
    timestamp: Date;
    tickets: number;
}

const RewardsContext = createContext<RewardsContextType | null>(null);

export const useRewardsContext = () => useContext(RewardsContext);

export const RewardsProvider = ({ children }) => {
    const [raffles, setRaffles] = useState<Competition[]>();
    const [battles, setBattles] = useState<Competition[]>();
    const [ticketsAmount, setTicketsAmount] = useState<number>();

    const getRaffles = async () => {
        setRaffles(await getCompetition(RAFFLES_FUNCTION_NAME));
    };

    const getBattles = async () => {
        setBattles(await getCompetition(BATTLES_FUNCTION_NAME));
    };

    const getCompetition = async (functionName: string): Promise<Competition[]> => {
        try {
            const query = smartContract.createQuery({
                func: new ContractFunction(functionName),
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint(functionName);

            const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const array = firstValue?.valueOf();

            const parsedArray = map(array, (raffle) => ({
                id: raffle?.id?.toNumber() as number,
                timestamp: new Date(raffle?.timestamp?.toNumber() * 1000),
                tickets: raffle?.tickets?.toNumber() as number,
            }));

            console.log(functionName, parsedArray);

            return parsedArray;
        } catch (err) {
            console.error(`Unable to call ${functionName}`, err);
            return [];
        }
    };

    const getTicketsAmount = async () => {
        setTicketsAmount(await getElderRewards());
    };

    return (
        <RewardsContext.Provider value={{ raffles, getRaffles, battles, getBattles, ticketsAmount, getTicketsAmount }}>
            {children}
        </RewardsContext.Provider>
    );
};
