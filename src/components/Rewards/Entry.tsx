import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getTicketSFT } from '../../services/assets';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { ResourcesContextType, useResourcesContext } from '../../services/resources';
import { ActionButton } from '../../shared/ActionButton/ActionButton';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID, TICKETS_TOKEN_ID } from '../../blockchain/config';
import { smartContract } from '../../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Competition, useRewardsContext, RewardsContextType } from '../../services/rewards';

function Entry() {
    const [amount, setAmount] = useState(0);
    const [battle, setBattle] = useState<Competition>();

    const { resources } = useResourcesContext() as ResourcesContextType;
    const [isButtonLoading, setButtonLoading] = useState(false);

    const { isTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();

    const { battles } = useRewardsContext() as RewardsContextType;

    useEffect(() => {
        setBattle(_.first(battles));
    }, [battles]);

    useEffect(() => {
        setAmount(resources.tickets > 0 ? 1 : 0);
    }, []);

    const joinBattle = async () => {
        if (!amount || !battle || amount > resources.tickets) {
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .joinBattle([battle.id])
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(TICKETS_TOKEN_ID, 1, amount))
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(8000000)
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
                    type: TransactionType.JoinBattle,
                    resolution: TxResolution.UpdateTicketsAndBattles,
                },
            ]);
        } catch (err) {
            console.error('Error occured during joinBattle', err);
        }
    };

    return (
        <Flex justifyContent="center" height="100%">
            <Flex flexDir="column" alignItems="center">
                <Image
                    my={2}
                    height={{ md: '292px', lg: '372px' }}
                    src={getTicketSFT()}
                    alt="Ticket"
                    borderRadius="1px"
                    border="2px solid #fdefce1f"
                    userSelect="none"
                />

                <Text mt={{ md: 3, lg: 5 }} textAlign="center" maxWidth="464px" userSelect="none">
                    Use{' '}
                    <Text as="span" color="ticketGold">
                        Golden Tickets
                    </Text>{' '}
                    to participate in the current battle
                </Text>

                <Box my={{ md: 3, lg: 4 }} display="flex" alignItems="center">
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
                        disabled={isGamePaused || !resources.tickets}
                        isLoading={isButtonLoading || isTxPending(TransactionType.JoinBattle)}
                        colorScheme="default"
                        onClick={joinBattle}
                        customStyle={{ width: '156px' }}
                    >
                        <Text userSelect="none">Join Battle</Text>
                    </ActionButton>
                </Box>
            </Flex>
        </Flex>
    );
}

export default Entry;
