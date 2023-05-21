import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TicketEarner, useGetTicketEarners } from '../blockchain/hooks/useGetTicketEarners';
import _ from 'lodash';
import { getShortAddress, getUsername, zeroPad } from '../services/helpers';
import { Role, RoleTag } from '../shared/RoleTag';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { START_OF_CONTEST } from '../blockchain/config';
import { TimeIcon } from '@chakra-ui/icons';

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

        return (
            <Flex ml="64px" width="246px">
                <RoleTag role={role} />
            </Flex>
        );
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
                            <Text minWidth="151px" textAlign="left" fontWeight={600} fontSize="17px">
                                Player
                            </Text>

                            <Text minWidth="122px" textAlign="left" fontWeight={600} fontSize="17px">
                                Tickets
                            </Text>

                            <Text minWidth="246px" textAlign="left" fontWeight={600} fontSize="17px">
                                Role
                            </Text>

                            <Text minWidth="100px" textAlign="left" fontWeight={600} fontSize="17px">
                                Time
                            </Text>
                        </Flex>

                        {_.map(ticketEarners, (earner: TicketEarner, index: number) => (
                            <Flex mt={2} alignItems="center" key={index}>
                                <Text minWidth="140px" textAlign="left">
                                    {earner.address}
                                </Text>

                                <Text minWidth="44px" textAlign="right">
                                    {earner.ticketsEarned}
                                </Text>

                                <Flex minWidth="26px" justifyContent="flex-end">
                                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                                </Flex>

                                {getRoleTag(earner.ticketsEarned, index)}

                                <Flex alignItems="center">
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
