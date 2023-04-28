import { ResultsParser, ContractFunction, AddressValue, Address } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';

const resultsParser = new ResultsParser();

export const useGetSubmittedTickets = () => {
    const [submittedTickets, setSubmittedTickets] = useState<number>();
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async () => {
        try {
            const address = await getAddress();

            const query = smartContract.createQuery({
                func: new ContractFunction('getSubmittedTickets'),
                args: [new AddressValue(new Address(address))],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getSubmittedTickets');

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

            setSubmittedTickets(amount?.valueOf()?.toNumber());
        } catch (err) {
            console.error('Unable to call getSubmittedTickets', err);
        }
    };

    return { submittedTickets, getSubmittedTickets: call };
};
