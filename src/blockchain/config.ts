import { isEmpty } from 'lodash';
import { API_KEY } from '../components/Settings';

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

export const API_URL = getEnvValue(
    'https://devnet-api.multiversx.com',
    isEmpty(window.localStorage[API_KEY])
        ? 'https://elrond-api.blastapi.io/66bcc344-d7d2-4bdf-8f41-a0ee9d91318b'
        : 'https://api.multiversx.com'
);

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
    // BH
    'erd1hssmqp8ryxsypgnnch8c68tjf77mg8rmq95s0afmdl4m0ly6a9qs5032k5',
    'erd1jnezefhzswptluwhfhykqaj5vuzqmxsdw5g6e2dn2kqhlgtvmdtsrhe7da',
    'erd1e5qwdwy2m09fsfw7ystsjtzyaqs8vvkqxfgflhlhje072g7k656qlxy8cx',
    'erd1xe6aft6dtnryfl9r9q5hxz7hh5dpd8uqy87utw4yzzu06skgak9qtucdw8',
    'erd1egz4hwx9nd95mppkundn7pkjpn4d640yf436pv0k5rdauacw9f6sm7srut',
    'erd1qwrn4maa8desftslz63s0v7w9q6a33u55lsdqjtujl90h4ednyeqh0833t',
    'erd1zq2ghvulzxjyseh8y8u4ughc2tjvx29cv6g76yumey9jzt7mxtmq744u8y',
    'erd14zwcsq4hl70vsw8tcf4pztp9n6gvc6xxn5x4x86frvffk39z22wsr0tqql',
    'erd1trqrpnl7e5nsagfqh4qp2tfpqg7hjacsesrstuhjk76rgagag9ws87gy6l',
    'erd1292taguq6hvu370g28wnyvy0hlnze2gfwdcdgd8t0ht35tnh8e5qrwsjqx',
    'erd1wmupkr4vjl7jualmx5hwdeaqfj5we0u82drlcrm22ng4cxgfdussaq0wkf',
    'erd1slpjzd9h98lw0ernk9tyll7df82qydljfn3hn7wknukvc2a6jcasm4k0xm',
    'erd1y8k0n2llduq3p4nql6zvl4ssmv4u8aju5h2yx05q74lggcnlh2uqdx6tfe',
    'erd183z8r6knau839hlgzdktlvjrkx8dmx0c5zrwcz4ajy3qt8j9tawqa84fyp',
    'erd1wdk8zpzdf3h40pajzdj2389hns9ujuv3qlae9w7xlj9denlfjprsw20462',
    'erd1n4r7dlq3qlln5fmdzp9w3vsk4x3sqp5gg2ayz6xqa96gq20acqfs5dtwmj',
    'erd1fwmx8rv8drscshjmxdljz9pftqtdd80gukajc8x7l5g4xxwj3mpsuw2psz',
    'erd1ls9j5jwsngmq8y27677an348mmu6v43xqk43w6f7u86h5w3wcteqfvhs5e',
    'erd1wqylcnl57wpyv76y8336dc9cw9vk6lk3kvruwy2xqtd8j78zaq3sajqnyq',
    'erd12rc9sgfmal0sekkqulvk75drsuk7kv9msqpxfjp5estlwhvsvwns4698w2',
    'erd1y8k0n2llduq3p4nql6zvl4ssmv4u8aju5h2yx05q74lggcnlh2uqdx6tfe',
    'erd10ndvy9kzw638w0qhzz7fngp7zs37rzduwscyyjklw6zwulz2nlgswl8as6',
    'erd1kz86gzqp072337pgxaykqn6f5pez30gvu9tnz8cgm7x746ql6pgs8jhr98',
    'erd16ywgt4ht6lxl52t0ssqnafs2sqjph08jngk6mf2wrkfkdsyc4mqs37a0xa',
    'erd1j5fdqzwr6jes7vh5uxmyg9ekug5yud84578m2aft56wgunulwsgsaz9n42',
];
