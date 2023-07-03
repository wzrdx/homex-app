import _ from 'lodash';
import { Flex, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import { COLLECTION_SIZE, REWARDS_QUERYING_INTERVAL } from '../../blockchain/config';
import { round, zeroPad } from '../../services/helpers';
import { StatsEntry } from '../../shared/StatsEntry';
import { intervalToDuration } from 'date-fns';
import { useStoreContext, StoreContextType } from '../../services/store';
import { useGetStakingInfo } from '../../blockchain/hooks/useGetStakingInfo';

function Stats({ stakedNFTsCount, travelersCount, eldersCount }) {
    const [duration, setDuration] = useState<Duration>({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });

    // Local staking info is used in order to fetch staking rewards without triggering a global update on the context
    const { stakingInfo } = useStoreContext() as StoreContextType;
    const { stakingInfo: localStakingInfo, getStakingInfo: getLocalStakingInfo } = useGetStakingInfo();

    useEffect(() => {
        getLocalStakingInfo();

        let rewardsQueryingTimer: NodeJS.Timer = setInterval(() => {
            getLocalStakingInfo();
        }, REWARDS_QUERYING_INTERVAL);

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
            <Flex flexDir="column">
                {/* Local */}
                <Text mb={3} layerStyle="header1">
                    Your NFTs
                </Text>

                <StatsEntry label="Travelers staked" value={travelersCount} />
                <StatsEntry label="Elders staked" value={eldersCount} />
                <StatsEntry label="Staking rewards" color="energyBright" value={localStakingInfo?.rewards.toString() as string}>
                    <Image width="22px" ml={1.5} src={RESOURCE_ELEMENTS.energy.icon} alt="Energy" />
                </StatsEntry>
                {stakingInfo?.isStaked && <StatsEntry label="Time staked" value={getTimestamp()} />}

                {/* Global */}
                <Text mt={5} mb={3} layerStyle="header1">
                    Global Stats
                </Text>

                <StatsEntry
                    label="Total NFTs staked"
                    value={`${stakedNFTsCount} (${round((100 * stakedNFTsCount) / COLLECTION_SIZE, 1)}%)`}
                />
            </Flex>
        </Flex>
    );
}

export default Stats;
