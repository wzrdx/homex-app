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
import Typewriter from 'typewriter-effect';

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
                .withGasLimit(9000000)
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
        <Flex height="100%" justifyContent="center" alignItems="center">
            <Flex width={{ md: '898px', lg: '510px' }} flexDir="column" justifyContent="center" alignItems="center">
                <Image
                    width={{ md: '330px', lg: '100%' }}
                    src={Praying}
                    alt="Energy"
                    borderRadius="1px"
                    border="2px solid #dadada3d"
                />

                <Text my={4} layerStyle="questDescription" minHeight={{ md: '110px', lg: '198px' }}>
                    <Typewriter
                        onInit={(typewriter) => {
                            typewriter
                                .typeString(
                                    'Deep within the secluded realms of Menhir lies the enigmatic lore of a clandestine, time-weathered tribe known as the First Travelers. Revered as elusive beings of arcane prowess, they embraced an ancient rite—a solemn, mystique-laden ritual. Within this ritual, they beseeched ethereal forces for the coveted essence named Energy. This elixir granted everlasting vitality to the chosen few who ventured into the ritualistic labyrinth, enveloping them in ageless wisdom and empowering their mortal bodies with unyielding fortitude against the passage of time.'
                                )
                                .start();
                        }}
                        options={{
                            delay: 0.2,
                        }}
                    />
                </Text>

                <Flex mb={6} alignItems="center">
                    <Box position="relative">
                        <Image
                            src={image}
                            alt="Reward"
                            borderRadius="50%"
                            width="100px"
                            height="100px"
                            boxShadow="0 0 6px 3px #0000008c"
                            backgroundColor="black"
                        />
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
                        <Text>Begin Ritual</Text>
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
