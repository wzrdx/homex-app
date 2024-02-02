import { Stack, Flex, Button, Center, Text, Box, Image, Spinner, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { canMintPage } from '../../blockchain/auxiliary/api/canMintPage';
import { PAGE_HEADERS } from '../../services/achievements';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import { useStoreContext, StoreContextType } from '../../services/store';
import { InfoIcon } from '@chakra-ui/icons';
import { verifyPage } from '../../services/api';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useMutation } from 'react-query';

export const Interactor = ({ index }) => {
    const toast = useToast();

    const { address } = useGetAccountInfo();
    const { stakingInfo } = useStoreContext() as StoreContextType;

    const [isLoading, setLoading] = useState<boolean>(true);
    const [canMint, setCanMint] = useState<boolean>();
    const [isStaked, setIsStaked] = useState<boolean>(false);

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
            value = await canMintPage(index + 1);
        }

        setCanMint(value);
    };

    const verify = useMutation(() => verifyPage(address, index + 1), {
        onSuccess: async (data) => {
            console.log('Response:', data);
            setCanMint(await canMintPage(index + 1));
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

    const getMintingView = () =>
        isStaked ? (
            <Stack spacing={4} alignItems="center">
                <Center>
                    <Text>Price:</Text>
                    <Text mx={1.5} fontWeight={500} color="ticketGold">
                        3
                    </Text>
                    <Image width="22px" src={RESOURCE_ELEMENTS['tickets'].icon} alt="Resource" />
                </Center>

                <Button colorScheme="orange">Mint page</Button>
            </Stack>
        ) : (
            <Stack direction="row" spacing={1.5} alignItems="center">
                <InfoIcon color="redClrs" />

                <Text textShadow="1px 1px 0px #222" color="redClrs">
                    You must be staked to mint
                </Text>
            </Stack>
        );

    const getVerificationView = () => (
        <Stack alignItems="center">
            <Flex>
                <Button colorScheme="green" onClick={() => verify.mutate()} isLoading={verify.isLoading}>
                    Verify page
                </Button>
            </Flex>

            <Text fontSize="15px" textShadow="1px 1px 0px #222" color="#cbcbcb">
                Verification required before minting
            </Text>
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
