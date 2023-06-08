import _ from 'lodash';
import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { WarningIcon } from '@chakra-ui/icons';
import { getParticipants } from '../../blockchain/api/getParticipants';
import { getParticipantsCount } from '../../blockchain/api/getParticipantsCount';
import { getRafflePot } from '../../blockchain/api/getRafflePot';
import { getRaffleTimestamp } from '../../blockchain/api/getRaffleTimestamp';
import { getSubmittedTickets } from '../../blockchain/api/getSubmittedTickets';
import { getSubmittedTicketsTotal } from '../../blockchain/api/getSubmittedTicketsTotal';
import { Participant } from '../../blockchain/types';
import { getFullTicket } from '../../services/assets';
import { pairwise, getUsername } from '../../services/helpers';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import Separator from '../../shared/Separator';
import { Timer } from '../../shared/Timer';
import { useRewards } from '../Rewards';

const COLUMNS = [
    {
        name: 'Rank',
        width: '88px',
        align: 'left',
    },
    {
        name: 'Player',
        width: '246px',
        align: 'left',
    },
    {
        name: 'Tickets',
        width: '60px',
        align: 'left',
    },
];

function Leaderboard() {
    const { height } = useRewards();

    const [participants, setParticipants] = useState<Participant[]>();
    const [myTickets, setMyTickets] = useState<number>();
    const [totalTickets, setTotalTickets] = useState<number>();
    const [pot, setPot] = useState<number>();
    const [timestamp, setTimestamp] = useState<Date>();
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            setMyTickets(await getSubmittedTickets());
            setTotalTickets(await getSubmittedTicketsTotal());
            setPot(await getRafflePot());
            setTimestamp(await getRaffleTimestamp());

            const count: number = await getParticipantsCount();
            const chunks = new Array(Math.floor(count / 100)).fill(100).concat(count % 100);

            const apiCalls: Array<Promise<Participant[]>> = [];

            pairwise(
                _(chunks)
                    .filter(_.identity)
                    .map((chunk, index) => {
                        return index * 100 + chunk;
                    })
                    .unshift(0)
                    .value(),
                (current: number, next: number) => {
                    apiCalls.push(getParticipants(current, next));
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

    const parse = async (earners: Participant[]) => {
        const sorted = _.orderBy(earners, ['ticketsCount'], ['desc']);
        const parsed = await Promise.all(
            _(sorted)
                .map(async (earner, index) => ({
                    ...earner,
                    username: await getUsername(earner.address),
                }))
                .value()
        );

        // TODO:
        setParticipants([...parsed, ...parsed, ...parsed, ...parsed, ...parsed, ...parsed, ...parsed]);
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} flexDir="column" alignItems="center">
            <Flex mb={6} justifyContent="center" alignItems="center">
                <Flex mx={2} justifyContent="center" alignItems="center">
                    <Text ml={1.5} mr={1}>
                        Prize pot:{' '}
                        <Text as="span" color="ticketGold" fontWeight={500} ml={0.5}>
                            {pot} $EGLD
                        </Text>
                    </Text>
                </Flex>

                <Box mx={2} opacity="0.9">
                    <Separator type="vertical" width="1px" height="34px" />
                </Box>

                <Flex mx={2} justifyContent="center" alignItems="center">
                    <Text ml={1.5} mr={1}>
                        Total entries:{' '}
                        <Text as="span" mx={0.5}>
                            {totalTickets}
                        </Text>
                    </Text>
                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                </Flex>

                <Box mx={2} opacity="0.9">
                    <Separator type="vertical" width="1px" height="34px" />
                </Box>

                <Flex mx={2} justifyContent="center" alignItems="center">
                    <Text ml={1.5} mr={1}>
                        Your submission:{' '}
                        <Text as="span" mx={0.5}>
                            {myTickets}
                        </Text>
                    </Text>
                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                </Flex>

                {!!timestamp && (
                    <>
                        <Box mx={2} opacity="0.9">
                            <Separator type="vertical" width="1px" height="34px" />
                        </Box>

                        <Flex mx={2} justifyContent="center" alignItems="center">
                            <Text ml={1.5} mr={2}>
                                Ends in:
                            </Text>

                            <Flex minWidth="158px">
                                <Timer timestamp={timestamp as Date} isActive isDescending displayDays />
                            </Flex>
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
                <Flex px={4} flexDir="column" overflowY="auto" overflowX="hidden">
                    {/* Header */}
                    {!participants?.length ? (
                        <Flex flexDir="column" justifyContent="center" alignItems="center">
                            <Image my={2} height="256px" src={getFullTicket()} />
                            <Text mt={5} textAlign="center" maxWidth="464px">
                                No traveler has entered the Raffle yet. Become the first one by completing the{' '}
                                <Text as="span" color="brightBlue">
                                    final mission
                                </Text>{' '}
                                and earning a{' '}
                                <Text as="span" color="brightBlue">
                                    Ticket
                                </Text>
                                .
                            </Text>
                        </Flex>
                    ) : (
                        <Flex mb={1}>
                            {_.map(COLUMNS, (column: any, index: number) => (
                                <Text
                                    key={index}
                                    minWidth={column.width}
                                    textAlign={column.align}
                                    fontWeight={600}
                                    fontSize="17px"
                                >
                                    {column.name}
                                </Text>
                            ))}
                        </Flex>
                    )}

                    {_.map(participants, (participant: Participant, index: number) => (
                        <Flex mt={2} alignItems="center" key={index}>
                            <Text minWidth={COLUMNS[0].width}>{index + 1}</Text>

                            <Text pr={6} layerStyle="ellipsis" width={COLUMNS[1].width}>
                                {participant.username}
                            </Text>

                            <Flex minWidth={COLUMNS[2].width}>
                                <Text minWidth="24px">{participant.ticketsCount}</Text>
                                <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            )}
        </Flex>
    );
}

export default Leaderboard;
