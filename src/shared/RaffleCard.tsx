import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { TICKETS_TOKEN_ID, CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { useResourcesContext, ResourcesContextType, RESOURCE_ELEMENTS } from '../services/resources';
import { useTransactionsContext, TransactionsContextType, TransactionType, TxResolution } from '../services/transactions';
import { ActionButton } from './ActionButton/ActionButton';
import { getFullTicket, getLogoBox, getMvxLogo } from '../services/assets';
import { Timer } from './Timer';
import { getRaffleTimestamp } from '../blockchain/api/getRaffleTimestamp';
import { isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getSubmittedTickets } from '../blockchain/api/getSubmittedTickets';
import { getSubmittedTicketsTotal } from '../blockchain/api/getSubmittedTicketsTotal';

const MAX_ENTRY = 4;

function RaffleCard() {
    const [amount, setAmount] = useState(0);
    const { resources } = useResourcesContext() as ResourcesContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);
    const [timestamp, setTimestamp] = useState<Date>();
    const [myTickets, setMyTickets] = useState<number>();
    const [totalTickets, setTotalTickets] = useState<number>();

    const { isTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();
    const navigate = useNavigate();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setAmount(resources.tickets > 0 ? 1 : 0);
        setTimestamp(await getRaffleTimestamp());
        setMyTickets(await getSubmittedTickets());
        setTotalTickets(await getSubmittedTicketsTotal());
    };

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
            minWidth={{ md: '304px', lg: '372px' }}
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#12121287"
            backdropFilter="blur(10px)"
            transition="all 0.1s ease-in"
            _hover={{ border: '2px solid #fdefce40' }}
        >
            <Box display="grid" gridTemplateRows="1fr 1fr" gridTemplateColumns="1fr 1fr">
                <Flex
                    backgroundColor="#521d23"
                    justifyContent="center"
                    alignItems="center"
                    width={{ md: '172px', lg: '186px' }}
                    height={{ md: '142px', lg: '186px' }}
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            height={{ md: '88px', lg: '100px' }}
                            width={{ md: '80px', lg: '100px' }}
                        >
                            <Image src={getLogoBox()} height={{ md: '78px', lg: '90px' }} alt="Traveler" />
                        </Flex>

                        <Text
                            fontSize={{ md: '15px', lg: '16px' }}
                            textTransform="uppercase"
                            color="primaryDark"
                            fontWeight={600}
                        >
                            2 Travelers
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    backgroundColor="#2b2d31"
                    justifyContent="center"
                    alignItems="center"
                    width={{ md: '172px', lg: '186px' }}
                    height={{ md: '142px', lg: '186px' }}
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            height={{ md: '88px', lg: '100px' }}
                            width={{ md: '80px', lg: '100px' }}
                        >
                            <Image src={getMvxLogo()} height={{ md: '54px', lg: '66px' }} alt="MultiversX" />
                        </Flex>

                        <Text
                            fontSize={{ md: '15px', lg: '16px' }}
                            textTransform="uppercase"
                            color="whitesmoke"
                            fontWeight={600}
                        >
                            6 EGLD
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    backgroundColor="#8c5816"
                    justifyContent="center"
                    alignItems="center"
                    width={{ md: '172px', lg: '186px' }}
                    height={{ md: '142px', lg: '186px' }}
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            height={{ md: '88px', lg: '100px' }}
                            width={{ md: '80px', lg: '100px' }}
                        >
                            <Image src={getFullTicket()} height={{ md: '70px', lg: '82px' }} alt="Ticket" />
                        </Flex>

                        <Text
                            fontSize={{ md: '15px', lg: '16px' }}
                            textTransform="uppercase"
                            color="brightWheat"
                            fontWeight={600}
                        >
                            32 Golden Tickets
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    backgroundColor="#3a182d"
                    justifyContent="center"
                    alignItems="center"
                    width={{ md: '172px', lg: '186px' }}
                    height={{ md: '142px', lg: '186px' }}
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            height={{ md: '88px', lg: '100px' }}
                            width={{ md: '80px', lg: '100px' }}
                        >
                            <Image src={RESOURCE_ELEMENTS.essence.icon} height={{ md: '60px', lg: '72px' }} alt="Essence" />
                        </Flex>

                        <Text
                            fontSize={{ md: '15px', lg: '16px' }}
                            textTransform="uppercase"
                            color="resources.essence"
                            fontWeight={600}
                        >
                            600 ESSENCE
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            <Flex flexDir="column" pb={{ md: 2.5, lg: 3.5 }} borderBottom="2px solid #fdefce26" width="100%">
                <Flex
                    pt={{ md: 2.5, lg: 3.5 }}
                    pb={{ md: 0, lg: 3.5 }}
                    px={{ md: 3, lg: 4 }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Flex flexDir="column" userSelect="none">
                        <Text layerStyle="header3">Total tickets</Text>
                        <Text fontWeight={500} letterSpacing="0.25px">
                            {totalTickets}
                        </Text>
                    </Flex>

                    <Flex flexDir="column" userSelect="none">
                        <Text layerStyle="header3">Your submission</Text>
                        <Text fontWeight={500} textAlign="right" letterSpacing="0.25px">
                            {myTickets}/4
                        </Text>
                    </Flex>
                </Flex>

                <Flex width="100%" justifyContent="center">
                    <Flex
                        alignItems="center"
                        px={2}
                        transition="all 0.1s ease-in"
                        cursor="pointer"
                        _hover={{ color: '#b8b8b8' }}
                        onClick={() => navigate('/rewards/raffles/1')}
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
                </Flex>
            </Flex>

            {timestamp && (
                <Flex pt={{ md: 2.5, lg: 3.5 }} width="100%" alignItems="center" justifyContent="center">
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
        </Flex>
    );
}

export default RaffleCard;
