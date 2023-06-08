import axios from 'axios';
import { API_URL, GATEWAY_URL, contractAddress } from '../blockchain/config';

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

export const hDisplay = (h) => (h > 0 ? (h < 10 ? '0' + h : h) : '00');
export const mDisplay = (m) => (m > 0 ? (m < 10 ? '0' + m : m) : '00');
export const sDisplay = (s) => (s > 0 ? (s < 10 ? '0' + s : s) : '00');

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
