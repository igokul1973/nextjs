import { FC } from 'react';

interface IProps {
    debugObject?: unknown;
}

const Debug: FC<IProps> = ({ debugObject }) => {
    return (
        <div>
            <pre>
                <code>{JSON.stringify(debugObject, null, 2)}</code>
            </pre>
        </div>
    );
};

export default Debug;
