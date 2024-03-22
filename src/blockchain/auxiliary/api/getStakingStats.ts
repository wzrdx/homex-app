import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL } from '../../config';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 10000 });
const FUNCTION_NAME = 'getStakingStats';

export interface MazeStakingStats {
    tokens: number;
    wallets: number;
    supply: number;
}

export const getStakingStats = async (): Promise<MazeStakingStats | undefined> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const value = firstValue?.valueOf();

        return {
            tokens: value.field0.toNumber() as number,
            wallets: value.field1.toNumber() as number,
            supply: value.field2.toNumber() as number,
        };
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
    }
};
