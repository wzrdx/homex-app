import { ResultsParser, ContractFunction, U32Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL);
const FUNCTION_NAME = 'getRaffleTimestamp';

export const getRaffleTimestamp = async (): Promise<Date> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

        const value: number = firstValue?.valueOf()?.toNumber();
        return new Date(value * 1000);
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return new Date();
    }
};