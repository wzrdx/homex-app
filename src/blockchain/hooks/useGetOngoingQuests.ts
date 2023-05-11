import { ResultsParser, ContractFunction, Address, AddressValue, U8Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { OngoingQuest } from '../types';
import { BigNumber } from 'bignumber.js';
import { map } from 'lodash';

const resultsParser = new ResultsParser();

export const useGetOngoingQuests = () => {
    const [ongoingQuests, setOngoingQuests] = useState<Array<OngoingQuest>>([]);
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async () => {
        try {
            const address = await getAddress();

            const query = smartContract.createQuery({
                func: new ContractFunction('getOngoingQuests'),
                args: [new AddressValue(new Address(address))],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getOngoingQuests');

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const quests: Array<{
                id: BigNumber;
                end_timestamp: BigNumber;
            }> = amount?.valueOf();

            const parsedArray = map(quests, (quest) => ({
                id: quest.id.toNumber(),
                timestamp: new Date(quest.end_timestamp.toNumber() * 1000),
            }));

            console.log('getOngoingQuests', parsedArray);
            setOngoingQuests(parsedArray);
        } catch (err) {
            console.error('Unable to call getOngoingQuests', err);
        }
    };

    return { ongoingQuests, getOngoingQuests: call };
};
