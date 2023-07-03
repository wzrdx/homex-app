import _ from 'lodash';
import { Box, Flex, Text, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { TICKETS_TOKEN_ID, CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { useResourcesContext, ResourcesContextType } from '../services/resources';
import { useTransactionsContext, TransactionsContextType, TransactionType, TxResolution } from '../services/transactions';
import { ActionButton } from './ActionButton/ActionButton';
import { Timer } from './Timer';
import { format, isAfter } from 'date-fns';
import { Link } from 'react-router-dom';
import { getSubmittedTickets } from '../blockchain/api/getSubmittedTickets';
import { RAFFLES } from '../services/rewards';

const MAX_ENTRY = 4;

function RaffleCard({ id, timestamp, vectorSize }: { id: number; timestamp: Date; vectorSize: number }) {
    const [amount, setAmount] = useState(0);
    const { resources } = useResourcesContext() as ResourcesContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);
    const [myTickets, setMyTickets] = useState<number>();

    const { isTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setAmount(resources.tickets > 0 ? 1 : 0);
        setMyTickets(await getSubmittedTickets(id));
    };

    const isCompleted = (): boolean => isAfter(new Date(), timestamp);

    const joinRaffle = async () => {
        if (!amount && amount > resources.tickets) {
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .joinRaffle([id])
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(TICKETS_TOKEN_ID, 1, amount))
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(18000000)
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
        <Flex
            flexDir="column"
            alignItems="center"
            border="2px solid #fdefce26"
            minWidth={{ md: '324px', lg: '372px' }}
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#12121287"
            backdropFilter="blur(10px)"
            transition="all 0.1s ease-in"
            _hover={{ border: '2px solid #fdefce40' }}
        >
            <Flex flexDir="column" width="100%" height={{ md: '260px', lg: '372px' }}>
                {_.map(RAFFLES[id - 1].prizes, (prize, index) => (
                    <Flex
                        key={index}
                        backgroundColor={prize.backgroundColor}
                        justifyContent="center"
                        alignItems="center"
                        userSelect="none"
                        height="100%"
                    >
                        <Flex justifyContent="center" alignItems="center">
                            <Flex justifyContent="center" alignItems="center">
                                <Image src={prize.imageSrc} height={prize.height} alt="Traveler" />
                            </Flex>

                            <Text
                                ml={2.5}
                                fontSize={{ md: '16px', lg: '18px' }}
                                textTransform="uppercase"
                                color={prize.textColor}
                                fontWeight={600}
                            >
                                {prize.text}
                            </Text>
                        </Flex>
                    </Flex>
                ))}
            </Flex>

            <Flex flexDir="column" pb={{ md: 2.5, lg: 3.5 }} width="100%">
                <Flex
                    pt={{ md: 2.5, lg: 3.5 }}
                    pb={{ md: 2.5, lg: 3.5 }}
                    px={{ md: 3, lg: 4 }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Flex flexDir="column" userSelect="none">
                        <Text layerStyle="header3">Total tickets</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {vectorSize}
                        </Text>
                    </Flex>

                    {isCompleted() ? (
                        <Flex flexDir="column" userSelect="none">
                            <Text layerStyle="header3" textAlign="right">
                                Timestamp
                            </Text>
                            <Text fontWeight={500} textAlign="right" letterSpacing="0.25px">
                                {format(timestamp, 'PP')}
                            </Text>
                        </Flex>
                    ) : (
                        <Flex flexDir="column" userSelect="none">
                            <Text layerStyle="header3" textAlign="right">
                                Your submission
                            </Text>

                            {myTickets === undefined ? (
                                <Flex alignItems="center" justifyContent="flex-end" height="24px">
                                    <Spinner size="sm" />
                                </Flex>
                            ) : (
                                <Text fontWeight={500} textAlign="right" letterSpacing="0.25px">
                                    {myTickets}/4
                                </Text>
                            )}
                        </Flex>
                    )}
                </Flex>

                <Flex width="100%" justifyContent="center">
                    <Link to={`/raffles/${id}?completed=${isCompleted()}`}>
                        <Flex
                            alignItems="center"
                            px={2}
                            transition="all 0.1s ease-in"
                            cursor="pointer"
                            _hover={{ color: '#b8b8b8' }}
                            userSelect="none"
                        >
                            <AiOutlineEye fontSize="19px" />
                            <Text
                                ml={1}
                                textTransform="uppercase"
                                fontWeight={500}
                                fontSize={{ md: '14px', lg: '15px' }}
                                letterSpacing="0.25px"
                            >
                                View details
                            </Text>
                        </Flex>
                    </Link>
                </Flex>
            </Flex>

            {!isCompleted() && timestamp && (
                <Flex
                    pt={{ md: 2.5, lg: 3.5 }}
                    borderTop="2px solid #fdefce26"
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text textTransform="uppercase" mr={1} fontSize="15px" fontWeight={500} userSelect="none">
                        Ends in
                    </Text>
                    <Timer
                        timestamp={timestamp as Date}
                        displayClock={false}
                        customStyle={{ textTransform: 'uppercase', fontSize: '15px', fontWeight: 500, userSelect: 'none' }}
                        isActive
                        isDescending
                        displayDays
                    />
                </Flex>
            )}

            {!isCompleted() && (
                <Flex pt={{ md: 1, lg: 2 }} pb={{ md: 2, lg: 3 }} alignItems="center">
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
                        <Box fontSize={{ md: '17px', lg: '19px' }}>
                            <AiOutlineMinus />
                        </Box>
                    </Box>

                    <Box width="22px" mx={1.5} display="flex" alignItems="center" justifyContent="center">
                        <Text textAlign="center" fontSize={{ md: '17px', lg: '18px' }} fontWeight={500} userSelect="none">
                            {amount}
                        </Text>
                    </Box>

                    <Box
                        px="1"
                        cursor="pointer"
                        transition="all 0.1s ease-in"
                        _hover={{ color: '#b8b8b8' }}
                        onClick={() => {
                            if (myTickets === undefined) {
                                return;
                            }

                            if (amount < MAX_ENTRY - myTickets) {
                                setAmount(amount + 1);
                            }
                        }}
                    >
                        <Box fontSize={{ md: '17px', lg: '19px' }}>
                            <AiOutlinePlus />
                        </Box>
                    </Box>
                </Flex>
            )}

            {!isCompleted() && (
                <Box width="100%">
                    <ActionButton
                        disabled={isGamePaused || !resources.tickets || !timestamp || isAfter(new Date(), timestamp)}
                        isLoading={isButtonLoading || isTxPending(TransactionType.JoinRaffle)}
                        colorScheme="red"
                        onClick={joinRaffle}
                        customStyle={{ width: '100%', borderRadius: 0, padding: '0.75rem' }}
                    >
                        <Text userSelect="none">Join Raffle</Text>
                    </ActionButton>
                </Box>
            )}
        </Flex>
    );
}

export default RaffleCard;
