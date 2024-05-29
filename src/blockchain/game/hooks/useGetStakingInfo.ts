import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { map, size } from 'lodash';
import { useState } from 'react';
import { API_URL, mockAddress } from '../../config';
import { StakingInfo } from '../../types';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getStakingInfo';

export const useGetStakingInfo = () => {
    const [stakingInfo, setStakingInfo] = useState<StakingInfo>();

    const call = async (): Promise<StakingInfo | undefined> => {
        try {
            const address = mockAddress;

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

            // console.log(FUNCTION_NAME, info);

            setStakingInfo(info);

            return info;
        } catch (err) {
            console.error(`Unable to call ${FUNCTION_NAME}`, err);
        }
    };

    return { stakingInfo, getStakingInfo: call };
};
