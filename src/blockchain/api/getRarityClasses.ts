import { ResultsParser, ContractFunction, List, U16Type, U16Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { map } from 'lodash';
import { RarityClass } from '../types';

export interface Rarity {
    nonce: number;
    rarityClass: RarityClass;
}

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 12000 });
const FUNCTION_NAME = 'getRarityClasses';

export const getRarityClasses = async (nonces: number[]) => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [
                new List(
                    new U16Type(),
                    map(nonces, (nonce) => new U16Value(nonce))
                ),
            ],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const array = firstValue?.valueOf();

        const parsedArray: Rarity[] = map(array, (item) => ({
            nonce: item?.nonce?.toNumber(),
            rarityClass: item?.rarity_class?.toNumber(),
        }));

        console.log(parsedArray);

        return parsedArray;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
