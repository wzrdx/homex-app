import { Box } from '@chakra-ui/react';

function Separator({ width, height }: { width: string; height: string }) {
    return (
        <Box
            width={width}
            height={height}
            background="linear-gradient(90deg, rgb(62 62 62 / 20%) 0%, rgb(150 150 150) 50%, rgb(62 62 62 / 20%) 100%)"
        ></Box>
    );
}

export default Separator;
