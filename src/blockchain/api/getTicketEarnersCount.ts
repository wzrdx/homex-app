import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL);

export const getTicketEarnersCount = async (): Promise<number> => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction('getTicketEarnersCount'),
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint('getTicketEarnersCount');

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

        const value = firstValue?.valueOf();

        return value.toNumber() as number;
    } catch (err) {
        console.error('Unable to call getTicketEarnersAddresses', err);
        return 0;
    }
};
