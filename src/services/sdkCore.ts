import BigNumber from 'bignumber.js';
import { ArgSerializer } from '@multiversx/sdk-core/out/abi/argSerializer';
import { AbiRegistry } from '@multiversx/sdk-core/out/abi/typesystem/abi';
import { AddressValue } from '@multiversx/sdk-core/out/abi/typesystem/address';
import { ContractFunction } from '@multiversx/sdk-core/out/abi/function';
import { List, OptionType, OptionValue } from '@multiversx/sdk-core/out/abi/typesystem/generic';
import { TokenIdentifierValue } from '@multiversx/sdk-core/out/abi/typesystem/tokenIdentifier';
import { U8Type, U8Value, U16Type, U16Value, U32Value, U64Type, U64Value } from '@multiversx/sdk-core/out/abi/typesystem/numerical';
import { Address } from '@multiversx/sdk-core/out/core/address';
import { Token, TokenTransfer as CoreTokenTransfer } from '@multiversx/sdk-core/out/core/tokens';
import { Transaction } from '@multiversx/sdk-core/out/core/transaction';
import { SmartContractQueryResponse } from '@multiversx/sdk-core/out/core/smartContractQuery';

export {
    AbiRegistry,
    Address,
    AddressValue,
    ContractFunction,
    List,
    OptionType,
    OptionValue,
    Token,
    TokenIdentifierValue,
    Transaction,
    U8Type,
    U8Value,
    U16Type,
    U16Value,
    U32Value,
    U64Type,
    U64Value,
};

const toAtomicAmount = (amount: BigNumber.Value, decimals = 0): bigint => {
    const atomic = new BigNumber(amount).shiftedBy(decimals).integerValue(BigNumber.ROUND_FLOOR);
    return BigInt(atomic.toFixed(0));
};

export class TokenTransfer extends CoreTokenTransfer {
    static fungibleFromAmount(identifier: string, amount: BigNumber.Value, decimals: number): TokenTransfer {
        return new TokenTransfer({
            token: new Token({ identifier }),
            amount: toAtomicAmount(amount, decimals),
        });
    }

    static semiFungible(identifier: string, nonce: number, quantity: BigNumber.Value): TokenTransfer {
        return new TokenTransfer({
            token: new Token({ identifier, nonce: BigInt(nonce) }),
            amount: toAtomicAmount(quantity),
        });
    }

    static nonFungible(identifier: string, nonce: number): TokenTransfer {
        return new TokenTransfer({
            token: new Token({ identifier, nonce: BigInt(nonce) }),
            amount: 1n,
        });
    }
}

export class ResultsParser {
    parseQueryResponse(queryResponse: SmartContractQueryResponse, endpointDefinition: { output: any[] }) {
        const values = new ArgSerializer().buffersToValues(
            queryResponse.returnDataParts.map((part) => Buffer.from(part)),
            endpointDefinition.output
        );

        return {
            firstValue: values[0],
            values,
        };
    }
}
