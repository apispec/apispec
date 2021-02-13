import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { observer } from 'mobx-react-lite';
import { useStore } from '@apispec/report/src/components/common/StoreProvider';

import Info from './Info';

const Project = observer(() => {
    const { project } = useStore();
    const {
        name,
        title,
        description,
        version,
        plugins,
        protocol,
        ...parameters
    } = project;

    return name ? (
        <Info
            name={name}
            title={title}
            description={description}
            version={version}
            plugins={plugins}
            protocol={protocol}
            parameters={parameters}
        />
    ) : null;
});

Project.propTypes = {};

Project.defaultProps = {};

Project.displayName = 'Project';

export default Project;
