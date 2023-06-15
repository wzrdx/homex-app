import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 12000 });
const FUNCTION_NAME = 'isGamePaused';

export const isGamePausedQuery = async () => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const isPaused: boolean = firstValue?.valueOf();
        return isPaused;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return true;
    }
};
