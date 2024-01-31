import axios from 'axios';
import { HOMEX_API } from '../blockchain/config';

const verifyPage = (wallet: string, index: number): Promise<any> =>
    axios.post(
        'verifyPage',
        { wallet, index },
        {
            baseURL: HOMEX_API,
        }
    );

export { verifyPage };
