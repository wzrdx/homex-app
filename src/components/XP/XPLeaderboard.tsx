import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getXpLeaderboard } from '../../blockchain/api/getXpLeaderboard';
import { getUsername, pairwise } from '../../services/helpers';
import { useSection } from '../Section';
import { getLevel } from '../../services/xp';
import { getXpLeaderboardSize } from '../../blockchain/api/getXpLeaderboardSize';
import _ from 'lodash';

const CHUNK_SIZE = 50;
const LEADERBOARD_SIZE = 100;

const COLUMNS = [
    {
        name: 'Rank',
        width: '84px',
    },
    {
        name: 'Player',
        width: '256px',
    },
    {
        name: 'XP',
        width: '108px',
    },
    {
        name: 'Level',
        width: '48px',
    },
];

function XPLeaderboard() {
    const { height } = useSection();

    const [players, setPlayers] = useState<
        {
            name: string;
            xp: number;
            level: number;
            color: string;
        }[]
    >();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const leaderboardSize = await getXpLeaderboardSize();

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
                apiCalls.push(getXpLeaderboard(current, next));
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
                    const { level, color } = getLevel(player.xp);

                    return {
                        name: await getUsername(player.address),
                        xp: player.xp,
                        level,
                        color,
                    };
                })
                .value()
        );

        console.log(array);
        setPlayers(array);
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} flexDir="column" alignItems="center">
            {!players ? (
                <Spinner mt={3} size="sm" />
            ) : (
                <Flex layerStyle="layout" justifyContent="center" overflowY="auto" overflowX="hidden">
                    <Flex px={8} flexDir="column" overflowY="auto" overflowX="hidden">
                        <Flex mb={1}>
                            {_.map(COLUMNS, (column: any, index: number) => (
                                <Text key={index} layerStyle="header2" minWidth={column.width}>
                                    {column.name}
                                </Text>
                            ))}
                        </Flex>

                        {_.map(players, (player, index: number) => (
                            <Flex mt={2} alignItems="center" key={index}>
                                <Text minWidth={COLUMNS[0].width}>{index + 1}</Text>

                                <Text pr={6} layerStyle="ellipsis" width={COLUMNS[1].width}>
                                    {player.name}
                                </Text>

                                <Flex minWidth={COLUMNS[2].width}>
                                    <Text>{player.xp}</Text>
                                </Flex>

                                <Text width={COLUMNS[3].width} color={player.color} fontWeight={500}>
                                    {player.level}
                                </Text>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}

export default XPLeaderboard;
