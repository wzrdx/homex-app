import React from 'react';
import { Howl } from 'howler';
import { createContext, useContext, useReducer, useState } from 'react';

const OST = new Howl({
    src: ['/ost.mp3'],
    loop: true,
    volume: 0.25,
});

export interface SoundsContextType {
    areSoundsOn: boolean;
    isMusicOn: boolean;
    setAreSoundsOn: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMusicOn: React.Dispatch<any>;
    playSound: React.Dispatch<any>;
}

const SoundsContext = createContext<SoundsContextType | null>(null);
export const useSoundsContext = () => useContext(SoundsContext);

const reducer = (previousState: any, nextState: any) => {
    if (nextState) {
        OST.play();
    } else {
        OST.stop();
    }

    return nextState;
};

export const SoundsProvider = ({ children }) => {
    const [isMusicOn, setIsMusicOn] = useReducer(reducer, true);
    const [areSoundsOn, setAreSoundsOn] = useState(true);

    const volume = 0.5;

    const sound001 = new Howl({
        src: ['/001.wav'],
        volume,
    });

    const sound002 = new Howl({
        src: ['/002.wav'],
        volume,
    });

    const sound006 = new Howl({
        src: ['/006.wav'],
        volume,
    });

    const sound010 = new Howl({
        src: ['/010.wav'],
        volume,
    });

    const start = new Howl({
        src: ['/start.mp3'],
        volume,
    });

    const gameplay = new Howl({
        src: ['/gameplay.mp3'],
        volume,
    });

    const mystery = new Howl({
        src: ['/mystery.mp3'],
        volume,
    });

    const click = new Howl({
        src: ['/click.mp3'],
        volume: volume + 0.5,
    });

    const raffle = new Howl({
        src: ['/raffle.mp3'],
        volume: volume,
    });

    const swap = new Howl({
        src: ['/swap.mp3'],
        volume: volume,
    });

    const ticket = new Howl({
        src: ['/ticket.mp3'],
        volume: volume,
    });

    const playSound = (type: any) => {
        if (!areSoundsOn) {
            return;
        }

        switch (type) {
            case 'start_quest':
                start.play();
                break;

            case 'complete_quest':
                sound001.play();
                break;

            case 'stake':
                sound002.play();
                break;

            case 'unstake':
                sound010.play();
                break;

            case 'quest_log':
                gameplay.play();
                break;

            case 'navigate':
                sound006.play();
                break;

            case 'select_quest':
                click.play();
                break;

            case 'mystery':
                mystery.play();
                break;

            case 'raffle':
                raffle.play();
                break;

            case 'swap':
                swap.play();
                break;

            case 'ticket':
                ticket.play();
                break;

            default:
                break;
        }
    };

    return (
        <SoundsContext.Provider value={{ areSoundsOn, isMusicOn, setAreSoundsOn, setIsMusicOn, playSound }}>
            {children}
        </SoundsContext.Provider>
    );
};
