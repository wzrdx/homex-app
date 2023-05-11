import { ResultsParser, ContractFunction, Address, AddressValue, U8Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { isAfter } from 'date-fns';
import { QuestInfo, QuestStatus } from '../types';

// TODO: Deprecated

const resultsParser = new ResultsParser();

export const useGetQuestInfo = () => {
    const [questInfo, setQuestInfo] = useState<QuestInfo>();
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async (questId: number) => {
        setQuestInfo(undefined);

        try {
            const address = await getAddress();

            const query = smartContract.createQuery({
                func: new ContractFunction('getOngoingQuestTimestamp'),
                args: [new AddressValue(new Address(address)), new U8Value(questId)],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getOngoingQuestTimestamp');

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value: number = amount?.valueOf()?.toNumber();

            let timestamp: Date | undefined,
                status: QuestStatus = QuestStatus.Default;

            if (value) {
                timestamp = new Date(value * 1000);
                status = isAfter(new Date(), timestamp) ? QuestStatus.Complete : QuestStatus.Ongoing;
            }

            const questInfo: QuestInfo = {
                status,
                timestamp,
            };

            setQuestInfo(questInfo);
        } catch (err) {
            console.error('Unable to call getQuestInfo', err);
        }
    };

    return { questInfo, getQuestInfo: call };
};
