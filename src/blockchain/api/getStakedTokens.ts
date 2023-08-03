import { ResultsParser, ContractFunction, U32Value, AddressValue, Address } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../smartContract';
import { API_URL } from '../config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { map } from 'lodash';

const resultsParser = new ResultsParser();
const proxy = new ProxyNetworkProvider(API_URL, { timeout: 20000 });
const FUNCTION_NAME = 'getStakedNFTs';

export const getStakedNFTs = async () => {
    try {
        const address = await getAddress();

        const query = smartContract.createQuery({
            func: new ContractFunction(FUNCTION_NAME),
            args: [new AddressValue(new Address(address))],
        });

        const queryResponse = await proxy.queryContract(query);
        const endpointDefinition = smartContract.getEndpoint(FUNCTION_NAME);

        const { firstValue } = resultsParser.parseQueryResponse(queryResponse, endpointDefinition);
        const array = firstValue?.valueOf();

        const parsedArray = map(array, (item) => ({
            tokenId: item?.token_id,
            amount: item?.amount?.toNumber(),
            nonce: item?.nonce?.toNumber(),
            timestamp: !item?.timestamp ? null : new Date(item?.timestamp?.toNumber() * 1000),
        }));

        console.log(FUNCTION_NAME, parsedArray);

        return parsedArray;
    } catch (err) {
        console.error(`Unable to call ${FUNCTION_NAME}`, err);
        return [];
    }
};
