import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL } from '../../config';
import { smartContract } from '../../smartContract';
import { getAddress } from '@multiversx/sdk-dapp/utils';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getPageLegendaryArt';

export const getPageLegendaryArt = async () => {
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

        const obj = {
            aurora: value.aurora.toNumber(),
        };

        console.log(obj);

        return obj;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return new Date();
    }
};
