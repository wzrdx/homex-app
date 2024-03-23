import _, { round } from 'lodash';
import { Text, Center, Stack, Spinner, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useStoreContext, StoreContextType } from '../../services/store';
import { intervalToDuration } from 'date-fns';
import { formatMaze, zeroPad } from '../../services/helpers';
import { StatsEntry } from '../../shared/StatsEntry';
import { MAZE_QUERYING_INTERVAL } from '../../blockchain/config';
import { useGetStakingInfo as useGetMazeStakingInfo } from '../../blockchain/auxiliary/hooks/useGetStakingInfo';
import AltarImage from '../../assets/images/the_altar.jpg';

function Altar() {
    const [duration, setDuration] = useState<Duration>({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });

    // Local staking info is used in order to fetch staking rewards without triggering an update on the parent component
    const { mazeStakingInfo } = useStoreContext() as StoreContextType;
    const { mazeStakingInfo: localStakingInfo, getMazeStakingInfo: getLocalStakingInfo } = useGetMazeStakingInfo();

    useEffect(() => {
        getLocalStakingInfo();

        let rewardsQueryingTimer: NodeJS.Timer = setInterval(() => {
            getLocalStakingInfo();
        }, MAZE_QUERYING_INTERVAL);

        return () => {
            clearInterval(rewardsQueryingTimer);
        };
    }, []);

    useEffect(() => {
        let timer: string | number | NodeJS.Timer | undefined;

        if (mazeStakingInfo && mazeStakingInfo.isStaked) {
            getLocalStakingInfo();
            clearInterval(timer);

            setDuration(
                intervalToDuration({
                    start: mazeStakingInfo.timestamp,
                    end: new Date(),
                })
            );

            timer = setInterval(() => {
                setDuration(
                    intervalToDuration({
                        start: mazeStakingInfo.timestamp,
                        end: new Date(),
                    })
                );
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
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
        <Center
            height="100%"
            maxH="600px"
            width="100%"
            backgroundColor="#dba5d130"
            borderRadius="3px"
            border="2px solid #dba5d110"
            position="relative"
        >
            <Stack p={[4, 4, 6, 6, 8, 12]} height="476px" justifyContent="space-between" alignItems="center">
                <Stack spacing={6} direction="row" justifyContent="center" alignItems="center">
                    <Image width="310px" src={AltarImage} />

                    <Text textAlign="justify" lineHeight="22px" maxW="310px">
                        The mystical{' '}
                        <Text as="span" fontWeight={500}>
                            Altar
                        </Text>{' '}
                        beckons. Here, Travelers like yourself gather to infuse the{' '}
                        <Text as="span" fontWeight={500}>
                            Altar
                        </Text>{' '}
                        with powerful artifacts, each carrying the essence of their quests and challenges. As the{' '}
                        <Text as="span" fontWeight={500}>
                            Altar
                        </Text>{' '}
                        absorbs their energy, it glows with pulsating light. Once it reaches its zenith, the{' '}
                        <Text as="span" fontWeight={500}>
                            Altar
                        </Text>{' '}
                        will reward Travelers with{' '}
                        <Text as="span" color="mirage" fontWeight={500}>
                            Maze
                        </Text>
                        , a token of their valor and contributions. The more aid you provide in charging the{' '}
                        <Text as="span" fontWeight={500}>
                            Altar
                        </Text>
                        , the greater the reward it bestows upon you, a testament to your dedication on this mystical journey
                        through Menhir.
                    </Text>
                </Stack>

                {!localStakingInfo ? (
                    <Spinner />
                ) : (
                    <Stack direction="row" spacing="74px">
                        <StatsEntry label="Time since last claim" value={getTimestamp()} />
                        <StatsEntry label="Unclaimed rewards" value={formatMaze(localStakingInfo.rewards)} />
                        <StatsEntry label="Maze balance" color="mirage" value={formatMaze(localStakingInfo.mazeBalance)} />
                    </Stack>
                )}
            </Stack>
        </Center>
    );
}

export default Altar;
