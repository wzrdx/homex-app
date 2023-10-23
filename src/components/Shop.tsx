import _ from 'lodash';
import { Text, Flex, Image, Stack, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getArtDrop } from '../services/assets';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useResourcesContext, ResourcesContextType, RESOURCE_ELEMENTS } from '../services/resources';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { Address, TokenTransfer, U64Value } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { TICKETS_TOKEN_ID, CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import Separator from '../shared/Separator';

const AURORA_PRICE = 2;
const AURORA_XP = 100;

function Shop() {
    const [amount, setAmount] = useState(1);
    const [isButtonLoading, setButtonLoading] = useState(false);

    const { resources } = useResourcesContext() as ResourcesContextType;
    const { isTxPending, setPendingTxs } = useTransactionsContext() as TransactionsContextType;

    const { address } = useGetAccountInfo();

    useEffect(() => {}, []);

    const mint = async () => {
        if (!amount || amount > resources.tickets) {
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .mint([amount])
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(TICKETS_TOKEN_ID, 1, amount * AURORA_PRICE))
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
                },
            ]);
        } catch (err) {
            console.error('Error occured during MintArtDrop', err);
        }
    };

    return (
        <Flex justifyContent="center" height="100%">
            <Stack spacing={{ md: 3, lg: 4 }} alignItems="center" userSelect="none">
                <Text layerStyle="header1Alt">Aurora</Text>

                <Stack direction="row" spacing={4} alignItems="center">
                    <Image width={{ md: '234px', lg: '318px' }} src={getArtDrop()} />
                    <Text width={{ md: '398px', lg: '342px' }} lineHeight={{ md: '21px', lg: '24px' }} textAlign="justify">
                        In the frost-laden world of Almur, the legend of Aurora unfolds. Clad in armor reminiscent of ancient
                        Frostpriests, Aurora is an enigmatic warrior who harnesses the power of ice and mountains. Born in the
                        rocky region of Almur, Aurora possesses unique abilities bestowed during the celestial Frostfall event.
                        They stand as one of the chosen few among the five legendary characters. Gifted with Cryomancy, Aurora
                        commands ice and frost, summoning blizzards and freezing foes. Their journey through treacherous
                        landscapes and encounters with mythical creatures shape their destiny and impact the fate of Menhir. As
                        a beacon of hope, Aurora's presence inspires both awe and fear as they navigate their path towards their
                        cosmic purpose in the frigid realms of Sundsten.
                    </Text>
                </Stack>

                <Flex justifyContent="center" alignItems="center" userSelect="none">
                    <Text>Amount Due:</Text>
                    <Text mx={2} fontWeight={500}>
                        {amount * AURORA_PRICE}
                    </Text>
                    <Image width="24px" src={RESOURCE_ELEMENTS['tickets'].icon} alt="Resource" />

                    <Box mx={4}>
                        <Separator type="vertical" width="1px" height="36px" />
                    </Box>

                    <Text fontWeight={800} mr={2}>
                        XP
                    </Text>

                    <Text as="span" mr={1}>
                        +
                    </Text>
                    <Text as="span" fontWeight={600}>
                        {amount * AURORA_XP}
                    </Text>
                </Flex>

                <Box display="flex" alignItems="center">
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
                            if (amount < resources.tickets / AURORA_PRICE) {
                                setAmount(amount + 1);
                            }
                        }}
                    >
                        <AiOutlinePlus fontSize="19px" />
                    </Box>
                </Box>

                <Box>
                    <ActionButton
                        disabled={!resources.tickets}
                        isLoading={isButtonLoading || isTxPending(TransactionType.MintArtDrop)}
                        colorScheme="default"
                        onClick={mint}
                        customStyle={{ width: '156px' }}
                    >
                        <Text userSelect="none">Mint</Text>
                    </ActionButton>
                </Box>
            </Stack>
        </Flex>
    );
}

export default Shop;
