import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { config } from '../../config';
import { Rarity } from '../../types';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });
const FUNCTION_NAME = 'getArtRarities';

export const getArtRarities = async (): Promise<Rarity[]> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const array = firstValue?.valueOf();

        const parsedArray: Rarity[] = map(array, (item) => ({
            nonce: item?.nonce?.toNumber(),
            rarityClass: item?.rarity_class?.toNumber(),
        }));

        return parsedArray;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
