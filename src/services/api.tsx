import axios from 'axios';
import { config } from '../blockchain/config';

const verifyPage = (wallet: string, index: number): Promise<any> =>
    axios.post(
        'verifyPage',
        { wallet, index },
        {
            baseURL: config.questApi,
        }
    );

export { verifyPage };
