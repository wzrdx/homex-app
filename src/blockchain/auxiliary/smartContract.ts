import { AbiRegistry } from 'services/sdkCore';
import { createSmartContract } from '../contract';
import { config } from '../config';
import json from './auxiliary-sc.abi.json';

const abiRegistry = AbiRegistry.create(json);

export const smartContract = createSmartContract({
    address: config.auxiliaryScAddress,
    abiRegistry,
    chainID: config.chainId,
});
