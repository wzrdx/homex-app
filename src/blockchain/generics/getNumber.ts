import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });

export const getNumber = async (queryName: string): Promise<number | undefined> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(queryName),
            args: [],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(queryName);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

        const value: number = firstValue?.valueOf()?.toNumber();
        console.log(value);
        return value;
    } catch (err) {
        console.error(`Unable to call ${queryName}`, err);
    }
};
