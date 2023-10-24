import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getXpLeaderboard } from '../../blockchain/api/getXpLeaderboard';
import { map } from 'lodash';
import { getUsername } from '../../services/helpers';
import { useSection } from '../Section';
import { getLevel } from '../../services/xp';

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
        const array = await getXpLeaderboard();

        setPlayers(
            await Promise.all(
                map(array, async (player) => {
                    const { level, color } = getLevel(player.xp);

                    console.log(color);

                    return {
                        name: await getUsername(player.address),
                        xp: player.xp,
                        level,
                        color,
                    };
                })
            )
        );
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} flexDir="column" alignItems="center">
            {!players ? (
                <Spinner mt={3} size="sm" />
            ) : (
                <Flex layerStyle="layout" justifyContent="center" overflowY="auto" overflowX="hidden">
                    <Flex px={8} flexDir="column" overflowY="auto" overflowX="hidden">
                        <Flex mb={1}>
                            {map(COLUMNS, (column: any, index: number) => (
                                <Text key={index} layerStyle="header2" minWidth={column.width}>
                                    {column.name}
                                </Text>
                            ))}
                        </Flex>

                        {map(players, (player, index: number) => (
                            <Flex mt={2} alignItems="center" key={index}>
                                <Text minWidth={COLUMNS[0].width}>{index + 1}</Text>

                                <Text pr={6} layerStyle="ellipsis" width={COLUMNS[1].width}>
                                    {player.name}
                                </Text>

                                <Flex minWidth={COLUMNS[2].width}>
                                    <Text>{player.xp}</Text>
                                </Flex>

                                <Text width={COLUMNS[3].width} color={player.color}>
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
