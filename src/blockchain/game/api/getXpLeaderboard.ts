import { ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { config } from '../../config';
import { PlayerInfo } from '../../types';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });
const FUNCTION_NAME = 'getXpLeaderboard';

export const getXpLeaderboard = async (start: number, end: number): Promise<PlayerInfo[]> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new U32Value(start), new U32Value(end)],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const value = firstValue?.valueOf();

        const array = map(value, (item) => ({
            address: item?.address?.bech32(),
            xp: item?.xp?.toNumber(),
            pagesMinted: item?.pages_minted?.toNumber(),
            energyClaimed: item?.energy_claimed?.toNumber(),
            mazeBalance: item?.maze_balance?.toNumber(),
        }));

        return array;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
