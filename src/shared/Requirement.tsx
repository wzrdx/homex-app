import { Image } from '@chakra-ui/react';
import { round } from '../services/helpers';

type RequirementProps = {
    elements: any;
    valueRequired: number;
    value: number;
};

function Requirement({ elements, valueRequired, value }: RequirementProps) {
    return (
        <div>
            <div>
                <div>
                    <div>
                        <Image width="30px" src={elements.icon} alt="Resource Icon" />

                        <div>
                            <span>{`${value >= 10000 ? '10k+' : round(value, 1)}`}</span>
                            <span>/</span>
                            <span>{valueRequired}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Requirement;
