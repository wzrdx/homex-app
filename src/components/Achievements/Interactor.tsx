import { Stack, Flex, Button, Center, Text, Box, Image, Spinner, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { canMintPage } from '../../blockchain/auxiliary/api/canMintPage';
import { PAGE_HEADERS } from '../../services/achievements';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../../services/resources';
import { useStoreContext, StoreContextType } from '../../services/store';
import { InfoIcon } from '@chakra-ui/icons';
import { verifyPage } from '../../services/api';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useMutation } from 'react-query';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { TICKETS_TOKEN_ID, CHAIN_ID, TRAVELERS_COLLECTION_ID, ELDERS_COLLECTION_ID } from '../../blockchain/config';
import { smartContract } from '../../blockchain/auxiliary/smartContract';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../../services/transactions';
import { useAuthenticationContext, AuthenticationContextType } from '../../services/authentication';
import { LEVELS } from '../../services/xp';
import _ from 'lodash';

export const Interactor = ({ index }) => {
    const toast = useToast();

    const { address } = useGetAccountInfo();
    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { resources } = useResourcesContext() as ResourcesContextType;

    const { setPendingTxs, isMintPageTxPending } = useTransactionsContext() as TransactionsContextType;

    const [isLoading, setLoading] = useState<boolean>(true);
    const [canMint, setCanMint] = useState<boolean>();
    const [isStaked, setIsStaked] = useState<boolean>(false);

    const [isMintingLoading, setMintingLoading] = useState<boolean>();

    const { xp } = useAuthenticationContext() as AuthenticationContextType;

    // Init
    useEffect(() => {
        init();
    }, []);

    // Staking
    useEffect(() => {
        if (stakingInfo && stakingInfo.isStaked) {
            setIsStaked(true);
        }
    }, [stakingInfo]);

    // Minting condition
    useEffect(() => {
        if (typeof canMint === 'boolean') {
            setLoading(false);
        }
    }, [canMint]);

    const init = async () => {
        // Checks if a verification is required and calls 'setCanMint' either way in order to stop loading
        let value = true;

        if (PAGE_HEADERS[index].requiresVerification) {
            value = await canMintPage(index);
        }

        setCanMint(value);
    };

    const verify = useMutation(() => verifyPage(address, index), {
        onSuccess: async (response) => {
            if (response.status === 200) {
                setCanMint(await canMintPage(index));

                toast({
                    title: `${PAGE_HEADERS[index].title} verified successfully!`,
                    status: 'success',
                    variant: 'left-accent',
                    position: 'top',
                    isClosable: true,
                    containerStyle: {
                        marginTop: '1.25rem',
                    },
                });
            }
        },
        onError: (error: any) => {
            console.error(error.response.data);

            toast({
                title: error.response.data,
                status: 'error',
                variant: 'left-accent',
                position: 'top',
                isClosable: true,
                containerStyle: {
                    marginTop: '1.25rem',
                },
            });
        },
    });

    const mintPage = async () => {
        if (!resources.tickets || !canMint || !stakingInfo) {
            return;
        }

        setMintingLoading(true);

        console.log('mintPage', index);

        const user = new Address(address);
        const type = PAGE_HEADERS[index].type;

        let gasLimit: number;

        switch (type) {
            case 'main_staking':
                console.log(
                    _(stakingInfo.tokens)
                        .filter(
                            (token) =>
                                !token.timestamp &&
                                (token.tokenId === TRAVELERS_COLLECTION_ID || token.tokenId === ELDERS_COLLECTION_ID)
                        )
                        .size()
                );

                gasLimit =
                    40000000 +
                    2000000 *
                        _(stakingInfo.tokens)
                            .filter(
                                (token) =>
                                    !token.timestamp &&
                                    (token.tokenId === TRAVELERS_COLLECTION_ID || token.tokenId === ELDERS_COLLECTION_ID)
                            )
                            .size();
                break;

            default:
                gasLimit = 30000000;
        }

        try {
            const tx = smartContract.methods
                .mintPage([index])
                .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(TICKETS_TOKEN_ID, 1, 3))
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(gasLimit)
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

            setMintingLoading(false);

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.MintPage,
                    data: {
                        index,
                        name: PAGE_HEADERS[index].title,
                    },
                    resolution: TxResolution.UpdateTickets,
                },
            ]);
        } catch (err) {
            console.error('Error occured during mintPage', err);
        }
    };

    const getMintingView = () => {
        if (!isStaked) {
            return (
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <InfoIcon color="redClrs" />

                    <Text textShadow="1px 1px 0px #222" color="redClrs">
                        You must be staked to mint
                    </Text>
                </Stack>
            );
        }

        if (xp < LEVELS[29].xp) {
            return (
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <InfoIcon color="mintGreen" />

                    <Text textShadow="1px 1px 0px #222" color="mintGreen">
                        Level 30 is required to mint
                    </Text>
                </Stack>
            );
        }

        return (
            <Stack spacing={4} alignItems="center">
                <Center>
                    <Text>Price:</Text>
                    <Text mx={1.5} fontWeight={500} color="ticketGold">
                        3
                    </Text>
                    <Image width="22px" src={RESOURCE_ELEMENTS['tickets'].icon} alt="Resource" />
                </Center>

                <Button
                    colorScheme="orange"
                    onClick={mintPage}
                    isLoading={isMintingLoading || isMintPageTxPending(TransactionType.MintPage, index)}
                >
                    Mint page
                </Button>
            </Stack>
        );
    };

    const getVerificationView = () => (
        <Stack alignItems="center">
            <Flex>
                <Button colorScheme="green" onClick={() => verify.mutate()} isLoading={verify.isLoading}>
                    Verify page
                </Button>
            </Flex>

            <Stack direction="row" spacing={1.5} alignItems="center">
                <InfoIcon color="#cbcbcb" />

                <Text textShadow="1px 1px 0px #222" color="#cbcbcb">
                    Verification required before minting (off-chain, aprox. 15 seconds)
                </Text>
            </Stack>
        </Stack>
    );

    return (
        <Center>
            {isLoading ? (
                <Spinner />
            ) : PAGE_HEADERS[index].requiresVerification && !canMint ? (
                getVerificationView()
            ) : (
                getMintingView()
            )}
        </Center>
    );
};
