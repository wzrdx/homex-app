import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { map, sortBy } from 'lodash';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 12000 });
const FUNCTION_NAME = 'getTrials';

export interface Trial {
    index: number;
    hashes: string[];
}

export const getTrials = async () => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const trials = firstValue?.valueOf();

        const parsedArray = map(trials, (trial) => ({
            index: trial?.index?.toNumber() as number,
            hashes: map(trial?.hashes, (hash) => Buffer.from(hash).toString('hex')),
        }));

        // TODO:
        return sortBy(
            [
                ...parsedArray,
                ...map(trials, (trial) => ({
                    index: 2,
                    hashes: map(trial?.hashes, (hash) => Buffer.from(hash).toString('hex')).slice(0, 2),
                })),
            ],
            'index'
        );
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
