import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { zeroPad } from '../services/helpers';
import { differenceInSeconds, intervalToDuration } from 'date-fns';

const COLUMN_WIDTH = '29px';

export const LargeTimer: FunctionComponent<
    PropsWithChildren<{
        timestamp: Date;
        callback?: () => void;
    }>
> = ({ timestamp, callback }) => {
    const [duration, setDuration] = useState<Duration>({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });

    useEffect(() => {
        let timer: string | number | NodeJS.Timer | undefined;

        clearInterval(timer);

        setDuration(
            intervalToDuration({
                start: timestamp,
                end: new Date(),
            })
        );

        timer = setInterval(() => {
            const difference = differenceInSeconds(timestamp, new Date());

            if (difference < 0) {
                clearInterval(timer);

                if (callback) {
                    callback();
                }

                return;
            }

            setDuration(
                intervalToDuration({
                    start: timestamp,
                    end: new Date(),
                })
            );
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [timestamp]);

    const isDisplayingDays = (): boolean => (duration.days as number) > 0;

    return (
        <Flex justifyContent="center" alignItems="center">
            {isDisplayingDays() && (
                <Text layerStyle="header2" px={1}>{`${duration.days} day${(duration.days as number) > 1 ? 's' : ''}`}</Text>
            )}

            <Text layerStyle="header2" minW={COLUMN_WIDTH} textAlign="center">
                {zeroPad(duration.hours)}
            </Text>
            <Text layerStyle="header2" mb="2.5px">
                :
            </Text>
            <Text layerStyle="header2" minW={COLUMN_WIDTH} textAlign="center">
                {zeroPad(duration.minutes)}
            </Text>
            <Text layerStyle="header2" mb="2.5px">
                :
            </Text>
            <Text layerStyle="header2" minW={COLUMN_WIDTH} textAlign="center">
                {zeroPad(duration.seconds)}
            </Text>
        </Flex>
    );
};
