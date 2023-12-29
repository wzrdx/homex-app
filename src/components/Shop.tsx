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
import { smartContract } from '../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import Separator from '../shared/Separator';
import { LargeTimer } from '../shared/LargeTimer';
import { getArtDropTimestamp } from '../blockchain/api/getArtDropTimestamp';
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

                // <Stack spacing={{ md: 2, lg: 4 }} alignItems="center" userSelect="none">
                //     <Flex flexDir="column" alignItems="center" justifyContent="center">
                //         <Text layerStyle="header1Alt" color="brightBlue">
                //             Aetheris Art Drop
                //         </Text>

                //         {isAfter(new Date(), timestamp) ? (
                //             <Text layerStyle="header2">MINT ENDED</Text>
                //         ) : (
                //             <LargeTimer timestamp={timestamp} callback={() => init()} />
                //         )}
                //     </Flex>

                //     <Stack direction="row" spacing={4} alignItems="center">
                //         <Image width={{ md: '250px', lg: '306px' }} src={getArtDrop()} />

                //         <Text width={{ md: '398px', lg: '342px' }} lineHeight={{ md: '21px', lg: '22px' }} textAlign="justify">
                //             In the hidden depths below Menhir's surface, a mysterious legend unfolded—Aetheris, the enigmatic
                //             Celestial representing the intricate underground mazes. Her scarlet robes billowed like the whispers
                //             of unseen winds as she navigated the complex mazes, leaving behind an aura of mystique. Tales spoke
                //             of Aetheris' ability to commune with the patterns of the underground passages, sensing disturbances
                //             and preserving the equilibrium of Menhir's hidden world. As the most powerful Celestial, Aetheris
                //             remained a figure of awe and reverence. The travelers, in hushed tones, spoke of her interventions
                //             in times of peril, when the underground mazes seemed to shift and reshape. Aetheris, with her robes
                //             ablaze, would emerge to channel energies that brought order to the labyrinthine chaos.
                //         </Text>
                //     </Stack>

                //     <Flex justifyContent="center" alignItems="center" userSelect="none">
                //         <Text>Amount Due:</Text>
                //         <Text mx={2} fontWeight={500} color="ticketGold">
                //             {amount * PRICE}
                //         </Text>
                //         <Image width="22px" src={RESOURCE_ELEMENTS['tickets'].icon} alt="Resource" />

                //         <Box mx={4}>
                //             <Separator type="vertical" width="1px" height="36px" />
                //         </Box>

                //         <Text fontWeight={800} mr={2}>
                //             XP
                //         </Text>

                //         <Text as="span" mr={0.5}>
                //             +
                //         </Text>
                //         <Text as="span" fontWeight={600}>
                //             {amount * XP}
                //         </Text>
                //     </Flex>

                //     <Box display="flex" alignItems="center">
                //         <Box
                //             px="1"
                //             cursor="pointer"
                //             transition="all 0.1s ease-in"
                //             _hover={{ color: '#b8b8b8' }}
                //             onClick={() => {
                //                 if (amount > 1) {
                //                     setAmount(amount - 1);
                //                 }
                //             }}
                //         >
                //             <AiOutlineMinus fontSize="19px" />
                //         </Box>

                //         <Box width="22px" mx={1.5} display="flex" alignItems="center" justifyContent="center">
                //             <Text textAlign="center" fontSize="18px" fontWeight={500} userSelect="none">
                //                 {amount}
                //             </Text>
                //         </Box>

                //         <Box
                //             px="1"
                //             cursor="pointer"
                //             transition="all 0.1s ease-in"
                //             _hover={{ color: '#b8b8b8' }}
                //             onClick={() => {
                //                 if (amount < resources.tickets / PRICE) {
                //                     setAmount(amount + 1);
                //                 }
                //             }}
                //         >
                //             <AiOutlinePlus fontSize="19px" />
                //         </Box>
                //     </Box>

                //     <Box>
                //         <ActionButton
                //             disabled={!resources.tickets || isAfter(new Date(), timestamp)}
                //             isLoading={isButtonLoading || isTxPending(TransactionType.MintArtDrop)}
                //             colorScheme="default"
                //             onClick={mint}
                //             customStyle={{ width: '156px' }}
                //         >
                //             <Text userSelect="none">Mint</Text>
                //         </ActionButton>
                //     </Box>
                // </Stack>
            )}
        </Flex>
    );
}

export default Shop;
