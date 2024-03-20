import _ from 'lodash';
import { Text, Center, Stack, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useStoreContext, StoreContextType } from '../../services/store';
import { intervalToDuration } from 'date-fns';
import { zeroPad } from '../../services/helpers';
import { StatsEntry } from '../../shared/StatsEntry';

function Altar() {
    const { mazeStakingInfo } = useStoreContext() as StoreContextType;
    const [duration, setDuration] = useState<Duration>({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });

    useEffect(() => {
        if (mazeStakingInfo && mazeStakingInfo.isStaked) {
            console.log(mazeStakingInfo);

            setDuration(
                intervalToDuration({
                    start: mazeStakingInfo.timestamp,
                    end: new Date(),
                })
            );
        }
    }, [mazeStakingInfo]);

    const getDays = (): string => {
        const days: number = duration.days as number;
        if (!days) {
            return '';
        }

        return days > 1 ? `${days} days, ` : `one day, `;
    };

    const getTimestamp = (): string =>
        `${getDays()}${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;

    return (
        <Flex height="100%">
            {!mazeStakingInfo ? (
                <Spinner />
            ) : (
                <Stack spacing={6}>
                    <Text layerStyle="header1">Altar</Text>
                    <StatsEntry label="Time staked" value={getTimestamp()} />
                    <StatsEntry label="Staking rewards" value={mazeStakingInfo.rewards.toString()} />
                    <StatsEntry label="Maze balance" color="mirage" value={mazeStakingInfo.mazeBalance} />
                </Stack>
            )}
        </Flex>
    );
}

export default Altar;
