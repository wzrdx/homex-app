import _ from 'lodash';
import { Alert, AlertIcon, Box, Flex, Spinner } from '@chakra-ui/react';
import RaffleCard from '../../shared/RaffleCard';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAfter, isBefore } from 'date-fns';
import { routeNames } from '../../services/routes';
import { useRewardsContext, RewardsContextType, Competition, RewardType } from '../../services/rewards';
// import { getTx } from '../../services/helpers';
// import axios from 'axios';
// import { API_URL } from '../../blockchain/config';

function Raffles() {
    const location = useLocation();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [competitions, setCompetitions] = useState<Competition[]>();

    const { raffles } = useRewardsContext() as RewardsContextType;

    // Location
    useEffect(() => {
        if (location && !_.isEmpty(raffles)) {
            init(location.pathname);
        }
    }, [location, raffles]);

    const init = async (pathname: string) => {
        setLoading(true);
        const predicate = pathname.includes(routeNames.past) ? isAfter : isBefore;
        setCompetitions(_.filter(raffles, (raffle) => predicate(new Date(), raffle.timestamp)));
        setLoading(false);

        // TODO: Remove
        // const bh = await getTx('bc1f446852520ec5aa4fde3b66998f4dae89a0b1906b879b18d52a98bcf681dd');
        // const ids = _.map(bh?.data?.operations, (operation) => operation.identifier);

        // const array: any[] = [];

        // _.forEach(ids, async (id) => {
        //     const result = await axios.get(`nfts/${id}`, {
        //         baseURL: API_URL,
        //         params: {
        //             fields: 'nonce,name,url,metadata',
        //         },
        //     });

        //     array.push({
        //         type: 'RewardType.NFT',
        //         id: 'getId()',
        //         winners: 1,
        //         name: result.data.name,
        //         nonce: result.data.nonce,
        //         url: result.data.url,
        //         rank: _.find(result.data.metadata.attributes, (attr) => attr.trait_type === 'Rank')?.value,
        //     });
        // });

        // setTimeout(() => {
        //     console.log(JSON.stringify(_.orderBy(array, ['rank', 'name'], ['asc', 'asc'])));
        // }, 3000);
    };

    <Alert status="warning">
        <AlertIcon />
        There are no raffles to display
    </Alert>;

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
                            {_.map(competitions, (raffle, index) => (
                                <Box key={index}>
                                    <RaffleCard
                                        id={raffle.id}
                                        timestamp={raffle.timestamp}
                                        tickets={raffle.tickets}
                                        _raffles={raffles}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Flex>
            )}
        </>
    );
}

export default Raffles;
