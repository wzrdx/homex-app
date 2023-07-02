import { ResultsParser, ContractFunction, TokenIdentifierValue, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID } from '../config';
import { map } from 'lodash';
import { getAddress } from '@multiversx/sdk-dapp/utils';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getUserTokenNonces';

export const useGetUserTokenNonces = () => {
    const [nonces, setNonces] = useState<{ travelers: number[]; elders: number[] }>();

    const customCall = async (collection: string): Promise<number[] | undefined> => {
        try {
            const query = smartContract.createQuery({
                func: new ContractFunction(FUNCTION_NAME),
                args: [new AddressValue(new Address(await getAddress())), new TokenIdentifierValue(collection)],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value = map(amount?.valueOf(), (nonce) => nonce.toNumber() as number);

            return value;
        } catch (err) {
            console.error(`Unable to call ${FUNCTION_NAME}`, err);
        }
    };

    const call = async (): Promise<{
        travelers: number[];
        elders: number[];
    }> => {
        const result = await Promise.all([customCall(TRAVELERS_COLLECTION_ID), customCall(ELDERS_COLLECTION_ID)]);

        const value = {
            travelers: result[0] || [],
            elders: result[1] || [],
        };

        setNonces(value);
        return value;
    };

    return { nonces, getUserTokenNonces: call };
};
