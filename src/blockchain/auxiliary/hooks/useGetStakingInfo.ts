import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useState } from 'react';
import { smartContract } from '../smartContract';
import { API_URL } from '../../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { map, size } from 'lodash';
import { MazeStakingInfo } from '../../types';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getStakingInfo';

export const useGetStakingInfo = () => {
    const [mazeStakingInfo, setMazeStakingInfo] = useState<MazeStakingInfo>();

    const call = async (): Promise<MazeStakingInfo | undefined> => {
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
            const stakingInfo = value.field0;
            const mazeBalance = value.field1;

            const info: MazeStakingInfo = {
                isStaked: size(stakingInfo.tokens) > 0,
                rewards: stakingInfo.rewards.toNumber(),
                timestamp: new Date(stakingInfo.timestamp.toNumber() * 1000),
                tokens: map(stakingInfo.tokens, (token) => ({
                    tokenId: token.token_id,
                    nonce: token.nonce.toNumber(),
                    amount: token.amount.toNumber(),
                    timestamp: !token?.timestamp ? null : new Date(token?.timestamp?.toNumber() * 1000),
                })),
                mazeBalance: mazeBalance.toNumber(),
            };

            setMazeStakingInfo(info);
            return info;
        } catch (err) {
            console.error(`Unable to call ${FUNCTION_NAME}`, err);
        }
    };

    return { mazeStakingInfo, getMazeStakingInfo: call };
};
