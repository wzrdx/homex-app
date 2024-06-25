import { Address, AddressValue, ContractFunction, ResultsParser, U8Value } from '@multiversx/sdk-core/out';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { config } from '../../config';
import { smartContract } from '../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 10000 });
const FUNCTION_NAME = 'isPageMinted';

export const isPageMinted = async (index: number): Promise<boolean> => {
    try {
        const address = await getAddress();

        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new AddressValue(new Address(address)), new U8Value(index)],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        return firstValue?.valueOf();
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return false;
    }
};
