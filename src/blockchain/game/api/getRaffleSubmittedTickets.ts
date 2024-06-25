import { Address, AddressValue, ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { config } from '../../config';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });
const FUNCTION_NAME = 'getRaffleSubmittedTickets';

export const getRaffleSubmittedTickets = async (raffleId: number) => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new U32Value(raffleId), new AddressValue(new Address(await getAddress()))],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        return firstValue?.valueOf()?.toNumber();
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
