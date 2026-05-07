import { AbiRegistry } from 'services/sdkCore';
import { createSmartContract } from '../contract';
import { config } from '../config';
import json from './game-sc.abi.json';

const abiRegistry = AbiRegistry.create(json);

export const smartContract = createSmartContract({
    address: config.gameScAddress,
    abiRegistry,
    chainID: config.chainId,
});
