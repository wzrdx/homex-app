import { ResultsParser, ContractFunction, Address } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';

const resultsParser = new ResultsParser();

export const useGetTicketEarners = () => {
    const [earners, setEarners] = useState<Array<any>>();
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async () => {
        setEarners([]);

        try {
            const query = smartContract.createQuery({
                func: new ContractFunction('getTicketEarners'),
                args: [],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getTicketEarners');

            const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value: any = firstValue?.valueOf();

            console.log('getTicketEarners', value);

            setEarners([]);
        } catch (err) {
            console.error('Unable to call getTicketEarners', err);
        }
    };

    return { earners, getTicketEarners: call };
};
