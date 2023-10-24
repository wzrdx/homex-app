import axios from 'axios';
import {
    API_URL,
    ELDERS_COLLECTION_ID,
    EXPLORER_URL,
    GATEWAY_URL,
    TRAVELERS_COLLECTION_ID,
    TRAVELERS_PADDING,
} from '../blockchain/config';
import { NFT, RarityClass } from '../blockchain/types';
import { Quest } from '../types';
import _ from 'lodash';
import { addSeconds, isAfter, isBefore } from 'date-fns';
import { RESOURCE_ELEMENTS } from './resources';

export const getBackgroundStyle = (source: string, position = 'center') => ({
    backgroundImage: `url(${source})`,
    backgroundSize: 'cover',
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
});

export const round = (value, places) => {
    return +(Math.round(Number.parseFloat(value + 'e+' + places)) + 'e-' + places);
};

export const getShortAddress = (address: string, size = 4) => `${address.slice(0, size)}...${address.slice(-size)}`;

export const timeDisplay = (h) => (h > 0 ? (h < 10 ? '0' + h : h) : '00');

export const zeroPad = (num) => String(num).padStart(2, '0');

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getUsername = async (address: string): Promise<string> => {
    let result = getShortAddress(address);

    const response = await axios.get(`address/${address}/username`, {
        baseURL: GATEWAY_URL,
    });

    const username: string | undefined = response?.data?.data?.username;

    if (username) {
        result = username.slice(0, username.indexOf('.elrond'));
    }

    return result;
};

export const pairwise = (arr, func) => {
    for (var i = 0; i < arr.length - 1; i++) {
        func(arr[i], arr[i + 1]);
    }
};

export function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export const getTxExplorerURL = (hash: string) => `${EXPLORER_URL}/transactions/${hash}`;

export const toHexNumber = (value: number, padding: number) => value.toString(16).padStart(padding, '0');

export const getTx = (hash: string) => {
    return axios.get(`transactions/${hash}`, {
        baseURL: API_URL,
        params: {
            fields: 'operations,timestamp',
        },
    });
};

export const getTravelersPadding = (nonce: number) => (nonce >= 256 ? TRAVELERS_PADDING : 2);

export const getRarityClassInfo = (rarityClass: RarityClass): { label: string; color: string; energyYield: number } => {
    let label: string;
    let color: string;
    let energyYield: number;

    switch (rarityClass) {
        case RarityClass.Elder:
            label = 'Elder';
            color = 'redClrs';
            energyYield = 9;
            break;

        case RarityClass.Common:
            label = 'Common';
            color = 'gray';
            energyYield = 3;
            break;

        case RarityClass.Uncommon:
            label = 'Uncommon';
            color = 'white';
            energyYield = 4;
            break;

        case RarityClass.Rare:
            label = 'Rare';
            color = 'dodgerblue';
            energyYield = 6;
            break;

        case RarityClass.Royal:
            label = 'Royal';
            color = '#fe3bff';
            energyYield = 8;
            break;

        case RarityClass.OneOfOne:
            label = '1/1';
            color = 'orange';
            energyYield = 10;
            break;
    }

    return {
        label,
        color,
        energyYield,
    };
};

export const getTotalQuestsRewards = (quests: Quest[]) => {
    const rewards = {};

    _.forEach(Object.keys(RESOURCE_ELEMENTS), (key) => (rewards[key] = 0));

    _.forEach(quests, (quest) => {
        _.forEach(quest.rewards, (reward) => {
            rewards[reward.resource] += reward.value;
        });
    });

    _.forEach(Object.keys(rewards), (resource) => {
        if (!rewards[resource]) {
            delete rewards[resource];
        }
    });

    return rewards;
};

export const getUnbondingDuration = (tokenId: string): number => {
    switch (tokenId) {
        case TRAVELERS_COLLECTION_ID:
            return 604800;

        case ELDERS_COLLECTION_ID:
            return 604800;

        default:
            return 604800;
    }
};

export const hasFinishedUnbonding = (token: NFT): boolean =>
    !!token.timestamp && isAfter(new Date(), addSeconds(token.timestamp, getUnbondingDuration(token.tokenId)));
