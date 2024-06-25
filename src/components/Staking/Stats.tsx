import { Flex, Image, Stack, Text } from '@chakra-ui/react';
import { intervalToDuration } from 'date-fns';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { config } from '../../blockchain/config';
import { useGetStakingInfo } from '../../blockchain/game/hooks/useGetStakingInfo';
import { zeroPad } from '../../services/helpers';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import { StoreContextType, useStoreContext } from '../../services/store';
import { StatsEntry } from '../../shared/StatsEntry';

function Stats({ stakedNFTsCount, travelersCount, eldersCount }) {
    const [duration, setDuration] = useState<Duration>({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });

    // Local staking info is used in order to fetch staking rewards without triggering an update on the parent component
    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { stakingInfo: localStakingInfo, getStakingInfo: getLocalStakingInfo } = useGetStakingInfo();

    useEffect(() => {
        getLocalStakingInfo();

        let rewardsQueryingTimer: NodeJS.Timer = setInterval(() => {
            getLocalStakingInfo();
        }, config.energyQueryingInterval);

        return () => {
            clearInterval(rewardsQueryingTimer);
        };
    }, []);

    useEffect(() => {
        let timer: string | number | NodeJS.Timer | undefined;

        if (stakingInfo && stakingInfo.isStaked) {
            getLocalStakingInfo();
            clearInterval(timer);

            setDuration(
                intervalToDuration({
                    start: stakingInfo.timestamp,
                    end: new Date(),
                })
            );

            timer = setInterval(() => {
                setDuration(
                    intervalToDuration({
                        start: stakingInfo.timestamp,
                        end: new Date(),
                    })
                );
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [stakingInfo]);

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
        <Flex justifyContent="center" height="100%">
            <Stack spacing={3}>
                <Text layerStyle="header1">Your NFTs</Text>

                <StatsEntry label="Travelers staked" value={travelersCount} />
                <StatsEntry label="Elders staked" value={eldersCount} />
                <StatsEntry label="Staking rewards" color="energyBright" value={localStakingInfo?.rewards.toString() as string}>
                    <Image width="22px" ml={1.5} src={RESOURCE_ELEMENTS.energy.icon} alt="Energy" />
                </StatsEntry>
                {stakingInfo?.isStaked && <StatsEntry label="Time staked" value={getTimestamp()} />}

                <Text pt={5} layerStyle="header1">
                    Global Stats
                </Text>

                <StatsEntry
                    label="Total NFTs staked"
                    value={`${stakedNFTsCount} (${_.round((100 * stakedNFTsCount) / config.collectionSize, 1)}%)`}
                />
            </Stack>
        </Flex>
    );
}

export default Stats;
