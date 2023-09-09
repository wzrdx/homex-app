import { isEmpty } from 'lodash';
import { API_KEY } from '../components/Settings';

// (process.env.NODE_ENV === 'development' ? devValue : prodValue);
const getEnvValue = (devValue, prodValue) => (process.env.NODE_ENV === 'development' ? prodValue : prodValue);

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

export const REWARDS_QUERYING_INTERVAL = 15000;
export const isStakingDisabled = false;

export const TEAM = [
    'erd1za7d0lzgnee39p9sytre0mss76tnht70fem0pcv0zn4undcfukrqqkzcpl',
    'erd1sjkxlcgjsjmtyuh3zn4fcgv7r4ffynjx8h252cu6vmvk4y8hrpcqajcqch',
    'erd138q72ndhfq2t6uvsut8j8vu4uzel0tndtm4d96hvn68wz0wgxwys4rwacn',
    'erd15m75ah2ztgnznjpadndjcakxmn99q8l66hpeyf2hl0z745cj3urs7zkcmp',
    'erd12eynzfdsxu0ft4g94a96nhvjhv8y4kff935klj6gfargvgptcfzqtwlxm9',
    'erd1t2k3846w4yw8wv85ckdxhdt5gd3p7g5v7hgt5w25srwaqz7z83xq2kq8pf',
    'erd1jvr26kvxs3xtdzapafrkupnphpzexn4zezr5lwvamam7wxqyasusjntmzr',
    // Sponsorship
    'erd1gpuqyxnx9k0c2xfeu7qa76fqdyz64eq9wlsg55yrp4f2upkc5g6sewxfsl',
    'erd1mhlgjtlme72kca7ypxh0clrgmf46ve7szrcrkgmeckdyt6vxj4msvge9m0',
    'erd1xn6d585f4yekz6lvtghcnxqxfgee87x5psg74z60ed39s4pddsaqft3s4q',
    'erd1fgfd3w66mk7p8j269jrlefsaqhsuky7l6f7npyps3p4jamm0umdshh4g32',
    'erd1a46a8p4gd97p59d7lxfhynkjmyuqah9us4n4y7r0tmdjmj47sg2qqkxdwe',
    'erd13y34z83fl2nhp5ca6cmfnca2dqg73tt8kanwwmx3nlmsdwd4sjfqugdn6a',
    'erd19fhql3jc7asgsed036e62g78p8lnwd4v2c0e7nwknw8q9pt2w0as5yzvrl',
    'erd1dsn9eu9nn5k8x34s43sk8g2cpwkwgctx790u5kng2fk2vrrs6vjqrhukvg',
    'erd1te48f3yvr4tk9c9dskdw878qqs9lxxmjlpe3f75gcswh9clpzddsyyqnnl',
    'erd1fzm0rcurgf5kwcsev6f2h7pqkc47u2g3fuvswm75xj2qqhcru2vsa3kf9p',
    'erd1jtv4xmswdvcrgrqa43swwkzrlrgh5eee8m0duhnr00qpnguhg8xske4umj',
    'erd1570ty9xuwzkyyv9plny7pljxh8kfzt79nc0qztrdelg3mzkhks2s3xcdx9',
    'erd1uxgu4ldz603v4wcdytv074myscmyg8gxpnk94vz0rtuwx2utzg2s7t68js',
    'erd15mwa73wx0ykvwh4hpgae52g48zkwqfvvuumdzleh5rqww457s3zsca5qeh',
    'erd1gwf09wmuvjqcvjxexpdn6400x9xqlqt8frjn8m4enrxldlfdtz2qawu60j',
    'erd1uks3xyntpg20vvayyfs6a2s877ual2y0emgx57p3c09l3fla0s6svlssfs',
    'erd1r8u6ykflfsvjvu0kpywyxe8vxnx7fjczc7y9ntcktydwh3479y2qlfw9rk',
    'erd19ahx5ha4qndt0kmg8hsd3yjde06sc4ga6adynfwj8m6wxyzfpt9qxjv94c',
    'erd1pcwmuks64q8wl0mgpkeekal3dlyf9eeyzmc48m7rcljfma7tmetq9nhrzs',
    'erd1uyexd9h079thxphsuagr55cxrgzqjnwf9m7pyylc5sawzq7dkvpq2l6668',
    'erd1m2dv8yh7r4mn964rh7x6p32ej8n8fuy2jl4978xslcktz2dmggks0vtwse',
    'erd1r7qdxc695yykqs2ugdetwjpwstwn4zrnre8xswa2j4yjfd72m9xq47eavq',
    'erd1jnezefhzswptluwhfhykqaj5vuzqmxsdw5g6e2dn2kqhlgtvmdtsrhe7da',
    'erd12pa9j7kmesa7qp39wrrdttm5kly9gmzvkuwhrraqwfnr8ljh8pgqvdnejn',
    'erd1sljtnplp90ky3pnlhptvm327fl0rlnhhzljcnxs6kqvuxh6ax87qhkwu42',
    'erd1ezadj34m2kz72gfmvkwsmyef2w3jukvf22hthwhgn6yq0smfypqqkqpjgh',
    'erd173cgr207uwl8yqueswd6ed9sj8alhw8mm2v09m557spdm4hv4frq7676mn',
    'erd1v42nukgt4v8w9amjtat35332czugta0lqwdsxajuslm3t5kqw8msh4ktv9',
    'erd1wxqc36l6t8xf47m0lrs990p28knsylfgkz0u47ay767hzjujyzlsl6ca3u',
    'erd1xjr9jrxfkfj8gfs8c0uf0fshh83esltmsyff8c3vxzavyukzvd9qy6dr37',
    'erd1w4aeqsmfxgsru8f0qut22553zsj4xr0vzcz92g62hhsfhggkv3cs2tc5td',
    'erd1zq2ghvulzxjyseh8y8u4ughc2tjvx29cv6g76yumey9jzt7mxtmq744u8y',
    'erd1e5qwdwy2m09fsfw7ystsjtzyaqs8vvkqxfgflhlhje072g7k656qlxy8cx',
    'erd1yghwuhaqj8ra5045y0jeq386xvns77r40jdkralr4hc6n9x74p9qcgzn3f',
];
