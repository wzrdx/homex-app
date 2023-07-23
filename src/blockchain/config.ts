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
    // EXO
    'erd1wqws3um4kat8zrjgsrm2mlz4sygcm2zvgjfme4zkvjhfjevlgw6s5agr68',
    'erd1l7wp0n00t9tjd33mg68swfqqdqeucukq3cavaqushv8zr6xfcnuq50ee5z',
    'erd1uyljwcgqx8vhpfzceyueu6we3glllvy3556nmrqn3gl32uf3ndjsuy8v3x',
    'erd1krgtp35aj9pla66mtp5pmmyr6hswug2j3mqeruzukkwl2e7zldgqzk67wk',
    'erd1cjzcq2ku8lzj50g7txf7t0dcq6vcjfjh563kzutlzz7da6qkvz9ssspdel',
    'erd1af56dum6r4zujz53jnqam44jgeen5rsj06wugz0557chru603qmsmrylx2',
    'erd17ugt2a9fq3dkv82ltp7npwytyt8qhpsc5jpvlum2ntlhm8e7r9dq25z543',
    'erd1j2yjpx4f7thgvnw2ccpl9jh03zplfs8z693j9dusutk9ahmr7rwsaljajk',
    'erd1wqylcnl57wpyv76y8336dc9cw9vk6lk3kvruwy2xqtd8j78zaq3sajqnyq',
    'erd1crt60whe7c4r4nm86gk2sneyx4xl8a6uwth54d3e002gjangrp8sjfwlmw',
    'erd1r6nd776pe4k740l5ystlm96k9jyxel7lzupw0mhatky20k0tp2ssm6tw5x',
    'erd1yhyakztm6gly9yt04d5q3044rgmvupl4fgmhecpfq8lm9utahvgsryx3ze',
    'erd1ssna3whcxze0kwh8fjlwrtyajf0fpprvlutu84mf762djn6j548qv4nczl',
    'erd1knx4hu2u6zxyt2mqk9zfyf8m9pz980puw98hqsmv26d3eggxvfmsv4xlpq',
    'erd1mxy8qh2zp7xlv2k3heldgxfwpcn5a2j98ka5eydvmu48kapgqz6shxp2at',
    'erd19mfhf7z9e0gmzcj8c0dj9njeu6xt7thswczt0y9a29fst4a59fmq8jphd2',
    'erd1s6d9ts45q2x7ss80z2hh6p46v92cwgapjx6f7jpshj0mdpdekj2qnvj6v8',
    'erd17278gc0z9v08a5gszejnug992v02zexr4m6xx0w8tal9p3z6a23q2q2vkx',
    'erd1ekprhltq9vf5wvw2te075vuqe8wxm46mkjhlc030stwrl4whvl5schef70',
    'erd1wu4eyqtylm8fqfpvdrh8dejv2jxg9dckhhn89taqwjpvq5avx4tqkw5yqp',
    'erd163fk5eg4j9mezwd62c9rz2aqt5r0avaeq6rv8dxfmhf6xjgzpsyqq47vjj',
    'erd19xegymcjdj6808fzc3xrd7xppq6llplzr33z83cy8kauhmjq5x2swt2fjh',
    'erd18hpaswq474n9n37wt3jyweahsal2t9j4mtx4emyt8nylsgf590tsja4n7v',
    'erd1nnml8mlel6x2m2jc0hfegva24a7wdxmm30dxmr3hn54x9m7ye2vs03g7t3',
    'erd1fyst4anfy52k7sqcqg67jzxaeqya27wtnuy3m5xmxj2rqghtmxtscwpqvt',
];
