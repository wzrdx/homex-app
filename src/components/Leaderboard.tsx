import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { TicketEarner, useGetTicketEarners } from '../blockchain/hooks/useGetTicketEarners';
import { map } from 'lodash';
import { getShortAddress } from '../services/helpers';
import { Role, RoleTag } from '../shared/RoleTag';

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
                            <Flex mt={1} alignItems="center" key={index}>
                                <Text>{getShortAddress(earner.address)}</Text>
                                <Text mx={6}>{earner.ticketsEarned}</Text>
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
