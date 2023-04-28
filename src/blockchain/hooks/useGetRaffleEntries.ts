import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { size } from 'lodash';

const resultsParser = new ResultsParser();

export const useGetRaffleEntries = () => {
    const [entries, setEntries] = useState<number>();
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async () => {
        try {
            const query = smartContract.createQuery({
                func: new ContractFunction('getRaffleVector'),
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getRaffleVector');

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

            const value: Array<number> = amount?.valueOf();
            setEntries(size(value));
        } catch (err) {
            console.error('Unable to call getRaffleVector', err);
        }
    };

    return { entries, getRaffleVector: call };
};
