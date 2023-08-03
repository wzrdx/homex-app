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
    'erd1uyym4vvycghs805p4yk87g667luzen85ecmd0j2fxukdpph30t3q4pn25m',
    'erd15kfk4wkzjfqet26az9qj39678cv2zrl2hn83j7lvz6ag7hqetueq899n96',
    'erd1q4znsslscwcgaewvttawfzzq2ddaq5ymaskggele96xlu3yexv4sz57a9x',
    'erd1cf8atcuw6sjqm083dwc7nswtlya2hh06rmnd9t4ccxpttswyl8wq029yzr',
    'erd12kkpzfwtek2966p5jn92eu5jyt5njeuruk3xx4wr9napnhyqwttsn9x6ya',
    'erd1u7m7phquflxpyjtzua5xtgaledujsm2az0hwe78h6ngpyfd0ukssse9yce',
    'erd1p0qusgg72d42hnuszt2xm8dluavrrrymjssp36mu72h546e68e0q0kg3ek',
    'erd1dv7aplxu56q3e524l4l0tay6h7jndrsxr2a4206qkap840mdue0qapntc7',
    'erd1vp9kc2apm73r8sk7p9c7ecguj6a7xyqjk0fj0a2f3ate8f6wfe4qmxkpfz',
    'erd1rjyk9yaal7j50rk0cavkwvejmmperrluadsctjdn0fqjgy57e8zsztu6f4',
    'erd1wq0f98558p329adzh9hhznrfde8t96z3haxwq4m5rlpgdnn0y76sgp0k99',
    'erd1wxqc36l6t8xf47m0lrs990p28knsylfgkz0u47ay767hzjujyzlsl6ca3u',
    'erd1lesk9dnz7tw09y6vta6yld3xg0npg7k3yjvnvgcdn3uew3ta966qavadul',
    'erd1lqveu63h53w6vv9pzy2jzcueu7jj7l92tz42ptf8c0jz2fkhmf0sz8l9wa',
    'erd1mt4wal0uheent4uf74dflu75k568ktlqh7v53qwfsvgt03v4yjyq0r2uxm',
    'erd1clkl44993wm0wx4usceu0xqn3k2j75ltv5rge2x7e68r20h7lv3qdcshap',
    'erd1umxqxgqe2qgz3je40w9jhs443zwpgchw967mpkuv853c7k3apwxs30vdyg',
    'erd1f2n3r4dqn0u337969zdkm3mag8yuq27nz65cuc92337uya84vjzs2hgwvr',
    'erd1pvpq3l9au3cjhgqef2xpv05uxs6pud23yqsax25dnajfuuenyq3qtyzwaw',
    'erd1wky9raym6ht4pqaj7tltpnswdagych7m8208c4hw90mx9ycnr6esxlt4pv',
    'erd1kvejp2zd5hzzpdayr5dd794pqm4350hldwhp2dd88hh7x4nvuksskx8jwt',
    'erd1kkkctcrhpsc8slqpn34yma5kscwfy64xzm6tra9yakvqp528u47s04sk8q',
    'erd1c97jtydy8hq6n868n4mwuhnnud238n67tkldluqymez5daxf6tgse8je55',
    'erd14lmck4d9utsvm44tzy6ussnupu42tedv76tlrk8799zcyh75pvnqrjar0f',
    'erd1rspkudae97lppjnj6t5y3hjmrsrqyrv4u9uaen8pjlry90hxpq9q3ev4nr',
    'erd1adm65snqjwnn6sdvm7wvz0md6yslklv9md2kpqa7lddjgkwppvcqa5wzu9',
    'erd1mru8nftcdl7z20t667eus08kun6h78k7amg4y5j8y4rucjuemm4qhs5a93',
    'erd1azlgupadcfytv2k0jprwga3pctuz0mty9prpac0695qnjl655hrqpfgut6',
    'erd1vs8nmwwqed3ry0tujzt6r3cfhucev6ptwksywe69taul976xlykq4rwap6',
    'erd1lr3c3jmak4j2sa62fh8ewrjhlw08kfyx4ylnhk6yj88xp0fm65ksww4kmv',
];
