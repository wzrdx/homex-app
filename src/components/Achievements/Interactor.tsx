import { Stack, Flex, Button, Center, Text, Box, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { canMintPage } from '../../blockchain/auxiliary/generics/canMintPage';
import { PAGE_HEADERS } from '../../services/achievements';
import { getPageMintingCost } from '../../services/helpers';

export const Interactor = ({ index }) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [canMint, setCanMint] = useState<boolean>(false);

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        if (PAGE_HEADERS[index].requiresVerification) {
            setCanMint(await canMintPage(index + 1));
        }

        setLoading(false);
    };

    const getMintingView = () => (
        <Stack alignItems="center">
            <Text>{getPageMintingCost(PAGE_HEADERS[index].rarity)}</Text>
            <Button colorScheme="orange">Mint page</Button>
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
