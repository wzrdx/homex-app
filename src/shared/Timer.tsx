import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { hDisplay, mDisplay, sDisplay } from '../services/helpers';
import { differenceInSeconds, intervalToDuration } from 'date-fns';

export const Timer: FunctionComponent<
    PropsWithChildren<{
        isActive: boolean;
        timestamp: Date;
        callback?: () => void;
        isDescending?: boolean;
        isCompact?: boolean;
    }>
> = ({ isActive, timestamp, callback, isDescending = false, isCompact = false }) => {
    const [timeStaked, setTimeStaked] = useState<Duration>({
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
            setTimeStaked({
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

            setTimeStaked(
                intervalToDuration({
                    start: timestamp,
                    end: new Date(),
                })
            );

            timer = setInterval(() => {
                setTimeStaked(
                    intervalToDuration({
                        start: timestamp,
                        end: new Date(),
                    })
                );

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
                <div>{`${hDisplay(timeStaked.hours)}:${mDisplay(timeStaked.minutes)}`}</div>
            ) : (
                <div>{`${timeStaked.days} days, ${hDisplay(timeStaked.hours)}:${mDisplay(
                    timeStaked.minutes
                )}:${sDisplay(timeStaked.seconds)}`}</div>
            )}
        </Flex>
    );
};
