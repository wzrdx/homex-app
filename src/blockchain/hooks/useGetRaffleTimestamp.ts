import { ResultsParser, ContractFunction } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';

const resultsParser = new ResultsParser();

export const useGetRaffleTimestamp = () => {
    const [timestamp, setTimestamp] = useState<Date>();
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async () => {
        try {
            const query = smartContract.createQuery({
                func: new ContractFunction('getRaffleTimestamp'),
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getRaffleTimestamp');

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

            const value: number = amount?.valueOf()?.toNumber();
            setTimestamp(new Date(value * 1000));
        } catch (err) {
            console.error('Unable to call getRaffleTimestamp', err);
        }
    };

    return { timestamp, getRaffleTimestamp: call };
};
