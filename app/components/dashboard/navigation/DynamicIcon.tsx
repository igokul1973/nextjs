'use client';

import { links } from './constants';

export const DynamicIcon = ({ name }: { name: string }) => {
    const Component = links.find((l) => l.name === name)!.icon;

    return <Component />;
};
