import { Stack, Flex, Button, Center, Text, Box, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PAGE_HEADERS } from '../../services/achievements';
import { BsGem } from 'react-icons/bs';
import { Interactor } from './Interactor';
import { isPageMinted } from '../../blockchain/auxiliary/api/isPageMinted';
import { getAOMLogo } from '../../services/assets';

export const PageMint = ({ index, page, goBack }) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isMinted, setPageMinted] = useState<boolean>();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setPageMinted(await isPageMinted(index + 1));
        setLoading(false);
    };

    return (
        <Box height="100%" position="relative">
            <Flex position="absolute" top={0} left={0} py={1.5} alignItems="flex-start">
                <Button colorScheme="blue" onClick={goBack}>
                    Go back
                </Button>
            </Flex>

            {isLoading ? (
                <Spinner />
            ) : (
                <Stack spacing={5} height="100%" py={12} alignItems="center" justifyContent="center">
                    <Stack spacing={2} alignItems="center" mb="-1px">
                        <Text layerStyle="header1Alt" lineHeight="16px">
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

                    <Box position="relative" height="80%">
                        {!!isMinted && (
                            <Center
                                position="absolute"
                                top={0}
                                right={0}
                                bottom={0}
                                left={0}
                                backgroundColor="#00ff206e"
                                zIndex={2}
                            >
                                <Image src={getAOMLogo()} maxW="50%" filter="grayscale(1) brightness(2.5)" alt="AoM" />
                            </Center>
                        )}

                        <Image
                            height="100%"
                            src={PAGE_HEADERS[index].image}
                            outline="2px solid"
                            outlineColor={`blizzard${page.rarity}`}
                            outlineOffset="4px"
                            minW="278px"
                            minH="392px"
                            alt="Page"
                        />
                    </Box>

                    {!isMinted && <Interactor index={index} />}
                </Stack>
            )}
        </Box>
    );
};
