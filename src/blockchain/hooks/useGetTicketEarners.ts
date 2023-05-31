import { ResultsParser, ContractFunction, U32Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { map } from 'lodash';
import { Role } from '../../shared/RoleTag';

const resultsParser = new ResultsParser();

export interface TicketEarner {
    address: string;
    ticketsEarned: number;
    timestamp: Date;
    time?: string;
    role?: Role;
}

export const useGetTicketEarners = () => {
    const [earners, setEarners] = useState<TicketEarner[] | undefined>(undefined);
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async (start: number, end: number) => {
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
                timestamp: parseDate(item?.last_timestamp?.toNumber()),
            }));

            setEarners(parsedArray);
        } catch (err) {
            console.error('Unable to call getTicketEarners', err);
        }
    };

    const parseDate = (value: number): Date => {
        try {
            const date = new Date(value * 1000);
            return date;
        } catch (error) {
            console.error(error);
            return new Date();
        }
    };

    return { earners, getTicketEarners: call };
};
