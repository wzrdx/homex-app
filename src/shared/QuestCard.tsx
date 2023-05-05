import { Flex, Image, Text } from '@chakra-ui/react';
import { getBackgroundStyle } from '../services/helpers';
import { getQuestImage } from '../services/quests';

function QuestCard({ quest, callback }) {
    return (
        <Flex onClick={() => callback(quest.id)} style={getBackgroundStyle(getQuestImage(quest.id))}>
            <div>
                <div className="Flex-Center-All Relative">
                    <div>{quest.name}</div>
                    <div></div>
                </div>
            </div>

            <div></div>
        </Flex>
    );
}

export default QuestCard;
