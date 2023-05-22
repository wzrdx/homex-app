import { Box, Flex, Spinner, Text, Image, ResponsiveValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TicketEarner, useGetTicketEarners } from '../blockchain/hooks/useGetTicketEarners';
import _ from 'lodash';
import { getShortAddress, getUsername, zeroPad } from '../services/helpers';
import { Role, RoleTag } from '../shared/RoleTag';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { START_OF_CONTEST } from '../blockchain/config';
import { TimeIcon } from '@chakra-ui/icons';

const COLUMNS = [
    {
        name: 'Rank',
        width: '86px',
        align: 'left',
    },
    {
        name: 'Player',
        width: '162px',
        align: 'left',
    },
    {
        name: 'Tickets',
        width: '116px',
        align: 'left',
    },
    {
        name: 'Role',
        width: '234px',
        align: 'left',
    },
    {
        name: 'Time',
        width: '100px',
        align: 'left',
    },
];

function Leaderboard() {
    const { earners, getTicketEarners } = useGetTicketEarners();

    // Parsed ticket earners
    const [ticketEarners, setTicketEarners] = useState<TicketEarner[]>();

    useEffect(() => {
        getTicketEarners();
    }, []);

    useEffect(() => {
        if (earners) {
            parseEarners();
        }
    }, [earners]);

    const parseEarners = async () => {
        const sorted = _.orderBy(earners, ['ticketsEarned', 'timestamp'], ['desc', 'asc']);

        const parsedEarners = await Promise.all(
            _(sorted)
                .map(async (earner) => ({
                    ...earner,
                    address: await getUsername(earner.address),
                    time: getDuration(earner.timestamp),
                }))
                .value()
        );

        setTicketEarners(parsedEarners);
    };

    const getDuration = (timestamp: Date): string => {
        const difference = differenceInSeconds(timestamp, START_OF_CONTEST);

        if (difference < 0) {
            return '';
        }

        const duration = intervalToDuration({ start: 0, end: difference * 1000 });

        const days = duration.days ? duration.days.toString() + (duration.days > 1 ? ' days' : ' day') + ', ' : '';
        return days + [duration.hours, duration.minutes, duration.seconds].map(zeroPad).join(':');
    };

    const getRoleTag = (ticketsEarned: number, index: number) => {
        let role = Role.FirstTravelers;

        if (hasContestEnded() && index <= 2) {
            role = Role.Elders;
        } else if (ticketsEarned > 1) {
            role = Role.OGTravelers;
        }

        return <RoleTag role={role} />;
    };

    const hasContestEnded = (): boolean => false;

    return (
        <Flex justifyContent="center">
            <Flex flexDir="column" alignItems="center">
                <Flex mb={7} flexDir="column">
                    <Text mb={1.5} fontSize="lg" fontWeight={600}>
                        Tickets Leaderboard
                    </Text>

                    <Box
                        width="100%"
                        height="1px"
                        background="linear-gradient(90deg, rgb(62 62 62 / 20%) 0%, rgb(150 150 150) 50%, rgb(62 62 62 / 20%) 100%)"
                    ></Box>
                </Flex>

                {!ticketEarners ? (
                    <Spinner mt={3} size="sm" />
                ) : (
                    <Flex flexDir="column">
                        {/* Header */}
                        <Flex mb={2}>
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

                        {_.map(ticketEarners, (earner: TicketEarner, index: number) => (
                            <Flex mt={2} alignItems="center" key={index}>
                                <Text minWidth={COLUMNS[0].width}>{index + 1}</Text>

                                <Text minWidth={COLUMNS[1].width}>{earner.address}</Text>

                                <Flex minWidth={COLUMNS[2].width}>
                                    <Text minWidth="24px">{earner.ticketsEarned}</Text>
                                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                                </Flex>

                                <Flex minWidth={COLUMNS[3].width}>{getRoleTag(earner.ticketsEarned, index)}</Flex>

                                <Flex minWidth={COLUMNS[4].width} alignItems="center">
                                    <TimeIcon boxSize={4} color="whitesmoke" />
                                    <Text ml={2} minWidth="220x" textAlign="right">
                                        {earner.time}
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}

export default Leaderboard;
