import _ from 'lodash';
import {
    Box,
    Flex,
    Spinner,
    Text,
    Image,
    ModalFooter,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    useDisclosure,
    ModalHeader,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { WarningIcon } from '@chakra-ui/icons';
import { BattleParticipant } from '../../blockchain/types';
import { getFullTicket } from '../../services/assets';
import { pairwise, getUsername } from '../../services/helpers';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import Separator from '../../shared/Separator';
import { useSection } from '../Section';
import { addDays, format, isAfter } from 'date-fns';
import { useRewardsContext, RewardsContextType, Competition } from '../../services/rewards';
import { getBattleSubmittedTickets } from '../../blockchain/api/getBattleSubmittedTickets';
import { getBattleParticipants } from '../../blockchain/api/getBattleParticipants';
import { getBattleParticipantsCount } from '../../blockchain/api/getBattleParticipantsCount';
// import Banner_1 from '../../assets/images/banner_l.jpg';
// import Banner_2 from '../../assets/images/banner_r.jpg';

const COLUMNS = [
    {
        name: 'Rank',
        width: '84px',
        align: 'left',
    },
    {
        name: 'Player',
        width: '250px',
        align: 'left',
    },
    {
        name: 'Tickets',
        width: '118px',
        align: 'left',
    },
    {
        name: 'Quests',
        width: '68px',
        align: 'left',
    },
];

const isSponsored = true;

function Leaderboard() {
    const { height } = useSection();
    const { isOpen: isPotOpen, onOpen: onPotOpen, onClose: onPotClose } = useDisclosure();

    const [battle, setBattle] = useState<Competition>();
    const [participants, setParticipants] = useState<BattleParticipant[]>();
    const [myTickets, setMyTickets] = useState<number>();

    const [error, setError] = useState<boolean>(false);

    const { battles } = useRewardsContext() as RewardsContextType;

    useEffect(() => {
        // Displays the most recent battle
        setBattle(_(battles).orderBy('timestamp', 'desc').first());
    }, [battles]);

    useEffect(() => {
        init();
    }, [battle]);

    const init = async () => {
        console.log(addDays(new Date(), 40));

        if (!battle) {
            return;
        }

        try {
            setMyTickets(await getBattleSubmittedTickets(battle.id));

            const count: number = await getBattleParticipantsCount(battle.id);
            const chunks = new Array(Math.floor(count / 100)).fill(100).concat(count % 100);

            const apiCalls: Array<Promise<BattleParticipant[]>> = [];

            pairwise(
                _(chunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 100 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (current: number, next: number) => {
                    apiCalls.push(getBattleParticipants(battle.id, current, next));
                }
            );

            const result = await Promise.all(apiCalls);
            parse(_.flatten(result));
        } catch (error) {
            console.error(error);
            setError(true);
            setParticipants([]);
        }
    };

    const parse = async (users: BattleParticipant[]) => {
        const sorted = _.orderBy(users, ['ticketsCount', 'quests'], ['desc', 'desc']);
        const parsed = await Promise.all(
            _(sorted)
                .map(async (earner, index) => ({
                    ...earner,
                    username: await getUsername(earner.address),
                }))
                .value()
        );

        setParticipants(parsed);
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} flexDir="column" alignItems="center">
            <Flex mb={6} justifyContent="center" alignItems="center">
                {/* <Flex
                    mr={2}
                    alignItems="center"
                    padding="7px 16px"
                    borderRadius="9999px"
                    backgroundColor="#3c180d"
                    cursor="pointer"
                    transition="all 0.15s cubic-bezier(0.215, 0.610, 0.355, 1)"
                    _hover={{ backgroundColor: '#4d1e0e' }}
                    onClick={onPotOpen}
                >
                    <AiOutlineEye fontSize="20px" color="rgb(249 115 22)" />
                    <Text ml={2} color="white">
                        Prize Pool
                    </Text>
                </Flex> */}

                <Text as="span" fontWeight={500} mx={1.5}>
                    10 Winners
                </Text>

                <Box mx={1.5} opacity="0.9">
                    <Separator type="vertical" width="1px" height="34px" />
                </Box>

                <Flex mx={2} justifyContent="center" alignItems="center">
                    <Text mr={1}>
                        Total:{' '}
                        <Text as="span" fontWeight={500} mx={0.5}>
                            {battle?.tickets}
                        </Text>
                    </Text>
                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                </Flex>

                <Box mx={1.5} opacity="0.9">
                    <Separator type="vertical" width="1px" height="34px" />
                </Box>

                <Flex mx={2} justifyContent="center" alignItems="center">
                    <Text mr={1}>
                        Your submission:{' '}
                        <Text as="span" fontWeight={500} mx={0.5}>
                            {myTickets}
                        </Text>
                    </Text>
                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                </Flex>

                {battle && isAfter(battle.timestamp, new Date()) && (
                    <>
                        <Box mx={1.5} opacity="0.9">
                            <Separator type="vertical" width="1px" height="34px" />
                        </Box>

                        <Flex mx={2} justifyContent="center" alignItems="center">
                            <Text mr={2}>{`Ends on ${format(battle.timestamp, 'PPpp')}`}</Text>
                        </Flex>
                    </>
                )}
            </Flex>

            {!participants ? (
                <Spinner mt={3} size="sm" />
            ) : !!error ? (
                <Flex alignItems="center">
                    <WarningIcon boxSize={4} color="redClrs" />
                    <Text ml={2}>Unable to fetch leaderboard</Text>
                </Flex>
            ) : (
                <Flex
                    layerStyle="layout"
                    justifyContent={isSponsored ? 'space-between' : 'center'}
                    overflowY="auto"
                    overflowX="hidden"
                >
                    {/* <Image height={{ md: '430px', lg: '560px' }} src={Banner_1} /> */}

                    <Flex px={8} flexDir="column" overflowY="auto" overflowX="hidden" mr={_.size(participants) > 12 ? 8 : 0}>
                        {!participants?.length ? (
                            <Flex flexDir="column" justifyContent="center" alignItems="center">
                                <Image my={2} height="256px" src={getFullTicket()} />

                                <Flex mt={5} maxWidth="464px" flexDir="column" justifyContent="center" alignItems="center">
                                    <Text>No traveler has entered the Battle yet.</Text>
                                    <Text>
                                        Become the first one by submitting a{' '}
                                        <Text as="span" color="ticketGold">
                                            Golden Ticket
                                        </Text>
                                        .
                                    </Text>
                                </Flex>
                            </Flex>
                        ) : (
                            <Flex mb={1}>
                                {_.map(COLUMNS, (column: any, index: number) => (
                                    <Text key={index} layerStyle="header2" minWidth={column.width} textAlign={column.align}>
                                        {column.name}
                                    </Text>
                                ))}
                            </Flex>
                        )}

                        {_.map(participants, (participant: BattleParticipant, index: number) => (
                            <Flex mt={2} alignItems="center" key={index}>
                                <Text minWidth={COLUMNS[0].width}>{index + 1}</Text>

                                <Text pr={6} layerStyle="ellipsis" width={COLUMNS[1].width}>
                                    {participant.username}
                                </Text>

                                <Flex minWidth={COLUMNS[2].width}>
                                    <Text minWidth="28px">{participant.ticketsCount}</Text>
                                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                                </Flex>

                                <Text width={COLUMNS[3].width}>{participant.quests}</Text>
                            </Flex>
                        ))}
                    </Flex>

                    {/* <Image height={{ md: '430px', lg: '560px' }} src={Banner_2} /> */}
                </Flex>
            )}

            {/* Pot */}
            <Modal size="xl" onClose={onPotClose} isOpen={isPotOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Battle Prize Pool</ModalHeader>

                    <ModalCloseButton
                        zIndex={1}
                        color="white"
                        _focusVisible={{ boxShadow: '0 0 transparent' }}
                        borderRadius="3px"
                    />
                    <ModalBody>
                        <Flex flexDir="column">
                            <Text
                                mb={1.5}
                                color="brightWheat"
                                textTransform="uppercase"
                                fontWeight={600}
                                fontSize="18px"
                                letterSpacing="0.75px"
                            >
                                Total value
                            </Text>

                            <Text fontWeight={500}>60 $EGLD</Text>

                            <Text
                                mt={5}
                                mb={1.5}
                                color="brightWheat"
                                textTransform="uppercase"
                                fontWeight={600}
                                fontSize="18px"
                                letterSpacing="0.75px"
                            >
                                Prizes
                            </Text>

                            <Text fontWeight={500}>5 EXO Tickets</Text>

                            <Flex mt={2.5}>
                                <Alert status="info" width="auto">
                                    <AlertIcon />
                                    The rest of the prizes will be announced soon
                                </Alert>
                            </Flex>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onPotClose} colorScheme="red">
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Leaderboard;
