import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Praying from '../assets/images/energy.jpg';
import { useEffect, useState } from 'react';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { Address } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { getAddress, refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import { useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { useTransactionsContext, TransactionsContextType, TransactionType } from '../services/transactions';
import { TimeIcon } from '@chakra-ui/icons';
import { ResourcesContextType, getResourceElements, useResourcesContext } from '../services/resources';
import { filter, find } from 'lodash';
import Typewriter from 'typewriter-effect';
import Reward from '../shared/Reward';

export const FAUCET_REWARD = {
    resource: 'energy',
    name: 'Focus',
    value: 10,
};

function Energy() {
    const [isEnergyButtonLoading, setEnergyButtonLoading] = useState(false);

    const { setPendingTxs, isFaucetTxPending } = useTransactionsContext() as TransactionsContextType;
    const { getEnergy } = useResourcesContext() as ResourcesContextType;

    const { name, icon, image } = getResourceElements('energy');

    // const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();
    // const [pendingTxs, setPendingTxs] = useState<PendingTx[]>([]);

    // // Tx tracker
    // useEffect(() => {
    //     if (hasSuccessfulTransactions) {
    //         successfulTransactionsArray.forEach((tx: [string, any]) => {
    //             const pendingTx = find(pendingTxs, (pTx) => pTx.sessionId === tx[0]);

    //             if (pendingTx) {
    //                 console.log('TxResolution', pendingTx);

    //                 setPendingTxs((array) => filter(array, (pTx) => pTx.sessionId !== pendingTx.sessionId));

    //                 switch (pendingTx.resolution) {
    //                     case TxResolution.UpdateEnergy:
    //                         getEnergy();
    //                         break;

    //                     default:
    //                         console.error('Unknown txResolution type');
    //                 }
    //             }
    //         });
    //     }
    // }, [successfulTransactionsArray]);

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

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.Faucet,
                },
            ]);

            // setPendingTxs((array) => [
            //     ...array,
            //     {
            //         sessionId,
            //         resolution: TxResolution.UpdateEnergy,
            //     },
            // ]);
        } catch (err) {
            console.error('Error occured while calling faucet', err);
        }
    };

    return (
        <Flex height="100%" justifyContent="center" alignItems="center">
            <Flex width={{ md: '898px', lg: '710px' }} flexDir="column" justifyContent="center" alignItems="center">
                <Image
                    width={{ md: '330px', lg: '460px' }}
                    minHeight={{ md: '200px', lg: '320px' }}
                    src={Praying}
                    alt="Energy"
                    borderRadius="1px"
                    border="2px solid #dadada3d"
                />

                <Text my={4} layerStyle="questDescription" minHeight={{ md: '110px', lg: '154px' }}>
                    <Typewriter
                        onInit={(typewriter) => {
                            typewriter
                                .typeString(
                                    'Hidden deep within the desert, there exists a mysterious tribe called the The First Travelers. They are revered as secretive and powerful beings, skilled in ancient magic. These enigmatic individuals practiced a special ceremony, full of intrigue and wonder, where they sought a highly sought-after potion called "Energy." This magical elixir, which granted everlasting life, was given only to a select few who dared to explore a complex labyrinth during the ritual. Those who received it gained eternal vigor, enveloped in an aura of timeless wisdom, and possessed unwavering strength that defied the passing of years.'
                                )
                                .start();
                        }}
                        options={{
                            delay: 0.2,
                        }}
                    />
                </Text>

                <Reward image={image} name={name} value={FAUCET_REWARD.value} icon={icon} />

                <Flex mt={6} flexDir="column" justifyContent="center" alignItems="center">
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
