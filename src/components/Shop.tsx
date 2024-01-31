import _ from 'lodash';
import { Text, Flex, Image, Stack, Box, Spinner, Alert, AlertIcon, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getArtDrop } from '../services/assets';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useResourcesContext, ResourcesContextType, RESOURCE_ELEMENTS } from '../services/resources';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { TICKETS_TOKEN_ID, CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/game/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import Separator from '../shared/Separator';
import { LargeTimer } from '../shared/LargeTimer';
import { getArtDropTimestamp } from '../blockchain/game/api/getArtDropTimestamp';
import { isAfter } from 'date-fns';

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
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(TICKETS_TOKEN_ID, 1, amount * PRICE))
                .withSender(user)
                .withChainID(CHAIN_ID)
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
