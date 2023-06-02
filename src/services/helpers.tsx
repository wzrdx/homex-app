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

export const getTxCount = async (): Promise<string> => {
    const response = await axios.get(`accounts/${contractAddress}/transactions/count`, {
        baseURL: API_URL,
    });

    return response?.data;
};

export const pairwise = (arr, func) => {
    for (var i = 0; i < arr.length - 1; i++) {
        func(arr[i], arr[i + 1]);
    }
};

export const OGs = [
    'erd12rc9sgfmal0sekkqulvk75drsuk7kv9msqpxfjp5estlwhvsvwns4698w2',
    'erd1hxr0wf25hd4mmwq8zfxmx7x7qz2lx8s27uq5cw4z2h796q7455jq0k96f5',
    'erd15a3uul3nkm4u4au76lftca7zrzrpskjvzlwarad4q6al2fhrx6cqhmf6v5',
    'erd1m38qku6lxeltzx0kg8y4ezw4xscaxf5d60cq47mth5xlz0dfkdesh2ksr3',
    'erd19v6afa7a9ahhk6x2mta8q2d7nvvk0man4k526t7la2395hmmvuuq4ynjg3',
    'erd108y6gghjzqev3mrc3m7csnz37eq0ls7q9n8elmxjualgu53rdh8qp232yu',
    'erd1lttuc8xhjgg0ug539la7cq3wpr8crk67pzmmg6ezxyennf9dy47qhw8vv4',
    'erd10c0pfr5g5c7hd0arnechczhgetwad8ah6896gum0f8pw2lzdsfcqsx7e2z',
    'erd18p8uwuvcyc7qqpngevapg5wy5sa73zskntqwe9nd0az6ulxaupzq0eqzqv',
    'erd14f4zf5f5rtn2dewwa64t0ceuy66qtg9df53zm0p50p9z520xdt5qhul8xs',
    'erd1sj7pws5t72ur8xefk0hlawcveuwy2c06us6l2au2xyl9lfpe6qkq7zzza6',
    'erd1ptgt7jfqs6s5cdxtnadss6u5e43359eq2vw2r7hlvm88tdp3rtmqfasr20',
    'erd14chhz7ynumqz3640z4pckvaczzptj0lv2k9w29t32a06229t5u8sr8hhx7',
    'erd1jt4uxja70zpdwku7qxl06vq36ww3caz4ngkp5554ysjvxtm992wqzjyppm',
    'erd1a687eeppah5aw77drtsewvus9flf3zttzy6zq7f02u496cvw0j7q2hmxrp',
    'erd1djtlzj2e9qx298470n8amzh39nu0e4fwzxv7psumumfek5t79xfq62l2nv',
    'erd1qrjclt4zkh77unppyx7hhtcv2nu8k70q03d4lzgsz4xcktxn07ksdvjwaf',
    'erd1gusvmk76yynmjdgp8fppt34hyuhtkly5m2dnj7vqf80ml3t7z7esz4pplu',
    'erd1lcye88mhz9r86jv8u9f2kzahcaxdcdhd08j9knvqxk3xnjnfth7q4dxnrx',
    'erd1t26ujj8hjhh7y8szmm79d8k3q9k0qx3ugggcrns4xqgyvuw343hq8wmkep',
    'erd1gnfv83auj7ydavhu69vedfj787xgej5j8nshvj3ex2fcp94w7ggsrwdt6q',
    'erd10w8e08ntal9rlvuf3e6jhj5464anqt5vv4jvwmyr8w0j3jlnpr4qnanre6',
    'erd1jj38tm9v6sf0j5g76770l9ttm57t8hslux0w68cmnu4w8n04yy6qqyk73w',
    'erd1se542eejemfs9avhw5vs8hrqayngh2xllpe5qdqsxs4gwptm2mtqs2m9d0',
    'erd1zj4g4xlyr542jdywkx3l4asgu0q9t0lzmcxuj326460gx20qgcyqmy2x27',
    'erd1cu0s52zuzy9mtd928c9y6hpyvksy37pt5jvvpule40an95rnt60sqxmrjl',
    'erd1dv7aplxu56q3e524l4l0tay6h7jndrsxr2a4206qkap840mdue0qapntc7',
    'erd1hd5ueysp8eer5ggurglakrv9tw2g659t2jh9hq98mah7u785leksevspq4',
    'erd10uc8325ys0f9k35hsj7kf9wpq97zm9gq7c4tqm4wy4af33ezkj3qsd0df0',
    'erd1k0u3gf0vnd259kmre4ygp29shzn9z0za7yktz65us75w5msyw8xqzx4g4a',
    'erd18u7v35jyr4kcl0clqhxj9qn2ptctg0mz8y62j9u5njzch97n4qcsv4yhkt',
    'erd1f0tsd347ffu73c3gq044c79dxgww9f40nn7g5ggua3hqwlwl7w0qn6v0vd',
];
