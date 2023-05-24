import { useState } from 'react';
import { Flex } from '@chakra-ui/react';

export const VideoLayer = ({ source, mode }) => {
    const [fade, setFade] = useState<boolean>(false);

    return (
        <Flex layerStyle="absoluteCentered" mixBlendMode={mode} zIndex={3}>
            <video
                className="Fade-In"
                style={{ maxWidth: '120%', opacity: !fade ? 0 : 1 }}
                autoPlay={true}
                muted={true}
                loop={true}
                onPlay={() => setFade(true)}
            >
                <source src={source} type="video/webm" />
            </video>
        </Flex>
    );
};
