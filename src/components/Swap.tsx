import { Box, Flex, IconButton, Image, Input, InputGroup, Link, Text } from '@chakra-ui/react';
import { ResourcesContextType, getResourceElements, useResourcesContext } from '../services/resources';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useState } from 'react';
import { EGLD_DENOMINATION, ENERGY_SWAP_RATE, ENERGY_TOKEN_ID } from '../blockchain/config';
import { round } from '../services/helpers';
import { ArrowDownIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { getMvxLogo } from '../services/assets';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import {
    TransactionType,
    TransactionsContextType,
    TxResolution,
    useTransactionsContext,
} from '../services/transactions';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';

function Swap() {
    const { resources } = useResourcesContext() as ResourcesContextType;
    const { account } = useGetAccountInfo();
    const { icon } = getResourceElements('energy');

    const [energyValue, setEnergyValue] = useState('');
    const [egldValue, setEgldValue] = useState('');
    const [isButtonLoading, setButtonLoading] = useState(false);

    const { address } = useGetAccountInfo();
    const { setPendingTxs, isTxPending } = useTransactionsContext() as TransactionsContextType;

    // Init
    useEffect(() => {}, []);

    const onEnergyInputChange = (value) => {
        if (value === '') {
            setEnergyValue('');
            setEgldValue('');
            return;
        }

        value = Number.parseFloat(value);

        if (!isNaN(value)) {
            setEnergyValue(value);
            setEgldValue(round(value * ENERGY_SWAP_RATE, 3).toString());
        }
    };

    const onEgldInputChange = (value) => {
        if (value === '') {
            setEnergyValue('');
            setEgldValue('');
            return;
        }

        value = Number.parseFloat(value);

        if (!isNaN(value)) {
            setEnergyValue(round(value / ENERGY_SWAP_RATE, 3).toString());
            setEgldValue(value);
        }
    };

    const swap = async () => {
        if (!energyValue) {
            return;
        }

        setButtonLoading(true);

        const user = new Address(address);
        const amount = Number.parseFloat(energyValue);

        try {
            const tx = smartContract.methods
                .swapEnergy()
                .withSingleESDTTransfer(TokenTransfer.fungibleFromAmount(ENERGY_TOKEN_ID, amount, 6))
                .withSender(user)
                .withChainID('D')
                .withGasLimit(6000000)
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

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.Swap,
                    resolution: TxResolution.UpdateEnergy,
                },
            ]);

            setButtonLoading(false);
        } catch (err) {
            console.error('Error occured while staking', err);
        }
    };

    return (
        <Flex flexDir="column" justifyContent="center" alignItems="center">
            <Flex width="400px" flexDir="column" backgroundColor="#2c2d2f" overflow="hidden" borderRadius="3px">
                <Box width="100%" height="5px" backgroundColor="resources.energy"></Box>

                <Flex flexDir="column" my={6} px={7}>
                    <Flex mb={1.5} alignItems="center" justifyContent="space-between">
                        <Text fontSize="15px" color="whiteAlpha.700">
                            Swap From:
                        </Text>
                        <Text fontSize="15px" color="whiteAlpha.700">
                            Balance:{' '}
                            <Text
                                onClick={() => onEnergyInputChange(resources.energy)}
                                cursor="pointer"
                                as="span"
                                color="whitesmoke"
                            >{`${resources.energy} ENERGY`}</Text>
                        </Text>
                    </Flex>

                    <Box position="relative">
                        <InputGroup>
                            <Input
                                size="lg"
                                variant="filled"
                                bg="black.100"
                                placeholder="0.0"
                                type="number"
                                value={energyValue}
                                onChange={(e) => {
                                    onEnergyInputChange(e.target.value);
                                }}
                            />

                            <Flex px={3} position="absolute" top={1} right={1} bottom={1}>
                                <Flex alignItems="center">
                                    <Image width="26px" height="26px" mr={1.5} src={icon} alt="Energy" />
                                    <Text>ENERGY</Text>
                                </Flex>
                            </Flex>
                        </InputGroup>
                    </Box>

                    <Flex my={4} width="100%" justifyContent="center" alignItems="center">
                        <IconButton
                            borderRadius="50%"
                            aria-label="swap"
                            size="sm"
                            icon={<ArrowDownIcon fontSize="18px" />}
                        />
                    </Flex>

                    <Flex mb={1.5} alignItems="center" justifyContent="space-between">
                        <Text fontSize="15px" color="whiteAlpha.700">
                            Swap To:
                        </Text>
                        <Text fontSize="15px" color="whiteAlpha.700">
                            Balance:{' '}
                            <Text as="span" color="whitesmoke">{`${round(
                                Number.parseInt(account?.balance) / EGLD_DENOMINATION,
                                6
                            )} EGLD`}</Text>
                        </Text>
                    </Flex>

                    <Box position="relative">
                        <InputGroup>
                            <Input
                                size="lg"
                                variant="filled"
                                bg="black.100"
                                placeholder="0.0"
                                type="number"
                                value={egldValue}
                                onChange={(e) => {
                                    onEgldInputChange(e.target.value);
                                }}
                            />

                            <Flex px={3} position="absolute" top={1} right={1} bottom={1}>
                                <Flex alignItems="center">
                                    <Image
                                        borderRadius="50%"
                                        width="28px"
                                        height="28px"
                                        mr={1.5}
                                        src={getMvxLogo()}
                                        alt="MultiversX"
                                        border="1px solid #474747"
                                    />
                                    <Text>EGLD</Text>
                                </Flex>
                            </Flex>
                        </InputGroup>
                    </Box>

                    <Flex mt={4} flexDir="column" borderRadius="6px" py={4}>
                        <Flex alignItems="center" justifyContent="space-between">
                            <Flex alignItems="center">
                                <InfoOutlineIcon mr={1.5} color="whiteAlpha.700" />
                                <Text fontSize="15px" color="whiteAlpha.700">
                                    Exchange Rate
                                </Text>
                            </Flex>
                            <Text fontSize="15px" color="whitesmoke">{`1 ENERGY ≃ ${ENERGY_SWAP_RATE} EGLD`}</Text>
                        </Flex>
                    </Flex>

                    <Box mt={4}>
                        <ActionButton
                            isLoading={isButtonLoading || isTxPending(TransactionType.Swap)}
                            disabled={!energyValue}
                            colorScheme="blue"
                            customStyle={{ width: '100%' }}
                            onClick={swap}
                        >
                            <Text>Swap</Text>
                        </ActionButton>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Swap;
