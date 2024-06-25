import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { config } from '../../../config';
import { smartContract } from '../../smartContract';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(config.apiUrl, { timeout: 20000 });
const FUNCTION_NAME = 'getPageCelestials';

export const getPageCelestials = async (): Promise<{
    aurora: number;
    verdant: number;
    solara: number;
    emberheart: number;
    aetheris: number;
}> => {
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
            verdant: value.verdant.toNumber(),
            solara: value.solara.toNumber(),
            emberheart: value.emberheart.toNumber(),
            aetheris: value.aetheris.toNumber(),
        };

        return obj;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return {
            aurora: 0,
            verdant: 0,
            solara: 0,
            emberheart: 0,
            aetheris: 0,
        };
    }
};
