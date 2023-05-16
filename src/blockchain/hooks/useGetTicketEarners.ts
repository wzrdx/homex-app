import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { map } from 'lodash';
import { sleep } from '../../services/helpers';

const resultsParser = new ResultsParser();

export interface TicketEarner {
    address: string;
    ticketsEarned: number;
}

export const useGetTicketEarners = () => {
    const [earners, setEarners] = useState<TicketEarner[] | undefined>(undefined);
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async () => {
        try {
            const query = smartContract.createQuery({
                func: new ContractFunction('getTicketEarners'),
                args: [],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getTicketEarners');

            const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value = firstValue?.valueOf();

            const parsedArray: TicketEarner[] = map(value, (item) => ({
                address: item?.address?.bech32(),
                ticketsEarned: item?.tickets_earned?.toNumber(),
            }));

            setEarners(parsedArray);
        } catch (err) {
            console.error('Unable to call getTicketEarners', err);
        }
    };

    return { earners, getTicketEarners: call };
};
