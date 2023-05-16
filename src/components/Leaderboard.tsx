import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TicketEarner, useGetTicketEarners } from '../blockchain/hooks/useGetTicketEarners';
import _ from 'lodash';
import { getShortAddress, getUsername } from '../services/helpers';
import { Role, RoleTag } from '../shared/RoleTag';
import { RESOURCE_ELEMENTS } from '../services/resources';

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
        const sorted = _.orderBy(earners, 'ticketsEarned', 'desc');

        console.log(sorted);

        const parsedEarners = await Promise.all(
            _(sorted)
                .map(async (earner) => ({
                    address: await getUsername(earner.address),
                    ticketsEarned: earner.ticketsEarned,
                }))
                .value()
        );

        setTicketEarners(parsedEarners);
    };

    const getRoleTag = (ticketsEarned: number, index: number) => {
        let role = Role.FirstTravelers;

        if (hasContestEnded() && index <= 2) {
            role = Role.Elders;
        } else if (ticketsEarned > 1) {
            role = Role.OGTravelers;
        }

        return (
            <Box ml="64px">
                <RoleTag role={role} />
            </Box>
        );
    };

    const hasContestEnded = (): boolean => false;

    return (
        <Flex justifyContent="center">
            <Flex flexDir="column" alignItems="center">
                <Flex mb={6} flexDir="column">
                    <Text mb={1} fontSize="lg" fontWeight={600}>
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
                            <Text minWidth="154px" textAlign="left" fontWeight={600} fontSize="17px">
                                Player
                            </Text>

                            <Text minWidth="120px" textAlign="left" fontWeight={600} fontSize="17px">
                                Tickets
                            </Text>

                            <Text minWidth="96px" textAlign="left" fontWeight={600} fontSize="17px">
                                Role
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
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}

export default Leaderboard;
