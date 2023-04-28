import { AbiRegistry, SmartContract, Address } from '@multiversx/sdk-core/out';

import { contractAddress } from './config';
import json from './game-sc.abi.json';

const abiRegistry = AbiRegistry.create(json);

export const smartContract = new SmartContract({
    address: new Address(contractAddress),
    abi: abiRegistry,
});
