// (process.env.NODE_ENV === 'development' ? devValue : prodValue);
const getEnvValue = (devValue, prodValue) => (process.env.NODE_ENV === 'development' ? devValue : prodValue);

export const contractAddress = getEnvValue(
    'erd1qqqqqqqqqqqqqpgq03qfld7ypk27r2k0wgux89573pw2htq8ukrqze9mpw',
    'erd1qqqqqqqqqqqqqpgqpt68cy4cde6ff2wzcfsfncjv6gxjxda8dn7q9ekje9'
);
export const walletConnectV2ProjectId = '323a2ff473ee6b636d89a1a83ec733e2';

export const apiTimeout = 60000;
export const EGLD_DENOMINATION = 1000000000000000000;
export const TOKEN_DENOMINATION = 1000000;

export const CHAIN_ID = getEnvValue('D', '1');
export const PUBLIC_API = 'https://api.multiversx.com';

export const API_URL = getEnvValue(
    'https://devnet-api.multiversx.com',
    'https://elrond-api.blastapi.io/66bcc344-d7d2-4bdf-8f41-a0ee9d91318b'
);

// https://api.multiversx.com  https://elrond-api.blastapi.io/66bcc344-d7d2-4bdf-8f41-a0ee9d91318b

export const GATEWAY_URL = 'https://gateway.multiversx.com';
export const EXPLORER_URL = getEnvValue('https://devnet-explorer.multiversx.com', 'https://explorer.multiversx.com');

export const COLLECTION_SIZE = getEnvValue(200, 3333);
export const TRAVELERS_COLLECTION_ID = getEnvValue('PTESTERS-8fd15c', 'TRAVELER-51bdef');
export const TRAVELERS_PADDING = getEnvValue(2, 4);
export const ELDERS_COLLECTION_ID = getEnvValue('HOLYCOWS-90e467', 'HOMEXELDER-d43957');
export const ELDERS_PADDING = 2;

export const TICKETS_TOKEN_ID = getEnvValue('HOMETICKET-9112c2', 'HOMETICKET-257a32');
export const ENERGY_TOKEN_ID = getEnvValue('ENERGY-01690d', 'ENERGY-36fb1d');
export const HERBS_TOKEN_ID = getEnvValue('HERBS-ae1564', 'HERBS-1c45fb');
export const GEMS_TOKEN_ID = getEnvValue('GEMS-48158d', 'GEMS-5fbf7d');
export const ESSENCE_TOKEN_ID = getEnvValue('ESSENCE-011f1c', 'ESSENCE-67531c');

export const TRAVELER_YIELD_PER_HOUR: number = 3;
export const ELDER_YIELD_PER_HOUR: number = 3;
export const REWARDS_QUERYING_INTERVAL = 15000;

export const TEAM = [
    'erd16a569s4gyrf4ngdy0fgh7l3ma0hhh5klak33eql8ran7zpvqdn7q0gu7es',
    'erd1za7d0lzgnee39p9sytre0mss76tnht70fem0pcv0zn4undcfukrqqkzcpl',
    'erd1sjkxlcgjsjmtyuh3zn4fcgv7r4ffynjx8h252cu6vmvk4y8hrpcqajcqch',
    'erd138q72ndhfq2t6uvsut8j8vu4uzel0tndtm4d96hvn68wz0wgxwys4rwacn',
    'erd15m75ah2ztgnznjpadndjcakxmn99q8l66hpeyf2hl0z745cj3urs7zkcmp',
    'erd12eynzfdsxu0ft4g94a96nhvjhv8y4kff935klj6gfargvgptcfzqtwlxm9',
    'erd1t2k3846w4yw8wv85ckdxhdt5gd3p7g5v7hgt5w25srwaqz7z83xq2kq8pf',
    'erd1jvr26kvxs3xtdzapafrkupnphpzexn4zezr5lwvamam7wxqyasusjntmzr',
];
