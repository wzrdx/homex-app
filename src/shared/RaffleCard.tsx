import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { format, isAfter } from 'date-fns';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { config } from '../blockchain/config';
import { getRaffleSubmittedTickets } from '../blockchain/game/api/getRaffleSubmittedTickets';
import { smartContract } from '../blockchain/game/smartContract';
import { getBackgroundStyle } from '../services/helpers';
import { ResourcesContextType, useResourcesContext } from '../services/resources';
import { Competition, RAFFLES, RewardType } from '../services/rewards';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { ActionButton } from './ActionButton/ActionButton';
import { Timer } from './Timer';

function RaffleCard({
    id,
    timestamp,
    tickets,
    raffles,
}: {
    id: number;
    timestamp: Date;
    tickets: number;
    raffles: Competition[] | undefined;
}) {
    const [amount, setAmount] = useState(0);
    const { resources } = useResourcesContext() as ResourcesContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);
    const [myTickets, setMyTickets] = useState<number>();

    const { isRaffleTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();

    // Init
    useEffect(() => {
        init();
    }, [id, raffles]);

    const init = async () => {
        setAmount(resources.tickets > 0 ? 1 : 0);
        setMyTickets(await getRaffleSubmittedTickets(id));
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
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(config.ticketsTokenId, 1, amount))
                .withSender(user)
                .withChainID(config.chainId)
                .withGasLimit(11000000 + tickets * 125000)
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
                    data: {
                        id,
                    },
                    resolution: TxResolution.UpdateTicketsAndRaffles,
                },
            ]);
        } catch (err) {
            console.error('Error occured during joinRaffle', err);
        }
    };

    const getContent = (): JSX.Element => {
        const raffle = RAFFLES[id - 1];
        let element = <></>;

        if (!raffle) {
            return element;
        }

        switch (raffle.type) {
            case RewardType.SingleImage:
                return <Image src={raffle.imageSrc} height="100%" userSelect="none" />;

            case RewardType.Prizes:
                return (
                    <>
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
                                        <Image src={prize.imageSrc} height={prize.height} alt="Prize" />
                                    </Flex>

                                    <Text
                                        ml={3}
                                        mt="2.5px"
                                        textTransform="uppercase"
                                        color={prize.textColor}
                                        fontWeight={600}
                                        fontSize="17px"
                                    >
                                        {prize.text}
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                    </>
                );

            case RewardType.NFT:
                return (
                    <Flex position="relative" style={getBackgroundStyle(raffle.url)} height="100%">
                        <Flex position="absolute" right={0} bottom={0}>
                            <Flex
                                alignItems="center"
                                background="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.65) 30%)"
                                pr={1.5}
                                pl={6}
                                py="2px"
                            >
                                <Text
                                    pt="3px"
                                    ml={1}
                                    mr={0.5}
                                    color="whitesmoke"
                                    fontSize="12.5px"
                                    letterSpacing="0.25px"
                                    fontWeight={500}
                                    textTransform="uppercase"
                                >
                                    {`${raffle.name}${raffle.rank ? ` • ${raffle.rank}` : ''}`}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                );

            default:
                return element;
        }
    };

    return (
        <Flex
            flexDir="column"
            alignItems="center"
            border="2px solid #fdefce26"
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#12121287"
            backdropFilter="blur(10px)"
            transition="all 0.1s ease-in"
            _hover={{ border: '2px solid #fdefce40' }}
        >
            <Flex flexDir="column" width="100%" height="300px">
                {getContent()}
            </Flex>

            <Flex flexDir="column" pb={2.5} width="100%">
                <Flex flexDir="column" py={2.5} px={3} width="100%">
                    <Flex alignItems="center" justifyContent="space-between" userSelect="none">
                        <Text layerStyle="header3">Total tickets</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {tickets}
                        </Text>
                    </Flex>

                    <Flex alignItems="center" justifyContent="space-between" userSelect="none">
                        <Text layerStyle="header3">Timestamp</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {format(timestamp, 'PP')}
                        </Text>
                    </Flex>

                    <Flex alignItems="center" justifyContent="space-between" userSelect="none">
                        <Text layerStyle="header3">Winners</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {RAFFLES[id - 1]?.winners}
                        </Text>
                    </Flex>
                </Flex>

                {!isCompleted() && RAFFLES[id - 1]?.eligibilityRequired && (
                    <Box px={3} pb={2.5}>
                        <Text
                            py={2.5}
                            textAlign="center"
                            color="flipix"
                            backgroundColor="#d0ff0022"
                            fontSize="15px"
                            lineHeight="18px"
                        >
                            Min. FLIPiX trading volume of 20$ is required to be eligible for prizes.
                        </Text>
                    </Box>
                )}

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
                            <Text ml={1} textTransform="uppercase" fontWeight={500} fontSize="14px" letterSpacing="0.25px">
                                View details
                            </Text>
                        </Flex>
                    </Link>
                </Flex>
            </Flex>

            {!isCompleted() && timestamp && (
                <Flex pt={2.5} pl={1} borderTop="2px solid #fdefce26" width="100%" alignItems="center" justifyContent="center">
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
                <Flex pt={1} pb={2} alignItems="center">
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
                        <Box fontSize="18px" mb="1px">
                            <AiOutlineMinus />
                        </Box>
                    </Box>

                    <Box width="22px" mx={1.5} display="flex" alignItems="center" justifyContent="center">
                        <Text textAlign="center" fontSize="17px" fontWeight={500} userSelect="none">
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

                            if (amount < resources.tickets) {
                                setAmount(amount + 1);
                            }
                        }}
                    >
                        <Box fontSize="18px" mb="1px">
                            <AiOutlinePlus />
                        </Box>
                    </Box>
                </Flex>
            )}

            {!isCompleted() && (
                <Box width="100%">
                    <ActionButton
                        disabled={isGamePaused || !resources.tickets || !timestamp || isAfter(new Date(), timestamp)}
                        isLoading={isButtonLoading || isRaffleTxPending(TransactionType.JoinRaffle, id)}
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
