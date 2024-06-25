import { ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { config } from '../../config';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });
const FUNCTION_NAME = 'getRaffleHashes';

export interface Trial {
    index: number;
    hashes: string[];
}

export const getRaffleHashes = async (id: number) => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new U32Value(id)],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const array = firstValue?.valueOf();

        return map(array, (hash) => Buffer.from(hash).toString('hex'));
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
