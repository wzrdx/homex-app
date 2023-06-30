import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { zeroPad } from '../services/helpers';
import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { isEmpty } from 'lodash';

export const Timer: FunctionComponent<
    PropsWithChildren<{
        isActive: boolean;
        timestamp: Date;
        callback?: () => void;
        isDescending?: boolean;
        isCompact?: boolean;
        displayDays?: boolean;
        displayClock?: boolean;
        customStyle?: any;
    }>
> = ({
    isActive,
    timestamp,
    callback,
    isDescending = false,
    isCompact = false,
    displayDays = false,
    displayClock = true,
    customStyle,
}) => {
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

    const isDisplayingDays = (): boolean => !!displayDays && (duration.days as number) > 0;

    return (
        <Flex alignItems="center" justifyContent="center" style={!isEmpty(customStyle) ? customStyle : {}}>
            {displayClock && <TimeIcon mr="0.5rem" boxSize={4} color="whitesmoke" />}

            {isCompact ? (
                <Text>{`${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}`}</Text>
            ) : (
                <Text>
                    {isDisplayingDays() && (
                        <Text as="span">{`${duration.days} day${(duration.days as number) > 1 ? 's' : ''}, `}</Text>
                    )}

                    <Text as="span">
                        {`${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`}
                    </Text>
                </Text>
            )}
        </Flex>
    );
};
