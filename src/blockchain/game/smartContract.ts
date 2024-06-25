import { AbiRegistry, Address, SmartContract } from '@multiversx/sdk-core';
import { config } from '../config';
import json from './game-sc.abi.json';

const abiRegistry = AbiRegistry.create(json);

export const smartContract = new SmartContract({
    address: new Address(config.gameScAddress),
    abi: abiRegistry,
});
