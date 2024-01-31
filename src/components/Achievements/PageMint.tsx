import { Stack, Flex, Button, Center, Text, Box, Image } from '@chakra-ui/react';
import { useEffect } from 'react';
import { canMintPage } from '../../blockchain/auxiliary/generics/canMintPage';
import { PAGE_HEADERS } from '../../services/achievements';
import { BsGem } from 'react-icons/bs';
import { Interactor } from './Interactor';

export const PageMint = ({ index, page, goBack }) => {
    // Init
    useEffect(() => {
        console.log(index + 1);
        init();
    }, []);

    const init = async () => {
        const result = await canMintPage(index + 1);
    };

    return (
        <Box height="100%" position="relative">
            <Flex position="absolute" top={0} left={0} py={1.5} alignItems="flex-start">
                <Button colorScheme="blue" onClick={goBack}>
                    Go back
                </Button>
            </Flex>

            <Stack spacing={5} height="100%" py={12} alignItems="center" justifyContent="center">
                <Stack spacing={1.5} alignItems="center" mb="-2.5px">
                    <Text layerStyle="header2" lineHeight="16px">
                        {PAGE_HEADERS[index].title}
                    </Text>

                    <Stack direction="row" alignItems="center">
                        <Box color={`blizzard${page.rarity}`} pt="2px">
                            <BsGem fontSize="21px" />
                        </Box>

                        <Text as="span" color={`blizzard${page.rarity}`} fontWeight={500}>
                            {page.rarity}
                        </Text>
                    </Stack>
                </Stack>

                <Image src={PAGE_HEADERS[index].image} height="80%" boxShadow="0 0 3px #00000038" alt="Page" />

                <Interactor index={index} />
            </Stack>
        </Box>
    );
};
