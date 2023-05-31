import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL);

export const isWhitelisted = async (address: string) => {
    try {
        const query = smartContract.createQuery({
            func: new ContractFunction('isWhitelisted'),
            args: [new AddressValue(new Address(address))],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint('isWhitelisted');

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);

        const value = firstValue?.valueOf();
        console.log('isWhitelisted', value);
        return value;
    } catch (err) {
        console.error('Unable to call isWhitelisted', err);
    }
};
