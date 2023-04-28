import React, { useState } from 'react';
import Quest_1 from '../assets/quests/1.jpg';
import Quest_2 from '../assets/quests/2.jpg';
import Quest_3 from '../assets/quests/3.jpg';
import Quest_4 from '../assets/quests/4.jpg';
import Ticket from '../assets/ticket.jpg';
import { createContext, useContext } from 'react';

export const QUESTS: any[] = [
    {
        id: 1,
        name: 'Scout the city',
        description: (
            <div>
                You have been drawn to explore the city, hoping to uncover its secrets. The journey will take{' '}
                <span className="Weight-700 Time-Color">30 SECONDS</span> and will require{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> to keep you focused on your path.
            </div>
        ),
        requirements: {
            energy: 1,
        },
        duration: 30,
        rewards: [
            {
                resource: 'herbs',
                name: 'Cereus',
                value: 2,
            },
        ],
    },
    {
        id: 2,
        name: 'Craft a compass',
        description: (
            <div>
                You feel disoriented after reaching a crossroads and you need to craft a compass to find your way. It
                will take <span className="Weight-700 Time-Color">30 SECONDS</span> and{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> to construct it.
            </div>
        ),
        requirements: {
            energy: 1,
        },
        duration: 30,
        rewards: [
            {
                resource: 'gems',
                name: 'Magnesite',
                value: 1,
            },
        ],
    },
    {
        id: 3,
        name: 'Decipher the blueprints',
        description: (
            <div>
                After <span className="Weight-700 Time-Color">45 SECONDS</span> of exploring the city, you come across
                an old vendor and trade <span className="Weight-700 Herbs-Color">2 HERBS</span> for the blueprints of
                Menhir. In order to decipher the blueprints you use{' '}
                <span className="Weight-700 Energy-Color">1 ENERGY</span> and{' '}
                <span className="Weight-700 Gems-Color">1 GEMS</span> to reveal the location of an ancient artifact.
            </div>
        ),
        requirements: {
            energy: 1,
            herbs: 2,
            gems: 1,
        },
        duration: 45,
        rewards: [
            {
                resource: 'essence',
                name: 'Nimbus Orb',
                value: 1,
            },
        ],
    },
    // {
    //     id: 4,
    //     name: 'Collect the artifact',
    //     description: (
    //         <div>
    //             After a journey of <span className="Weight-700 Time-Color">6 SECONDS</span>, you use{' '}
    //             <span className="Weight-700 Herbs-Color">5 HERBS</span> and{' '}
    //             <span className="Weight-700 Gems-Color">10 GEMS</span> to unlock a mysterious artifact from its sacred
    //             prison, in order to return it to its rightful place within the city.
    //         </div>
    //     ),
    //     requirements: {
    //         energy: 15,
    //         herbs: 5,
    //         gems: 10,
    //     },
    //     duration: 6,
    //     rewards: [
    //         {
    //             resource: 'herbs',
    //             name: 'Cereus',
    //             value: 5,
    //         },
    //         {
    //             resource: 'gems',
    //             name: 'Magnesite',
    //             value: 15,
    //         },
    //     ],
    // },
    {
        id: 4,
        name: 'Adraka narcotic',
        description: (
            <div>
                You use up <span className="Weight-700 Energy-Color">1 ENERGY</span> to guide yourself through the
                winding streets for <span className="Weight-700 Time-Color">60 SECONDS</span>. You encounter a secret
                society and trade <span className="Weight-700 Herbs-Color">2 HERBS</span> and{' '}
                <span className="Weight-700 Gems-Color">1 GEMS</span> for a unique item. It takes{' '}
                <span className="Weight-700 Essence-Color">1 ESSENCE OF THE DESERT</span> to safely transport the vessel
                to safety.
            </div>
        ),
        requirements: {
            energy: 1,
            herbs: 2,
            gems: 1,
            essence: 1,
        },
        duration: 60,
        rewards: [
            {
                resource: 'tickets',
                name: 'Home X Ticket',
                value: 1,
            },
        ],
        isFinal: true,
    },
];

export const getQuest = (id = 1) => {
    return QUESTS.find((m) => m.id === id);
};

export const getQuestImage = (id: any) => {
    switch (id) {
        case 1:
            return Quest_1;

        case 2:
            return Quest_2;

        case 3:
            return Quest_3;

        case 4:
            return Quest_4;

        default:
            return Ticket;
    }
};

export const meetsRequirements = (resources: { [x: string]: number }, questId: number | undefined) => {
    const quest = getQuest(questId);

    if (!quest) {
        return false;
    }

    const keys = Object.keys(quest.requirements);

    return keys.every((key) => resources[key] >= quest.requirements[key]);
};

export interface QuestsContextType {
    quest: any;
    setQuest: React.Dispatch<any>;
}

const QuestsContext = createContext<QuestsContextType | null>(null);

export const useQuestsContext = () => useContext(QuestsContext);

export const QuestsProvider = ({ children }) => {
    const [quest, setQuest] = useState(getQuest());
    return <QuestsContext.Provider value={{ quest, setQuest }}>{children}</QuestsContext.Provider>;
};
