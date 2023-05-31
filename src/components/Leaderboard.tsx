import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TicketEarner, useGetTicketEarners } from '../blockchain/hooks/useGetTicketEarners';
import _ from 'lodash';
import { getUsername, zeroPad } from '../services/helpers';
import { Role, RoleTag } from '../shared/RoleTag';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { START_OF_CONTEST } from '../blockchain/config';
import { TimeIcon, InfoOutlineIcon, WarningIcon } from '@chakra-ui/icons';
import { getFullTicket } from '../services/assets';
import { getTicketEarnersCount } from '../blockchain/api/getTicketEarnersCount';

const COLUMNS = [
    {
        name: 'Rank',
        width: '72px',
        align: 'left',
    },
    {
        name: 'Player',
        width: '246px',
        align: 'left',
    },
    {
        name: 'Tickets',
        width: '96px',
        align: 'left',
    },
    {
        name: 'Role',
        width: '234px',
        align: 'left',
    },
    {
        name: 'Time',
        width: '126px',
        align: 'left',
    },
];

function Leaderboard() {
    const { earners, getTicketEarners } = useGetTicketEarners();

    const [ticketEarners, setTicketEarners] = useState<TicketEarner[]>();
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        getTicketEarnersCount();
        getTicketEarners(0, 100);
    }, []);

    useEffect(() => {
        if (earners) {
            parseEarners();
        }
    }, [earners]);

    const parseEarners = async () => {
        try {
            const sorted = _.orderBy(earners, ['ticketsEarned', 'timestamp'], ['desc', 'asc']);

            // Earners parsed with initial roles
            const parsedEarners: TicketEarner[] = await Promise.all(
                _(sorted)
                    .map(async (earner, index) => ({
                        ...earner,
                        address: await getUsername(earner.address),
                        time: getDuration(earner.timestamp),
                        role: getRole(earner.ticketsEarned, index),
                    }))
                    .value()
            );

            const first25OgsAddresses = _(parsedEarners)
                .orderBy(['timestamp'], ['asc'])
                .filter((earner) => earner.role === Role.OGTravelers)
                .map((earner) => earner.address)
                .take(25)
                .value();

            const earnearsWithFilteredOgs = _.map(parsedEarners, (earner) => {
                return {
                    ...earner,
                    role:
                        earner.role === Role.OGTravelers && !_.includes(first25OgsAddresses, earner.address)
                            ? Role.FirstTravelers
                            : earner.role,
                };
            });

            console.log(earnearsWithFilteredOgs);

            setTicketEarners(earnearsWithFilteredOgs);
        } catch (error) {
            console.error(error);
            setError(true);
            setTicketEarners([]);
        }
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

    const getRole = (ticketsEarned: number, index: number): Role => {
        let role = Role.FirstTravelers;

        if (index <= 2 && ticketsEarned >= 3) {
            role = Role.Elders;
        } else if (ticketsEarned > 1) {
            role = Role.OGTravelers;
        }

        return role;
    };

    return (
        <Flex justifyContent="center" height="100%">
            <Flex flexDir="column" alignItems="center">
                <Flex mb={5} flexDir="column" alignItems="center">
                    <Text mb={1} fontSize="lg" fontWeight={600}>
                        Tickets Leaderboard
                    </Text>

                    <Box
                        width="110%"
                        height="1px"
                        background="linear-gradient(90deg, rgb(62 62 62 / 20%) 0%, rgb(150 150 150) 50%, rgb(62 62 62 / 20%) 100%)"
                    ></Box>
                </Flex>

                <Flex mb={6} justifyContent="center" alignItems="center">
                    <InfoOutlineIcon boxSize={4} color="whitesmoke" />
                    <Text ml={2}>
                        Advance your ranking by collecting as many Tickets as you can in order to earn rewards
                    </Text>
                </Flex>

                {!ticketEarners ? (
                    <Spinner mt={3} size="sm" />
                ) : !!error ? (
                    <Flex alignItems="center">
                        <WarningIcon boxSize={4} color="redClrs" />
                        <Text ml={2}>Unable to fetch leaderboard</Text>
                    </Flex>
                ) : (
                    <Flex flexDir="column" overflowY="auto" overflowX="hidden">
                        {/* Header */}
                        {!ticketEarners.length ? (
                            <Flex flexDir="column" justifyContent="center" alignItems="center">
                                <Image height="256px" src={getFullTicket()} />
                                <Text mt={5} textAlign="center" maxWidth="464px">
                                    No traveler has managed to retrieve the{' '}
                                    <Text as="span" color="brightBlue">
                                        Sacred Scarab
                                    </Text>{' '}
                                    yet. Become the first one by completing the{' '}
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
                        )}

                        {_.map(ticketEarners, (earner: TicketEarner, index: number) => (
                            <Flex mt={2} alignItems="center" key={index}>
                                <Text minWidth={COLUMNS[0].width}>{index + 1}</Text>

                                <Text pr={6} layerStyle="ellipsis" width={COLUMNS[1].width}>
                                    {earner.address}
                                </Text>

                                <Flex minWidth={COLUMNS[2].width}>
                                    <Text minWidth="24px">{earner.ticketsEarned}</Text>
                                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                                </Flex>

                                <Flex minWidth={COLUMNS[3].width}>
                                    <RoleTag role={earner.role} />
                                </Flex>

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
