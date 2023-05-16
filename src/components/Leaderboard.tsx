import { Box, Flex, Spinner, Text, Image } from '@chakra-ui/react';
import { useEffect } from 'react';
import { TicketEarner, useGetTicketEarners } from '../blockchain/hooks/useGetTicketEarners';
import { map } from 'lodash';
import { getShortAddress } from '../services/helpers';
import { Role, RoleTag } from '../shared/RoleTag';
import { RESOURCE_ELEMENTS } from '../services/resources';

function Leaderboard() {
    const { earners, getTicketEarners } = useGetTicketEarners();

    useEffect(() => {
        getTicketEarners();
    }, []);

    // TODO: Herotags inside the hook
    // TODO: Simulate ending with Top 3 Elders

    const getRoleTag = (ticketsEarned: number) => {
        return <RoleTag role={ticketsEarned > 1 ? Role.OGTravelers : Role.FirstTravelers} />;
    };

    return (
        <Flex justifyContent="center">
            <Flex flexDir="column" alignItems="center">
                <Text mb={2} fontSize="lg">
                    Tickets Leaderboard
                </Text>

                {!earners ? (
                    <Spinner size="sm" />
                ) : (
                    <Flex flexDir="column">
                        {map(earners, (earner: TicketEarner, index: number) => (
                            <Flex mt={2} alignItems="center" key={index}>
                                <Text minWidth="100px" textAlign="left">
                                    {getShortAddress(earner.address)}
                                </Text>

                                <Text minWidth="24px" textAlign="right">
                                    {earner.ticketsEarned}
                                </Text>

                                <Flex mr={4} minWidth="32px" ml={1}>
                                    <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                                </Flex>

                                {getRoleTag(earner.ticketsEarned)}
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}

export default Leaderboard;
