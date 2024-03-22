import _ from 'lodash';
import { Flex, Spinner, Stack, Text, Image, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getXpLeaderboard } from '../../blockchain/game/api/getXpLeaderboard';
import { formatNumberWithK, getUsername, pairwise, round } from '../../services/helpers';
import { useSection } from '../Section';
import { getLevel } from '../../services/xp';
import { getXpLeaderboardSize } from '../../blockchain/game/api/getXpLeaderboardSize';
import { LiaScrollSolid } from 'react-icons/lia';
import { PlayerInfo } from '../../blockchain/types';
import { MAZE_DENOMINATION } from '../../blockchain/config';
import { RESOURCE_ELEMENTS } from '../../services/resources';

interface Player extends PlayerInfo {
    name: string;
    level: number;
    color: string;
}

const CHUNK_SIZE = 50;
const LEADERBOARD_SIZE = 100;

const COLUMNS: {
    name: string;
    icon: JSX.Element;
    width: string;
    color?: string;
}[] = [
    {
        name: 'Rank',
        icon: <></>,
        width: '84px',
    },
    {
        name: 'Player',
        icon: <></>,
        width: '236px',
    },
    {
        name: 'XP',
        icon: <></>,
        width: '108px',
    },
    {
        name: 'Level',
        icon: <></>,
        width: '84px',
    },
    {
        name: 'Pages',
        icon: <LiaScrollSolid fontSize="23px" />,
        width: '104px',
    },
    {
        name: 'Energy',
        icon: (
            <Box mb="2px">
                <Image width="24px" ml={0.5} src={RESOURCE_ELEMENTS.energy.icon} />
            </Box>
        ),
        width: '120px',
        color: 'resources.energy',
    },
    {
        name: 'Maze',
        icon: (
            <Box mb="2px">
                <Image width="24px" ml={0.5} src={RESOURCE_ELEMENTS.maze.icon} />
            </Box>
        ),
        width: '116px',
        color: 'mirage',
    },
];

function XPLeaderboard() {
    const { height } = useSection();

    const [players, setPlayers] = useState<Player[]>();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const leaderboardSize = await getXpLeaderboardSize();

        const chunks = new Array(Math.floor(leaderboardSize / CHUNK_SIZE))
            .fill(CHUNK_SIZE)
            .concat(leaderboardSize % CHUNK_SIZE);

        const apiCalls: Array<Promise<PlayerInfo[]>> = [];

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

    const parse = async (players: PlayerInfo[]) => {
        const sorted = _(players).orderBy('xp', 'desc').take(LEADERBOARD_SIZE).value();

        const array = await Promise.all(
            _(sorted)
                .map(async (playerInfo) => {
                    const { level, color } = getLevel(playerInfo.xp);

                    return {
                        ...playerInfo,
                        name: await getUsername(playerInfo.address),
                        pagesMinted: playerInfo.pagesMinted,
                        energyClaimed: playerInfo.energyClaimed,
                        level,
                        color,
                    };
                })
                .value()
        );

        setPlayers(array);
    };

    const getEnergyColor = (num: number): string => {
        if (num > 1000000) {
            return 'redClrs';
        } else if (num >= 500000 && num < 1000000) {
            return 'mirage';
        } else if (num >= 100000 && num < 500000) {
            return 'wheat';
        } else {
            return 'whitesmoke';
        }
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} flexDir="column" alignItems="center">
            {!players ? (
                <Spinner mt={3} size="sm" />
            ) : (
                <Flex layerStyle="layout" justifyContent="center" overflowY="auto" overflowX="hidden">
                    <Flex px={8} flexDir="column" overflowY="auto" overflowX="hidden">
                        <Flex mb={1}>
                            {_.map(
                                COLUMNS,
                                (
                                    column: {
                                        name: string;
                                        icon: JSX.Element;
                                        width: string;
                                        color?: string;
                                    },
                                    index: number
                                ) => (
                                    <Stack key={index} direction="row" layerStyle="center" spacing={1} minWidth={column.width}>
                                        <Text layerStyle="header2" color={column.color}>
                                            {column.name}
                                        </Text>

                                        {column.icon}
                                    </Stack>
                                )
                            )}
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

                                <Text width={COLUMNS[4].width}>{player.pagesMinted}</Text>

                                <Text width={COLUMNS[5].width} color={getEnergyColor(player.energyClaimed)}>
                                    {formatNumberWithK(player.energyClaimed)}
                                </Text>

                                <Text width={COLUMNS[5].width}>{round(player.mazeBalance / MAZE_DENOMINATION, 2)}</Text>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}

export default XPLeaderboard;
