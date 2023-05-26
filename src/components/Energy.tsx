import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { Address } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { getAddress, refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import {
    useTransactionsContext,
    TransactionsContextType,
    TransactionType,
    TxResolution,
} from '../services/transactions';
import { TimeIcon } from '@chakra-ui/icons';
import { getResourceElements } from '../services/resources';
import Typewriter from 'typewriter-effect';
import Reward from '../shared/Reward';
import { getFaucetImage } from '../services/assets';
import { useLayout } from './Layout';

export const FAUCET_REWARD = {
    resource: 'energy',
    name: 'Focus',
    value: 10,
};

function Energy() {
    const { checkEgldBalance } = useLayout();
    const [isEnergyButtonLoading, setEnergyButtonLoading] = useState(false);

    const { setPendingTxs, isFaucetTxPending } = useTransactionsContext() as TransactionsContextType;
    const { name, icon, image } = getResourceElements('energy');

    const faucet = async () => {
        setEnergyButtonLoading(true);

        if (!(await checkEgldBalance())) {
            setEnergyButtonLoading(false);
            return;
        }

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

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.Faucet,
                    resolution: TxResolution.UpdateEnergy,
                },
            ]);
        } catch (err) {
            console.error('Error occured while calling faucet', err);
        }
    };

    return (
        <Flex height="100%" justifyContent="center" alignItems="center">
            <Flex flexDir="column" justifyContent="center" alignItems="center">
                <Flex alignItems="flex-start" mb={{ md: 6, lg: 8 }}>
                    <Flex mr={3} width={{ md: 'auto', lg: '600px' }} justifyContent="flex-end">
                        <Image
                            width={{ md: '326px', lg: '435px' }}
                            src={getFaucetImage()}
                            alt="Energy"
                            borderRadius="1px"
                            border="2px solid #fdefce36"
                        />
                    </Flex>

                    <Flex ml={3} width={{ md: '604px', lg: '600px' }}>
                        <Text layerStyle="questDescription" width={{ md: '604px', lg: '472px' }}>
                            {/* The planet's frequency was not limitless, and soon the Founders realized they needed to find
                            more sources of Energy to sustain their growing needs. That was how the guild of Energy
                            seekers came to be: brave and curious souls who ventured into the unknown corners of the
                            planet, seeking out its mysteries and secrets, and unlocking new wells of Energy. They
                            learned a special Ritual that allowed them to draw a small amount of Energy from the planet
                            itself. The stronger the First Travelers were, the more Energy they could extract. And now,
                            you are part of it. You are a First Traveler, one of the chosen few who can access the
                            Energy of the planet and use it for your own ends. But you are not alone. There are others
                            like you, and they may not share your vision or your values. You will have to compete with
                            them for the scarce and precious Energy that sustains your civilization. Whenever you need
                            to perform the Ritual, you can return to the Dome, the sacred place where it all began.
                            Remember that Energy is not only a tool for your quests, but also a precious commodity for
                            trade and a vital ingredient for your travels. */}

                            <Typewriter
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString(
                                            "The planet's frequency was not limitless, and soon the Founders realized they needed to find more sources of Energy to sustain their growing needs. That was how the guild of Energy seekers came to be: brave and curious souls who ventured into the unknown corners of the planet, seeking out its mysteries and secrets, and unlocking new wells of Energy. They learned a special Ritual that allowed them to draw a small amount of Energy from the planet itself. The stronger the First Travelers were, the more Energy they could extract. And now, you are part of it. You are a First Traveler, one of the chosen few who can access the Energy of the planet and use it for your own ends. But you are not alone. There are others like you, and they may not share your vision or your values. You will have to compete with them for the scarce and precious Energy that sustains your civilization. Whenever you need to perform the Ritual, you can return to the Dome, the sacred place where it all began. Remember that Energy is not only a tool for your quests, but also a precious commodity for trade and a vital ingredient for your travels."
                                        )
                                        .start();
                                }}
                                options={{
                                    delay: 0.2,
                                }}
                            />
                        </Text>
                    </Flex>
                </Flex>

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
