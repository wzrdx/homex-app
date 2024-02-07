import { AbiRegistry, SmartContract, Address } from '@multiversx/sdk-core';
import { gameScAddress } from '../config';
import json from './game-sc.abi.json';

const abiRegistry = AbiRegistry.create(json);

export const smartContract = new SmartContract({
    address: new Address(gameScAddress),
    abi: abiRegistry,
});
