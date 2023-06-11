import _ from 'lodash';
import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getTicketSFT } from '../../services/assets';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { ResourcesContextType, useResourcesContext } from '../../services/resources';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import {
    TransactionType,
    TransactionsContextType,
    TxResolution,
    useTransactionsContext,
} from '../../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { TICKETS_TOKEN_ID } from '../../blockchain/config';
import { smartContract } from '../../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

function Raffle() {
    const [amount, setAmount] = useState(0);
    const { resources } = useResourcesContext() as ResourcesContextType;
    const [isButtonLoading, setButtonLoading] = useState(false);

    const { isTxPending, setPendingTxs } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();

    useEffect(() => {
        setAmount(resources.tickets > 0 ? 1 : 0);
    }, []);

    const joinRaffle = async () => {
        if (!amount && amount > resources.tickets) {
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .joinRaffle()
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(TICKETS_TOKEN_ID, 1, amount))
                .withSender(user)
                .withChainID('D')
                .withGasLimit(6000000)
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
                    type: TransactionType.JoinRaffle,
                    resolution: TxResolution.UpdateTickets,
                },
            ]);
        } catch (err) {
            console.error('Error occured during joinRaffle', err);
        }
    };

    return (
        <Flex justifyContent="center" height="100%">
            <Flex flexDir="column" alignItems="center">
                <Image
                    my={2}
                    height="372px"
                    src={getTicketSFT()}
                    alt="Ticket"
                    borderRadius="1px"
                    border="2px solid #fdefce1f"
                    userSelect="none"
                />

                <Text mt={5} fontSize="17px" textAlign="center" maxWidth="464px" userSelect="none">
                    Use{' '}
                    <Text as="span" color="ticketGold">
                        Golden Tickets
                    </Text>{' '}
                    to participate in the raffle
                </Text>

                <Box my={4} display="flex" alignItems="center">
                    <Box
                        px="1"
                        cursor="pointer"
                        transition="all 0.1s ease-in"
                        _hover={{ color: '#b8b8b8' }}
                        onClick={() => {
                            if (amount > 1) {
                                setAmount(amount - 1);
                            }
                        }}
                    >
                        <AiOutlineMinus fontSize="19px" />
                    </Box>

                    <Box width="22px" mx={1.5} display="flex" alignItems="center" justifyContent="center">
                        <Text textAlign="center" fontSize="18px" fontWeight={500} userSelect="none">
                            {amount}
                        </Text>
                    </Box>

                    <Box
                        px="1"
                        cursor="pointer"
                        transition="all 0.1s ease-in"
                        _hover={{ color: '#b8b8b8' }}
                        onClick={() => {
                            if (amount < resources.tickets) {
                                setAmount(amount + 1);
                            }
                        }}
                    >
                        <AiOutlinePlus fontSize="19px" />
                    </Box>
                </Box>

                <Box mt={1.5}>
                    <ActionButton
                        isLoading={isButtonLoading || isTxPending(TransactionType.JoinRaffle)}
                        colorScheme="default"
                        onClick={joinRaffle}
                        customStyle={{ width: '156px' }}
                    >
                        <Text userSelect="none">Join Raffle</Text>
                    </ActionButton>
                </Box>
            </Flex>
        </Flex>
    );
}

export default Raffle;
