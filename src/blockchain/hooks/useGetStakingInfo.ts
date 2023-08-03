import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import BigNumber from 'bignumber.js';
import { map, size } from 'lodash';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getStakingInfo';

export interface Stake {
    tokenId: string;
    nonce: number;
    amount: number;
    timestamp: Date | null;
}

export interface StakingInfo {
    isStaked: boolean;
    rewards: number;
    timestamp: Date;
    tokens: Stake[];
}

export const useGetStakingInfo = () => {
    const [stakingInfo, setStakingInfo] = useState<StakingInfo>();

    const call = async (): Promise<StakingInfo | undefined> => {
        try {
            const address = await getAddress();

            const query = smartContract.createQuery({
                func: new ContractFunction(FUNCTION_NAME),
                args: [new AddressValue(new Address(address))],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

            const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value = firstValue?.valueOf();

            const info = {
                isStaked: size(value.tokens) > 0,
                rewards: value.rewards.toNumber() / 1000000,
                timestamp: new Date(value.timestamp.toNumber() * 1000),
                tokens: map(value.tokens, (token) => ({
                    tokenId: token.token_id,
                    nonce: token.nonce.toNumber(),
                    amount: token.amount.toNumber(),
                    timestamp: !token?.timestamp ? null : new Date(token?.timestamp?.toNumber() * 1000),
                })),
            };

            console.log(FUNCTION_NAME, info);

            setStakingInfo(info);

            return info;
        } catch (err) {
            console.error(`Unable to call ${FUNCTION_NAME}`, err);
        }
    };

    return { stakingInfo, getStakingInfo: call };
};
