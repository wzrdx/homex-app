import { Stack, Flex, Button, Center, Text, Box, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { canMintPage } from '../../blockchain/auxiliary/generics/canMintPage';
import { PAGE_HEADERS } from '../../services/achievements';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import { useStoreContext, StoreContextType } from '../../services/store';
import { InfoIcon } from '@chakra-ui/icons';

export const Interactor = ({ index }) => {
    const { stakingInfo } = useStoreContext() as StoreContextType;

    const [isLoading, setLoading] = useState<boolean>(false);
    const [canMint, setCanMint] = useState<boolean>(false);
    const [isStaked, setIsStaked] = useState<boolean>(false);

    // Init
    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (stakingInfo && stakingInfo.isStaked) {
            setIsStaked(true);
        }
    }, [stakingInfo]);

    const init = async () => {
        if (PAGE_HEADERS[index].requiresVerification) {
            setCanMint(await canMintPage(index + 1));
        }

        setLoading(false);
    };

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
                <Button colorScheme="green">Verify page</Button>
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
