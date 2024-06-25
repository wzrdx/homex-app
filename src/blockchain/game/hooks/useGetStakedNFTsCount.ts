import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { config } from '../../config';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });
const FUNCTION_NAME = 'getStakedNFTsCount';

export const useGetStakedNFTsCount = () => {
    const [count, setCount] = useState<number>();

    const call = async (): Promise<number | undefined> => {
        try {
            const query = smartContract.createQuery({
                func: new ContractFunction(FUNCTION_NAME),
                args: [],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value = amount?.valueOf()?.toNumber();

            setCount(value);
            return value;
        } catch (err) {
            console.error(`Unable to call ${FUNCTION_NAME}`, err);
        }
    };

    return { stakedNFTsCount: count, getStakedNFTsCount: call };
};
