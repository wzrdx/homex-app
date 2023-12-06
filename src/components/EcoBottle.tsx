import { Flex, Spinner, Stack, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { pairwise, getUsername } from '../services/helpers';
import Logo from '../assets/ecobottle_logo.png';
import { getEcobottleLeaderboard } from '../blockchain/api/ecobottle/getEcobottleLeaderboard';
import { getEcobottleLeaderboardSize } from '../blockchain/api/ecobottle/getEcobottleLeaderboardSize';

const CHUNK_SIZE = 50;
const LEADERBOARD_SIZE = 100;

const COLUMNS = [
    {
        name: 'Rank',
        width: '84px',
    },
    {
        name: 'Player',
        width: '216px',
    },
    {
        name: 'XP Earned',
        width: '88px',
    },
];

function EcoBottle() {
    const [players, setPlayers] = useState<
        {
            name: string;
            xp: number;
        }[]
    >();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const leaderboardSize = await getEcobottleLeaderboardSize();

        const chunks = new Array(Math.floor(leaderboardSize / CHUNK_SIZE))
            .fill(CHUNK_SIZE)
            .concat(leaderboardSize % CHUNK_SIZE);

        const apiCalls: Array<
            Promise<
                {
                    address: string;
                    xp: number;
                }[]
            >
        > = [];

        pairwise(
            _(chunks)
                .filter(_.identity)
                .map((chunk, index) => {
                    return index * CHUNK_SIZE + chunk;
                })
                .unshift(0)
                .value(),
            (current: number, next: number) => {
                apiCalls.push(getEcobottleLeaderboard(current, next));
            }
        );

        const result = await Promise.all(apiCalls);
        parse(_.flatten(result));
    };

    const parse = async (
        players: {
            address: string;
            xp: number;
        }[]
    ) => {
        const sorted = _(players).orderBy('xp', 'desc').take(LEADERBOARD_SIZE).value();

        const array = await Promise.all(
            _(sorted)
                .map(async (player) => {
                    return {
                        name: await getUsername(player.address),
                        addr: player.address,
                        xp: player.xp,
                    };
                })
                .value()
        );

        console.log(array.slice(0, 15));
        setPlayers(array);
    };

    return (
        <Flex height="100%" flexDir="column" alignItems="center">
            {!players ? (
                <Spinner mt={3} size="sm" />
            ) : (
                <Stack spacing={6} p={6} maxHeight="100%" backgroundColor="#111" borderRadius="9px">
                    <Stack spacing={4} alignItems="center" justifyContent="center" maxW="516px">
                        <Image src={Logo} width="52px" />

                        <Stack spacing={1}>
                            <Text textAlign="center" fontSize="18px" fontWeight={600} letterSpacing="0.75">
                                EcoBottle XP Leaderboard
                            </Text>

                            <Text textAlign="center">
                                The leaderboard shows event XP, which you can use to claim the{' '}
                                <Text as="span" fontWeight={500} color="#0099d8">
                                    EcoBottle token
                                </Text>
                                . Your profile XP won't change after claiming.
                            </Text>
                        </Stack>

                        {/* <Text layerStyle="header2">
                            1 XP ≃ 1{' '}
                            <Text as="span" color="#0099d8">
                                EcoBottle Token ($CAP)
                            </Text>
                        </Text> */}

                        <Text textAlign="center">
                            The top 15 players who minted EcoBottle will be airdropped
                            <br />
                            <Text as="span" fontWeight={500} color="ticketGold">
                                10 Golden Tickets
                            </Text>{' '}
                            and{' '}
                            <Text as="span" fontWeight={500} color="#42f8ba">
                                1 Verdant Art Drop
                            </Text>
                        </Text>
                    </Stack>

                    {!_.isEmpty(players) && (
                        <Flex justifyContent="center" overflowY="auto" overflowX="hidden">
                            <Flex flexDir="column">
                                <Flex mb={1}>
                                    {_.map(COLUMNS, (column: any, index: number) => (
                                        <Text key={index} layerStyle="header1Alt" minWidth={column.width}>
                                            {column.name}
                                        </Text>
                                    ))}
                                </Flex>

                                {_.map(players, (player, index: number) => (
                                    <Flex mt={2} alignItems="center" key={index}>
                                        <Text minWidth={COLUMNS[0].width} color={index < 15 ? 'energyBright' : 'whitesmoke'}>
                                            {index + 1}
                                        </Text>

                                        <Text pr={6} layerStyle="ellipsis" width={COLUMNS[1].width}>
                                            {player.name}
                                        </Text>

                                        <Flex minWidth={COLUMNS[2].width}>
                                            <Text>{player.xp}</Text>
                                        </Flex>
                                    </Flex>
                                ))}
                            </Flex>
                        </Flex>
                    )}
                </Stack>
            )}
        </Flex>
    );
}

export default EcoBottle;
