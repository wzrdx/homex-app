import { ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map } from 'lodash';
import { config } from '../../config';
import { Participant } from '../../types';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });
const FUNCTION_NAME = 'getRaffleParticipants';

export const getRaffleParticipants = async (raffleId: number, start: number, end: number) => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new U32Value(raffleId), new U32Value(start), new U32Value(end)],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const array = firstValue?.valueOf();

        const parsedArray: Participant[] = map(array, (item) => ({
            address: item?.address?.bech32(),
            ticketsCount: item?.tickets_count?.toNumber(),
        }));

        return parsedArray;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
