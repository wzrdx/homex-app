import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { config } from '../../config';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });

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
        return value;
    } catch (err) {
        console.error(`Unable to call ${queryName}`, err);
    }
};
