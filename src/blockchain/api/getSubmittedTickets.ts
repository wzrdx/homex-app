import { ResultsParser, ContractFunction, AddressValue, Address } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 12000 });
const FUNCTION_NAME = 'getSubmittedTickets';

export const getSubmittedTickets = async () => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new AddressValue(new Address(await getAddress()))],
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
