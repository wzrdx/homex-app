import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });

export const getNumberCall = async (functionName: string): Promise<number> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(functionName),
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(functionName);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        return firstValue?.valueOf()?.toNumber();
    } catch (err) {
        console.error(`Unable to call ${functionName}`, err);
        return 0;
    }
};
