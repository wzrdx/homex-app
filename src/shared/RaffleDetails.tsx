import _ from 'lodash';
import { Flex, Text, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { getFullTicket } from '../services/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon, WarningIcon } from '@chakra-ui/icons';
import { useRewards } from '../components/Rewards';
import { Participant } from '../blockchain/types';
import { getParticipantsCount } from '../blockchain/api/getParticipantsCount';
import { getUsername, pairwise } from '../services/helpers';
import { getParticipants } from '../blockchain/api/getParticipants';

const COLUMNS = [
    {
        name: 'Player',
        width: '274px',
        align: 'left',
    },
    {
        name: 'Tickets',
        width: '60px',
        align: 'left',
    },
];

function RaffleDetails() {
    const { height } = useRewards();
    const navigate = useNavigate();

    // let { id } = useParams();

    const [participants, setParticipants] = useState<Participant[]>();
    const [error, setError] = useState<boolean>(false);

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
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
                .map(async (earner) => ({
                    ...earner,
                    username: await getUsername(earner.address),
                }))
                .value()
        );

        setParticipants(parsed);
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} flexDir="column" alignItems="center">
            <Flex justifyContent="center">
                <Flex
                    alignItems="center"
                    px={2}
                    pb={4}
                    transition="all 0.1s ease-in"
                    cursor="pointer"
                    _hover={{ color: '#b8b8b8' }}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon fontSize="17px" />
                    <Text ml={1} fontSize="17px">
                        Back
                    </Text>
                </Flex>
            </Flex>

            {!participants ? (
                <Spinner mt={6} />
            ) : !!error ? (
                <Flex alignItems="center">
                    <WarningIcon boxSize={4} color="redClrs" />
                    <Text ml={2}>Unable to fetch leaderboard</Text>
                </Flex>
            ) : (
                <Flex px={6} flexDir="column" overflowY="auto" overflowX="hidden">
                    {!participants?.length ? (
                        <Flex flexDir="column" justifyContent="center" alignItems="center">
                            <Image my={2} height="256px" src={getFullTicket()} />
                            <Text mt={5} textAlign="center" maxWidth="464px">
                                No traveler has entered this Raffle yet. Become the first one by submitting a{' '}
                                <Text as="span" color="ticketGold">
                                    Ticket
                                </Text>
                                .
                            </Text>
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

                    {_.map(participants, (participant: Participant, index: number) => (
                        <Flex mt={2} alignItems="center" key={index}>
                            <Text pr={6} layerStyle="ellipsis" width={COLUMNS[0].width}>
                                {participant.username}
                            </Text>

                            <Flex minWidth={COLUMNS[1].width}>
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

export default RaffleDetails;
