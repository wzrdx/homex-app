import { ResultsParser, ContractFunction, U32Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { map } from 'lodash';
import { TicketEarner } from '../types';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL);

export const getTicketEarners = async (start: number, end: number) => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction('getTicketEarners'),
            args: [new U32Value(start), new U32Value(end)],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint('getTicketEarners');

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const array = firstValue?.valueOf();

        const parsedArray: TicketEarner[] = map(array, (item) => ({
            address: item?.address?.bech32(),
            ticketsEarned: item?.tickets_earned?.toNumber(),
            timestamp: new Date(item?.last_timestamp?.toNumber() * 1000),
        }));

        return parsedArray;
    } catch (err) {
        console.error('Unable to call getTicketEarners', err);
        return [];
    }
};
