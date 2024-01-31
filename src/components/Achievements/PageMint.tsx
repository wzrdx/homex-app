import { Stack, Flex, Button, Center, Text } from '@chakra-ui/react';
import { GiLockedChest } from 'react-icons/gi';
import { LiaScrollSolid, LiaCalendarCheck } from 'react-icons/lia';
import { VscTools } from 'react-icons/vsc';
import { IconWithShadow } from '../../shared/IconWithShadow';
import { useEffect } from 'react';
import { canMintPage } from '../../blockchain/auxiliary/generics/canMintPage';

export const PageMint = ({ pageIndex, page, goBack }) => {
    // Init
    useEffect(() => {
        console.log(pageIndex + 1);
        init();
    }, []);

    const init = async () => {
        const result = await canMintPage(pageIndex + 1);
        console.log(result);
    };

    return (
        <Stack height="100%" position="relative">
            <Flex position="absolute" top={0} left={0} py={1.5} alignItems="flex-start">
                <Button colorScheme="green" onClick={goBack}>
                    Go back
                </Button>
            </Flex>

            <Flex height="100%" justifyContent="center" alignItems="center">
                <Stack spacing={8} justifyContent="center" maxW="600px">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <LiaScrollSolid fontSize="49px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Unlocking all the Badges within a page allows a{' '}
                            <Text as="span" color="logHighlight" fontWeight={500}>
                                one time
                            </Text>{' '}
                            mint
                            <br />
                            of a collectible{' '}
                            <Text as="span" color="page" fontWeight={500}>
                                Traveler's Log Page
                            </Text>{' '}
                            Semi-Fungible Token.
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <GiLockedChest fontSize="40px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Each{' '}
                            <Text as="span" color="page" fontWeight={500}>
                                Traveler's Log Page
                            </Text>{' '}
                            has a different rarity.
                            <br />
                            The{' '}
                            <Text as="span" fontWeight={500}>
                                {page.title}
                            </Text>{' '}
                            Page is{' '}
                            <Text as="span" color={`blizzard${page.rarity}`} fontWeight={500}>
                                {page.rarity}
                            </Text>
                            .
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <VscTools fontSize="42px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Pages will be vital for{' '}
                            <Text as="span" color="logHighlight" fontWeight={500}>
                                Staking
                            </Text>
                            {', '}
                            Maze token farming,
                            <br />
                            and will play a pivotal role in the upcoming system & updates.
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <LiaCalendarCheck fontSize="48px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Minting of{' '}
                            <Text as="span" color="page" fontWeight={500}>
                                Traveler's Log Pages
                            </Text>{' '}
                            will become available in{' '}
                            <Text as="span" fontWeight={500}>
                                January 2024
                            </Text>
                            . Certain conditions may apply.
                        </Text>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
};
