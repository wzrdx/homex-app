import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { hDisplay, mDisplay, sDisplay, zeroPad } from '../services/helpers';
import { differenceInSeconds, intervalToDuration } from 'date-fns';

export const Timer: FunctionComponent<
    PropsWithChildren<{
        isActive: boolean;
        timestamp: Date;
        callback?: () => void;
        isDescending?: boolean;
        isCompact?: boolean;
        displayDays?: boolean;
    }>
> = ({ isActive, timestamp, callback, isDescending = false, isCompact = false, displayDays = false }) => {
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

        if (!isActive) {
            setDuration({
                seconds: 0,
                minutes: 0,
                hours: 0,
                days: 0,
                months: 0,
                years: 0,
            });

            clearInterval(timer);
        } else {
            clearInterval(timer);

            setDuration(
                intervalToDuration({
                    start: timestamp,
                    end: new Date(),
                })
            );

            timer = setInterval(() => {
                if (isDescending) {
                    const difference = differenceInSeconds(timestamp, new Date());

                    if (difference < 0) {
                        clearInterval(timer);

                        if (callback) {
                            callback();
                        }

                        return;
                    }
                }

                setDuration(
                    intervalToDuration({
                        start: timestamp,
                        end: new Date(),
                    })
                );
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isActive, timestamp]);

    return (
        <Flex alignItems="center" justifyContent="center">
            <TimeIcon mr="0.5rem" boxSize={4} color="whitesmoke" />
            {isCompact ? (
                <Text>{`${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}`}</Text>
            ) : (
                <Text minWidth={displayDays ? '128px' : '70px'}>
                    {displayDays && <Text as="span">{`${duration.days} days, `}</Text>}
                    <Text as="span">
                        {`${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`}
                    </Text>
                </Text>
            )}
        </Flex>
    );
};
