import { Alert, AlertIcon, Flex, Spinner } from '@chakra-ui/react';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useEffect, useState } from 'react';
import { config } from '../blockchain/config';
import { getArtDropTimestamp } from '../blockchain/game/api/getArtDropTimestamp';
import { smartContract } from '../blockchain/game/smartContract';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';

const PRICE = 3;
const XP = 1500;

function Shop() {
    const [timestamp, setTimestamp] = useState<Date>();

    const [amount, setAmount] = useState(1);
    const [isButtonLoading, setButtonLoading] = useState(false);

    const { resources } = useResourcesContext() as ResourcesContextType;
    const { isTxPending, setPendingTxs } = useTransactionsContext() as TransactionsContextType;

    const { address } = useGetAccountInfo();

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setTimestamp(await getArtDropTimestamp());
    };

    const mint = async () => {
        if (!amount || amount > resources.tickets) {
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .mint([amount])
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(config.ticketsTokenId, 1, amount * PRICE))
                .withSender(user)
                .withChainID(config.chainId)
                .withGasLimit(9000000 + 250000 * amount)
                .buildTransaction();

            await refreshAccount();

            const { sessionId } = await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    processingMessage: 'Processing transaction',
                    errorMessage: 'Error',
                    successMessage: 'Transaction successful',
                },
                redirectAfterSign: false,
            });

            setButtonLoading(false);

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.MintArtDrop,
                    resolution: TxResolution.UpdateTickets,
                    data: {
                        amount,
                        xp: XP * amount,
                    },
                },
            ]);
        } catch (err) {
            console.error('Error occured during MintArtDrop', err);
        }
    };

    return (
        <Flex justifyContent="center" height="100%">
            {!timestamp ? (
                <Spinner />
            ) : (
                <Flex alignItems="flex-start">
                    <Alert status="info" width="auto">
                        <AlertIcon />
                        There is nothing to be bought at the moment
                    </Alert>
                </Flex>
            )}
        </Flex>
    );
}

export default Shop;
