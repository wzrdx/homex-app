import { ResultsParser, ContractFunction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL } from '../../config';
import { smartContract } from '../../smartContract';
import { getAddress } from '@multiversx/sdk-dapp/utils';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getLogSummary';

export const getLogSummary = async (): Promise<{
    questsCompleted: number;
    herbalism: number;
    jewelcrafting: number;
    divination: number;
    tickets: number;
    energy: number;
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
            questsCompleted: value.quests_completed.toNumber(),
            herbalism: value.type_1.toNumber(),
            jewelcrafting: value.type_2.toNumber(),
            divination: value.type_3.toNumber(),
            tickets: value.tickets.toNumber(),
            energy: value.energy.toNumber(),
        };

        return obj;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return {
            questsCompleted: 0,
            herbalism: 0,
            jewelcrafting: 0,
            divination: 0,
            tickets: 0,
            energy: 0,
        };
    }
};
