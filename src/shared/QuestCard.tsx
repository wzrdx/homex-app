import { Flex, Image, Text } from '@chakra-ui/react';
import { getBackgroundStyle } from '../services/helpers';
import { getQuestImage } from '../services/quests';

function QuestCard({ quest, callback }) {
    return (
        <Flex
            onClick={() => callback(quest.id)}
            style={getBackgroundStyle(getQuestImage(quest.id))}
            borderRadius="2px"
            boxShadow="1px 1px 2px rgb(0 0 0 / 40%)"
            padding={5}
            justifyContent="center"
            _notLast={{ marginBottom: 3 }}
        >
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
