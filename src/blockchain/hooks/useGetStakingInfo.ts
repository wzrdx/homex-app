import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import BigNumber from 'bignumber.js';
import { map } from 'lodash';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL);
const FUNCTION_NAME = 'getStakingInfo';

export interface StakingInfo {
    isStaked: boolean;
    rewards: number;
    timestamp: Date;
    travelerNonces: number[];
    elderNonces: number[];
}

export const useGetStakingInfo = () => {
    const [stakingInfo, setStakingInfo] = useState<StakingInfo>();

    const call = async () => {
        try {
            const address = await getAddress();

            const query = smartContract.createQuery({
                func: new ContractFunction(FUNCTION_NAME),
                args: [new AddressValue(new Address(address))],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value: {
                rewards: BigNumber;
                timestamp: BigNumber;
                traveler_nonces: Array<BigNumber>;
                elder_nonces: Array<BigNumber>;
            } = amount?.valueOf();

            const info = {
                isStaked: value.traveler_nonces.length + value.elder_nonces.length > 0,
                rewards: value.rewards.toNumber() / 1000000,
                timestamp: new Date(value.timestamp.toNumber() * 1000),
                travelerNonces: map(value.traveler_nonces, (nonce) => nonce.toNumber()),
                elderNonces: map(value.elder_nonces, (nonce) => nonce.toNumber()),
            };

            setStakingInfo(info);
            console.log(FUNCTION_NAME);
        } catch (err) {
            console.error(`Unable to call ${FUNCTION_NAME}`, err);
        }
    };

    return { stakingInfo, getStakingInfo: call };
};
