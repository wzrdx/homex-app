import _ from 'lodash';
import { Box, Button, Center, Flex, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { getAlternateBackground } from '../../services/assets';
import { LuSwords } from 'react-icons/lu';
import { RxDashboard } from 'react-icons/rx';
import { IoMdStats } from 'react-icons/io';
import { IconWithShadow } from '../../shared/IconWithShadow';
import { LiaScrollSolid, LiaCalendarCheck } from 'react-icons/lia';
import { getBackgroundStyle } from '../../services/helpers';
import { GiLockedChest } from 'react-icons/gi';
import { VscTools } from 'react-icons/vsc';
import { PAGE_HEADERS } from '../../services/achievements';
import { NewSymbol } from '../../shared/NewSymbol';
import { LogTutorial } from './LogTutorial';
import { Page } from './Page';
import { differenceInDays } from 'date-fns';
import { BsGem } from 'react-icons/bs';
import { Summary } from './Summary';

enum View {
    Page = 'Page',
    Tutorial = 'Tutorial',
    Mint = 'Mint',
    Summary = 'Summary',
}

const OFFSET = 0.5;
const BORDER_RADIUS = '16px';

function Log() {
    const [currentPage, setCurrentPage] = useState<number>(-1);
    const [view, setView] = useState<View>(View.Summary);

    const getTotalPagesMinted = () => {
        return (
            <Text fontWeight={500} color="page" letterSpacing="1px" fontSize="17px" lineHeight="17px">
                0
                <Text as="span" mx={0.5}>
                    /
                </Text>
                {PAGE_HEADERS.length}
            </Text>
        );
    };

    const getView = (): JSX.Element => {
        switch (view) {
            case View.Mint:
                return <PageMint pageIndex={currentPage} page={PAGE_HEADERS[currentPage]} goBack={() => setView(View.Page)} />;

            case View.Tutorial:
                return <LogTutorial goBack={() => setView(View.Page)} />;

            case View.Summary:
                return <Summary />;

            case View.Page:
                return <Page index={currentPage} toggleMint={() => setView(View.Mint)} />;

            default:
                return <></>;
        }
    };

    return (
        <Box position="relative">
            <Flex
                position="relative"
                width={{ md: '1240px', lg: '1260px', xl: '1486px' }}
                minH={{ md: '636px', lg: '768px', xl: '844px' }}
                alignItems="stretch"
                backgroundColor="#2b2b2b"
                borderRadius={BORDER_RADIUS}
                overflow="hidden"
                zIndex={2}
            >
                {/* Left */}
                <Stack
                    flex={2}
                    spacing={{ md: 8, lg: 10 }}
                    py={{ md: 6, lg: 8 }}
                    px={{ md: 8, lg: 10 }}
                    backgroundColor="#00000020"
                    borderRight="1px solid #ffffff0d"
                >
                    <Stack spacing={4} alignItems="center">
                        <Stack spacing={2} direction="row" alignItems="center">
                            <IconWithShadow shadowColor="#222">
                                <LuSwords fontSize="22px" />
                            </IconWithShadow>

                            <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                Traveler's Log
                            </Text>
                        </Stack>

                        <Stack spacing={2.5} direction="row" alignItems="stretch">
                            <Box color="page" m="-5px">
                                <IconWithShadow shadowColor="#222">
                                    <LiaScrollSolid fontSize="46px" />
                                </IconWithShadow>
                            </Box>

                            <Stack spacing={0} justifyContent="space-between">
                                {getTotalPagesMinted()}
                                <Text fontWeight={500} fontSize="15px" lineHeight="15px">
                                    Minted
                                </Text>
                            </Stack>
                        </Stack>

                        <Center pt={1}>
                            <Button colorScheme="orange" size="sm" onClick={() => setView(View.Tutorial)}>
                                How does it work?
                            </Button>
                        </Center>
                    </Stack>

                    <Stack spacing={5}>
                        <Stack spacing={3}>
                            <Stack spacing={1.5} direction="row" alignItems="center">
                                <Center width="26px">
                                    <IconWithShadow shadowColor="#222">
                                        <RxDashboard fontSize="22px" />
                                    </IconWithShadow>
                                </Center>

                                <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                    Progress
                                </Text>
                            </Stack>

                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                borderRadius="16px"
                                px={4}
                                py={3}
                                backgroundColor={view === View.Summary ? '#ffffff10' : 'transparent'}
                                cursor="pointer"
                                transition="all 0.1s cubic-bezier(0.21, 0.6, 0.35, 1)"
                                _hover={{ backgroundColor: view === View.Summary ? '#ffffff10' : '#ffffff10' }}
                                onClick={() => {
                                    setCurrentPage(-1);
                                    setView(View.Summary);
                                }}
                            >
                                <Stack direction="row" spacing={3}>
                                    <Center width="22px">
                                        <Box color="white" pb="2px">
                                            <IoMdStats fontSize="21px" />
                                        </Box>
                                    </Center>
                                    <Text fontWeight={500} textShadow="1px 1px 0px #222">
                                        Summary
                                    </Text>
                                </Stack>
                            </Flex>
                        </Stack>

                        <Stack spacing={3}>
                            <Stack spacing={1.5} direction="row" alignItems="center">
                                <Center width="26px">
                                    <IconWithShadow shadowColor="#222">
                                        <LiaScrollSolid fontSize="23px" />
                                    </IconWithShadow>
                                </Center>

                                <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                    Pages
                                </Text>
                            </Stack>

                            <Stack spacing={1}>
                                {PAGE_HEADERS.map((header, index) => (
                                    <Box key={index}>
                                        <MenuItem
                                            title={header.title}
                                            rarity={header.rarity}
                                            isNew={differenceInDays(new Date(), header.dateAdded) <= 7}
                                            isActive={index === currentPage}
                                            onClick={() => {
                                                setView(View.Page);
                                                setCurrentPage(index);
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Right */}
                <Box flex={7} position="relative" py={{ md: 6, lg: 8 }} px={{ md: 8, lg: 10 }}>
                    {getView()}

                    {/* Background */}
                    <Flex
                        layerStyle="absoluteCentered"
                        mt="0 !important"
                        filter="saturate(0) opacity(0.15) brightness(0.8)"
                        mixBlendMode="exclusion"
                        style={getBackgroundStyle(getAlternateBackground())}
                        pointerEvents="none"
                        userSelect="none"
                    ></Flex>
                </Box>
            </Flex>

            {/* Shadow */}
            <Box
                position="absolute"
                top={OFFSET}
                right={-OFFSET}
                bottom={-OFFSET}
                left={OFFSET}
                backgroundColor="#111"
                borderRadius={BORDER_RADIUS}
                zIndex={1}
            ></Box>
        </Box>
    );
}

export default Log;

const MenuItem = ({ title, rarity, isNew, isActive, onClick }) => {
    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            borderRadius="16px"
            px={4}
            py={3}
            backgroundColor={isActive ? '#ffffff10' : 'transparent'}
            cursor="pointer"
            transition="all 0.1s cubic-bezier(0.21, 0.6, 0.35, 1)"
            _hover={{ backgroundColor: isActive ? '#ffffff10' : '#ffffff10' }}
            onClick={onClick}
        >
            <Stack direction="row" spacing={3}>
                <Center width="22px">
                    <Box color={`blizzard${rarity}`} pt="2px">
                        <BsGem fontSize="21px" />
                    </Box>
                </Center>
                <Text fontWeight={500} textShadow="1px 1px 0px #222">
                    {title}
                </Text>
            </Stack>

            <NewSymbol isVisible={isNew} />
        </Flex>
    );
};

const PageMint = ({ pageIndex, page, goBack }) => {
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
