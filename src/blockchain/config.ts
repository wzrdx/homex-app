import { isEmpty } from 'lodash';

export const API_KEY = 'api';
export const MUSIC_KEY = 'music';

// (process.env.NODE_ENV === 'development' ? devValue : prodValue);
const getEnvValue = (devValue, prodValue) => (process.env.NODE_ENV === 'development' ? devValue : prodValue);

export const contractAddress = getEnvValue(
    'erd1qqqqqqqqqqqqqpgqc8s6t5594e4en4ffl60r6hn52hajkpkkukrqww29av',
    'erd1qqqqqqqqqqqqqpgqpt68cy4cde6ff2wzcfsfncjv6gxjxda8dn7q9ekje9'
);
export const walletConnectV2ProjectId = 'e778492a18fef9113620802a4a41d7c2';

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
    // DW
    'erd1v24zr9u69lzfwmmkn6h0dztvu5qgsf5hkr3peeek6ujq5sxzxl0qrp5ej5',
    'erd1lt7hqxxxk0uwfy8pw0p4x9pxgxccynk7t0l9m2xy89f39pgv0glqftsvrt',
    'erd17wrztfsn7xt8ge7edk49h586ea0m9uav2urk7szd3v37t24kxswqpj3ht5',
    'erd1uyym4vvycghs805p4yk87g667luzen85ecmd0j2fxukdpph30t3q4pn25m',
    'erd1efk3vr586qk4633wephl8s0gscwerprnqcgs8p52n38na9sg9ggq3n5rmu',
    'erd1fwmx8rv8drscshjmxdljz9pftqtdd80gukajc8x7l5g4xxwj3mpsuw2psz',
    'erd1mr266pa4uc3mwhq8ycg6sdgqylhga3qxcqg7esnz6a2kr6gxrmvsrug0su',
    'erd1kgjx9yzzwgu73wqqn6n3mf6e0hwrux3fg0adqxqkgxetzl3hncequsjuhg',
    'erd19f8tmt5fepg0guj72hc35quqeqx5c0llzkrcc00ex2qm2w5end3qmh8lhr',
    'erd1hd7dlxmuuh00uqy4q4e30uncu0hda08fgkmjttmmrs9j2p6ces8qjk4t0j',
    'erd1qprgvspv38zuxzqq4t9rl8akurdzsxwnl44ef7ypvuw23s9ruryq599hrp',
    'erd1ezadj34m2kz72gfmvkwsmyef2w3jukvf22hthwhgn6yq0smfypqqkqpjgh',
    'erd19l8uckcunq43850nlc7m9gyjaytzhr2tu2tvgldpjd953xfue6cqx4tu52',
    'erd1267vle054zuw37aq5pf77383u5u66c7skzcuxyyfk7hwf4a7qhhqtzqjkn',
    'erd1uxgu4ldz603v4wcdytv074myscmyg8gxpnk94vz0rtuwx2utzg2s7t68js',
    'erd1apv69nky5jntnup8wknmedxr33809slte2nq7kc3fjjj8282g6tq23d0ev',
    'erd1szny28l8qpejmrve27fk2l0dwcq0dqv70lu9jkad04utt45qftrq5wdum4',
    'erd1ak2df77l8rh0vj5ujfladutgjkp3a2f2funqxuzp8mrzrcy2duyqxtgx9m',
    'erd1sex68rnl4sffhv7v9pcrm79q0pmwl38gfuc9s3wupm35f0qqjugqnw6r0x',
    'erd1cp8ylla4327vpx5mkzs002yrwq55mg542q9pr7tx076v4a3wtndshhggdw',
    'erd18p8uwuvcyc7qqpngevapg5wy5sa73zskntqwe9nd0az6ulxaupzq0eqzqv',
    'erd1rasalv0gfhpc5cua3g667y098npjygc2u5z2wa9aptumfzv6d6qqq9zwy8',
    'erd10jckttzxgdp2da70gh2c8d4d8jymlcc0fpv2zsculy2d5zt5m43sw2apsw',
    'erd1rjeezd330f4pv4ysdvcndne3xmv5r6cry9x48fpueskdfnvl384s4fnwu7',
    'erd1ypgec6skhc9eu2436e5gqm5rfpnmv5f73405t3v3a2tdlwxv7mmqg5f7jq',
    'erd173cgr207uwl8yqueswd6ed9sj8alhw8mm2v09m557spdm4hv4frq7676mn',
    'erd17cdr34554mk5zvej37gj0m9umwuxccnptanks4f397wzmhgw5qpsfr4v67',
    'erd1u7m7phquflxpyjtzua5xtgaledujsm2az0hwe78h6ngpyfd0ukssse9yce',
    'erd1t47ha8elykxynnvzrs7jsj5lpxjxrdmdrl8mrr59v6mf947trg3qxx0c5z',
    'erd1pcwmuks64q8wl0mgpkeekal3dlyf9eeyzmc48m7rcljfma7tmetq9nhrzs',
    'erd1tvtefq7jpaar80xutc38vrnmc54ecraq50gtjypk5w6l7xypva9sthnuze',
];
