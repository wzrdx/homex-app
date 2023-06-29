import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { TICKETS_TOKEN_ID, CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { useResourcesContext, ResourcesContextType, RESOURCE_ELEMENTS } from '../services/resources';
import { useTransactionsContext, TransactionsContextType, TransactionType, TxResolution } from '../services/transactions';
import { ActionButton } from './ActionButton/ActionButton';
import { getFullTicket, getLogoBox, getMvxLogo, getSmallLogo } from '../services/assets';
import { Timer } from './Timer';
import { getRaffleTimestamp } from '../blockchain/api/getRaffleTimestamp';

function RaffleCard() {
    const [amount, setAmount] = useState(0);
    const { resources } = useResourcesContext() as ResourcesContextType;
    const [isButtonLoading, setButtonLoading] = useState(false);
    const [timestamp, setTimestamp] = useState<Date>();

    const { isTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { address } = useGetAccountInfo();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setAmount(resources.tickets > 0 ? 1 : 0);
        setTimestamp(await getRaffleTimestamp());
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
            minWidth="372px"
            borderRadius="2px"
            overflow="hidden"
            backgroundColor="#181111"
            transition="all 0.15s ease-in"
            _hover={{ border: '2px solid #fdefce40' }}
        >
            <Box display="grid" gridTemplateRows="1fr 1fr" gridTemplateColumns="1fr 1fr">
                <Flex
                    backgroundColor="#521d23"
                    justifyContent="center"
                    alignItems="center"
                    width="186px"
                    height="186px"
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex justifyContent="center" alignItems="center" height="100px" width="100px">
                            <Image src={getLogoBox()} height="90px" alt="Traveler" />
                        </Flex>

                        <Text textTransform="uppercase" color="primaryDark" fontWeight={600}>
                            2 Travelers
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    backgroundColor="#333333"
                    justifyContent="center"
                    alignItems="center"
                    width="186px"
                    height="186px"
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex justifyContent="center" alignItems="center" height="100px" width="100px">
                            <Image src={getMvxLogo()} height="66px" alt="MultiversX" />
                        </Flex>

                        <Text textTransform="uppercase" color="whitesmoke" fontWeight={600}>
                            6 EGLD
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    backgroundColor="#8c5816"
                    justifyContent="center"
                    alignItems="center"
                    width="186px"
                    height="186px"
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex justifyContent="center" alignItems="center" height="100px" width="100px">
                            <Image src={getFullTicket()} height="82px" alt="Ticket" />
                        </Flex>

                        <Text textTransform="uppercase" color="brightWheat" fontWeight={600}>
                            32 Golden Tickets
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    backgroundColor="#3a182d"
                    justifyContent="center"
                    alignItems="center"
                    width="186px"
                    height="186px"
                    userSelect="none"
                >
                    <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Flex justifyContent="center" alignItems="center" height="100px" width="100px">
                            <Image src={RESOURCE_ELEMENTS.essence.icon} height="72px" alt="Essence" />
                        </Flex>

                        <Text textTransform="uppercase" color="resources.essence" fontWeight={600}>
                            600 ESSENCE
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            <Flex
                py={3.5}
                px={4}
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                borderBottom="2px solid #fdefce26"
            >
                <Flex flexDir="column" userSelect="none">
                    <Text layerStyle="header3">Total tickets</Text>
                    <Text fontWeight={500} letterSpacing="0.25px">
                        138
                    </Text>
                </Flex>

                <Flex flexDir="column" userSelect="none">
                    <Text layerStyle="header3">Your submission</Text>
                    <Text fontWeight={500} textAlign="right" letterSpacing="0.25px">
                        0/4
                    </Text>
                </Flex>
            </Flex>

            {timestamp && (
                <Flex pt={3.5} width="100%" alignItems="center" justifyContent="center">
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

            <Flex pt={2} pb={3} alignItems="center">
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
            </Flex>

            <Box width="100%">
                <ActionButton
                    disabled={isGamePaused || !resources.tickets}
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
