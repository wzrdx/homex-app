import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL } from '../../config';
import { smartContract } from '../../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getEcobottleLeaderboardSize';

export const getEcobottleLeaderboardSize = async (): Promise<number> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

        const value = firstValue?.valueOf();

        return value.toNumber() as number;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return 0;
    }
};