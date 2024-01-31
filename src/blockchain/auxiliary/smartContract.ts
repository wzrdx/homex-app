import { AbiRegistry, SmartContract, Address } from '@multiversx/sdk-core';
import { auxiliaryScAddress } from '../config';
import json from './auxiliary-sc.abi.json';

const abiRegistry = AbiRegistry.create(json);

export const smartContract = new SmartContract({
    address: new Address(auxiliaryScAddress),
    abi: abiRegistry,
});
