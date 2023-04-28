export const getBackgroundStyle = (source: string) => ({
    backgroundImage: `url(${source})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
});

export const round = (value, places) => {
    return +(Math.round(Number.parseFloat(value + 'e+' + places)) + 'e-' + places);
};

export const getShortAddress = (address: string, size = 4) => `${address.slice(0, size)}...${address.slice(-size)}`;

export const hDisplay = (h) => (h > 0 ? (h < 10 ? '0' + h + ':' : h + ':') : '00:');
export const mDisplay = (m) => (m > 0 ? (m < 10 ? '0' + m + ':' : m + ':') : '00:');
export const sDisplay = (s) => (s > 0 ? (s < 10 ? '0' + s : s) : '00');

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
