import _ from 'lodash';
import { Flex, Text, Stack, Spinner, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { StatsEntry } from '../../shared/StatsEntry';
import { useStoreContext, StoreContextType } from '../../services/store';
import { MazeStakingStats, getStakingStats } from '../../blockchain/auxiliary/api/getStakingStats';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import { formatMaze } from '../../services/helpers';

function Stats() {
    const { mazeStakingInfo } = useStoreContext() as StoreContextType;
    const [stats, setStats] = useState<MazeStakingStats | undefined>();

    useEffect(() => {
        (async () => setStats(await getStakingStats()))();
    }, []);

    return (
        <Flex justifyContent="center" height="100%">
            {!stats || !mazeStakingInfo ? (
                <Spinner />
            ) : (
                <Stack spacing={3}>
                    <Text layerStyle="header1">Your SFTs</Text>
                    <StatsEntry
                        label="Tokens staked"
                        value={_(mazeStakingInfo.tokens)
                            .map((token) => token.amount)
                            .sum()}
                    />

                    <Text pt={5} layerStyle="header1">
                        Global Stats
                    </Text>
                    <StatsEntry label="Tokens staked" value={stats.tokens} />
                    <StatsEntry label="Wallets staked" value={stats.wallets} />
                    <StatsEntry label="Maze supply" value={formatMaze(stats.supply)} color="mirage">
                        <Image width="22px" ml={1.5} src={RESOURCE_ELEMENTS.maze.icon} alt="Maze" />
                    </StatsEntry>
                </Stack>
            )}
        </Flex>
    );
}

export default Stats;
