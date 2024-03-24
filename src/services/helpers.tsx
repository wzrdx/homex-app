import axios from 'axios';
import { API_URL, EXPLORER_URL, GATEWAY_URL, MAZE_DENOMINATION, TRAVELERS_PADDING } from '../blockchain/config';
import { NFT, MainRarityClass, ArtRarityClass } from '../blockchain/types';
import { Quest } from '../types';
import _ from 'lodash';
import { addSeconds, isAfter } from 'date-fns';
import { RESOURCE_ELEMENTS } from './resources';

export const range = (length: number) => Array.from({ length }, (_, i) => i + 1);

export const getBackgroundStyle = (source: string, position = 'center') => ({
    backgroundImage: `url(${source})`,
    backgroundSize: 'cover',
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
});

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

export const getMainRarityClassInfo = (rarityClass: MainRarityClass): { label: string; color: string; energyYield: number } => {
    let label: string;
    let color: string;
    let energyYield: number;

    switch (rarityClass) {
        case MainRarityClass.Elder:
            label = 'Elder';
            color = 'redClrs';
            energyYield = 9;
            break;

        case MainRarityClass.Common:
            label = 'Common';
            color = 'gray';
            energyYield = 3;
            break;

        case MainRarityClass.Uncommon:
            label = 'Uncommon';
            color = 'white';
            energyYield = 4;
            break;

        case MainRarityClass.Rare:
            label = 'Rare';
            color = 'dodgerblue';
            energyYield = 6;
            break;

        case MainRarityClass.Royal:
            label = 'Royal';
            color = '#fe3bff';
            energyYield = 8;
            break;

        case MainRarityClass.OneOfOne:
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

// Values are per day, and need to be multiplied with 10
export const getPageYield = (artRarityClass: number): number => {
    switch (artRarityClass) {
        case 5:
            return 2;
        case 4:
            return 4;
        case 3:
            return 7;
        case 2:
            return 12;
        case 1:
            return 22;
        default:
            console.error('Page rarity is not recognized', artRarityClass);
            return 0;
    }
};

export const formatMaze = (value: number): string => {
    const withDenom = value / MAZE_DENOMINATION;

    if (withDenom === 0) {
        return '0';
    } else if (withDenom < 0.1) {
        return '<0.1';
    } else {
        return _.round(withDenom, 8).toLocaleString();
    }
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

export const getUnbondingDuration = (): number => {
    const duration = process.env.NODE_ENV === 'development' ? 15 : 604800;
    return duration;
};

export const hasFinishedUnbonding = (token: NFT): boolean =>
    !!token.timestamp && isAfter(new Date(), addSeconds(token.timestamp, getUnbondingDuration()));

export const formatNumberWithK = (num: number): string => {
    if (num < 1000) {
        return num.toString();
    } else if (num < 1000000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return (num / 1000000).toFixed(1) + 'M';
    }
};

export const getArtRarityName = (value: number): string => {
    for (const key in ArtRarityClass) {
        if ((ArtRarityClass as any)[key] === value) {
            return key;
        }
    }

    return '';
};
