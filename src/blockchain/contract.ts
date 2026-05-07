import { AbiRegistry, Address, ContractFunction, TokenTransfer, Transaction } from 'services/sdkCore';
import { SmartContractQuery } from '@multiversx/sdk-core/out/core/smartContractQuery';
import { SmartContractTransactionsFactory } from '@multiversx/sdk-core/out/smartContracts/smartContractTransactionsFactory';
import { ArgSerializer } from '@multiversx/sdk-core/out/abi/argSerializer';

class ContractMethodBuilder {
    private sender?: Address;
    private gasLimit?: bigint;
    private tokenTransfers: TokenTransfer[] = [];

    constructor(
        private readonly factory: SmartContractTransactionsFactory,
        private readonly contract: Address,
        private readonly functionName: string,
        private readonly args: any[] = []
    ) {}

    withSender(sender: Address) {
        this.sender = sender;
        return this;
    }

    withExplicitReceiver(_receiver: Address) {
        return this;
    }

    withChainID(_chainID: string) {
        return this;
    }

    withGasLimit(gasLimit: number | bigint) {
        this.gasLimit = BigInt(gasLimit);
        return this;
    }

    withSingleESDTNFTTransfer(tokenTransfer: TokenTransfer) {
        this.tokenTransfers = [tokenTransfer];
        return this;
    }

    withMultiESDTNFTTransfer(tokenTransfers: TokenTransfer[]) {
        this.tokenTransfers = tokenTransfers;
        return this;
    }

    async buildTransaction(): Promise<Transaction> {
        if (!this.sender) {
            throw new Error(`Cannot build ${this.functionName} transaction without sender`);
        }

        return this.factory.createTransactionForExecute(this.sender, {
            contract: this.contract,
            function: this.functionName,
            arguments: this.args,
            tokenTransfers: this.tokenTransfers,
            gasLimit: this.gasLimit,
        });
    }
}

export const createSmartContract = ({
    address,
    abiRegistry,
    chainID,
}: {
    address: string;
    abiRegistry: AbiRegistry;
    chainID: string;
}) => {
    const contract = new Address(address);
    const factory = new SmartContractTransactionsFactory({
        config: {
            chainID,
            addressHrp: contract.getHrp(),
            minGasLimit: 50000n,
            gasLimitPerByte: 1500n,
            gasLimitClaimDeveloperRewards: 6000000n,
            gasLimitChangeOwnerAddress: 6000000n,
        },
        abi: abiRegistry,
    });

    return {
        address: contract,
        abi: abiRegistry,
        getEndpoint: (name: string) => abiRegistry.getEndpoint(name),
        createQuery: ({ func, args = [] }: { func: ContractFunction; args?: any[] }) => {
            const functionName = func.valueOf();
            const endpoint = abiRegistry.getEndpoint(functionName);
            const typedArgs = args.length ? args : [];
            const encodedArgs = new ArgSerializer().valuesToBuffers(typedArgs);

            return new SmartContractQuery({
                contract,
                function: functionName,
                arguments: encodedArgs,
            });
        },
        methods: new Proxy(
            {},
            {
                get:
                    (_target, functionName: string) =>
                    (args?: any[]) =>
                        new ContractMethodBuilder(factory, contract, functionName, args || []),
            }
        ) as Record<string, (args?: any[]) => ContractMethodBuilder>,
    };
};
