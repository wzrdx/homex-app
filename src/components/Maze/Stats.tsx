import _ from 'lodash';
import { Flex, Text, Stack, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { StatsEntry } from '../../shared/StatsEntry';
import { useStoreContext, StoreContextType } from '../../services/store';
import { getStakingStats } from '../../blockchain/auxiliary/api/getStakingStats';

function Stats() {
    const { mazeStakingInfo } = useStoreContext() as StoreContextType;
    const [stats, setStats] = useState<{
        pages: number;
        items: number;
    }>();

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
                    <StatsEntry label="Total tokens staked" value={stats.pages} />
                </Stack>
            )}
        </Flex>
    );
}

export default Stats;
