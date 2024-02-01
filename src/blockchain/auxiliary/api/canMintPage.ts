import { ResultsParser, ContractFunction, U8Value, AddressValue, Address } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL } from '../../config';
import { smartContract } from '../smartContract';
import { getAddress } from '@multiversx/sdk-dapp/utils';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 10000 });
const FUNCTION_NAME = 'canMintPage';

export const canMintPage = async (index: number): Promise<boolean> => {
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
