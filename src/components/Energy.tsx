import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Praying from '../assets/images/energy.jpg';
import { useEffect, useState } from 'react';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { Address } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { getAddress, refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import { PendingTx, TxResolution } from '../blockchain/types';
import { useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { useTransactionsContext, TransactionsContextType, TransactionType } from '../services/transactions';
import { TimeIcon } from '@chakra-ui/icons';
import { ResourcesContextType, getResourceElements, useResourcesContext } from '../services/resources';
import { filter, find } from 'lodash';

export const FAUCET_REWARD = {
    resource: 'energy',
    name: 'Focus',
    value: 10,
};

function Energy() {
    const [isEnergyButtonLoading, setEnergyButtonLoading] = useState(false);
    const { setTxs, isFaucetTxPending } = useTransactionsContext() as TransactionsContextType;
    const { getEnergy } = useResourcesContext() as ResourcesContextType;
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();
    const [pendingTxs, setPendingTxs] = useState<PendingTx[]>([]);

    const { name, icon, image } = getResourceElements('energy');

    // Tx tracker
    useEffect(() => {
        if (hasSuccessfulTransactions) {
            successfulTransactionsArray.forEach((tx: [string, any]) => {
                const pendingTx = find(pendingTxs, (pTx) => pTx.sessionId === tx[0]);

                if (pendingTx) {
                    console.log('TxResolution', pendingTx);

                    setPendingTxs((array) => filter(array, (pTx) => pTx.sessionId !== pendingTx.sessionId));

                    switch (pendingTx.resolution) {
                        case TxResolution.UpdateEnergy:
                            getEnergy();
                            break;

                        default:
                            console.error('Unknown txResolution type');
                    }
                }
            });
        }
    }, [successfulTransactionsArray]);

    const faucet = async () => {
        setEnergyButtonLoading(true);

        const address = await getAddress();
        const user = new Address(address);

        try {
            const tx = smartContract.methods
                .faucet()
                .withSender(user)
                .withChainID('D')
                .withGasLimit(5000000)
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

            setEnergyButtonLoading(false);

            setTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.Faucet,
                },
            ]);

            setPendingTxs((array) => [
                ...array,
                {
                    sessionId,
                    resolution: TxResolution.UpdateEnergy,
                },
            ]);
        } catch (err) {
            console.error('Error occured while calling faucet', err);
        }
    };

    return (
        <Flex height={{ md: '100%', lg: '90%' }} justifyContent="center" alignItems="center">
            <Flex width={{ md: '442px', lg: '512px' }} flexDir="column" justifyContent="center" alignItems="center">
                <Image
                    src={Praying}
                    alt="Dome"
                    borderRadius="1px"
                    border="2px solid #8ec2dd3d"
                    boxShadow="0 0 6px #1e90ff69"
                />

                <Text my={4} layerStyle="questDescription">
                    Embark on a quest to captivate the hearts and minds of the people of Menhir with your exciting
                    stories. Gather a crowd, enthralling them with tales of your daring exploits and mesmerizing
                    adventures. In return for your storytelling prowess, be rewarded with gleaming gems as a token of
                    their appreciation.
                </Text>

                <Flex mt={1} mb={6} alignItems="center">
                    <Box position="relative">
                        <Image
                            src={image}
                            alt="Reward"
                            borderRadius="16px"
                            width="100px"
                            height="100px"
                            boxShadow="0 0 6px 3px #0000008c"
                        />

                        {/* Inner shadow */}
                        <Box
                            position="absolute"
                            borderRadius="16px"
                            zIndex={1}
                            top={0}
                            right={0}
                            bottom={0}
                            left={0}
                            boxShadow="inset 0 0 12px 4px #0000003d"
                        ></Box>
                    </Box>

                    <Flex flexDir="column" ml={4}>
                        <Text mb={1} fontSize="18px">
                            {name}
                        </Text>

                        <Flex alignItems="center">
                            <Text fontSize="18px" mr={2}>
                                <Text as="span" mr={1}>
                                    +
                                </Text>
                                <Text as="span" fontWeight={600}>
                                    {FAUCET_REWARD.value}
                                </Text>
                            </Text>

                            {!!icon && <Image width="28px" mr={2} src={icon} alt="Icon" />}
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDir="column" justifyContent="center" alignItems="center">
                    <ActionButton
                        isLoading={isEnergyButtonLoading || isFaucetTxPending()}
                        colorScheme="blue"
                        onClick={faucet}
                    >
                        <Text>Faucet</Text>
                    </ActionButton>

                    <Flex mt={2} alignItems="center">
                        <TimeIcon boxSize={4} color="whitesmoke" />
                        <Text ml={2}>Instantly</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Energy;
