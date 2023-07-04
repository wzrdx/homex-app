import { ResultsParser, ContractFunction, U32Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { BattleParticipant } from '../types';
import { map } from 'lodash';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getBattleParticipants';

export const getBattleParticipants = async (id: number, start: number, end: number) => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new U32Value(id), new U32Value(start), new U32Value(end)],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const array = firstValue?.valueOf();

        const parsedArray: BattleParticipant[] = map(array, (item) => ({
            address: item?.address?.bech32(),
            ticketsCount: item?.tickets_count?.toNumber(),
            quests: item?.quests?.toNumber(),
        }));

        return parsedArray;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
