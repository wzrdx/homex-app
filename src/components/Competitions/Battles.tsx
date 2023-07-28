import _ from 'lodash';
import { Alert, AlertIcon, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRewardsContext, RewardsContextType, Competition } from '../../services/rewards';
import { isBefore } from 'date-fns';

function Battles() {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [competitions, setCompetitions] = useState<Competition[]>();

    const { battles } = useRewardsContext() as RewardsContextType;

    // Location
    useEffect(() => {
        if (!_.isEmpty(battles)) {
            init();
        }
    }, [battles]);

    const init = async () => {
        setLoading(true);
        setCompetitions(_.filter(battles, (raffle) => isBefore(new Date(), raffle.timestamp)));
        setLoading(false);
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <Flex flexDir="column" pr={_.size(competitions) > 4 ? 4 : 0} overflowY="auto">
                    {_.isEmpty(competitions) ? (
                        <Flex justifyContent="center">
                            <Alert status="warning">
                                <AlertIcon />
                                There are no raffles to display
                            </Alert>
                        </Flex>
                    ) : (
                        <Box layerStyle="layout" display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" rowGap={8} columnGap={6}>
                            {_.map(competitions, (battle, index) => (
                                <Box key={index}>
                                    <Text>{battle.id}</Text>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Flex>
            )}
        </>
    );
}

export default Battles;
