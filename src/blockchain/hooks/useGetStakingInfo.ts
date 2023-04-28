import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useEffect, useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import BigNumber from 'bignumber.js';
import { map } from 'lodash';
import { sleep } from '../../services/helpers';

const resultsParser = new ResultsParser();

export interface StakingInfo {
    isStaked: boolean;
    rewards: number;
    timestamp: Date;
    nonces: number[];
}

export const useGetStakingInfo = () => {
    const [stakingInfo, setStakingInfo] = useState<StakingInfo>();
    const proxy = new ProxyNetworkProvider(API_URL);

    const call = async () => {
        try {
            const address = await getAddress();

            const query = smartContract.createQuery({
                func: new ContractFunction('getStakingInfo'),
                args: [new AddressValue(new Address(address))],
            });

            const queryResponse = await proxy.queryContract(query);
            const endpointDefinition = smartContract.getEndpoint('getStakingInfo');

            const { firstValue: amount } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
            const value: {
                rewards: BigNumber;
                timestamp: BigNumber;
                nonces: Array<BigNumber>;
            } = amount?.valueOf();

            setStakingInfo({
                isStaked: value.nonces.length > 0,
                rewards: value.rewards.toNumber() / 1000000,
                timestamp: new Date(value.timestamp.toNumber() * 1000),
                nonces: map(value.nonces, (nonce) => nonce.toNumber()),
            });

            console.log('getStakingInfo()');
        } catch (err) {
            console.error('Unable to call getStakingInfo', err);
        }
    };

    return { stakingInfo, getStakingInfo: call };
};
