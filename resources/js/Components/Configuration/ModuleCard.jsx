import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Switch,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const ModuleCard = ({ module, enabled, onToggle, onConfigure }) => {
    return (
        <Card className="h-full">
            <CardContent>
                <Box className="flex justify-between items-start">
                    <div>
                        <Typography variant="h6" className="mb-2">
                            {module.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mb-4">
                            {module.description}
                        </Typography>
                    </div>
                    <Box className="flex items-center">
                        <Switch
                            checked={enabled}
                            onChange={onToggle}
                            color="primary"
                        />
                        {enabled && (
                            <Tooltip title="Configurer">
                                <IconButton onClick={onConfigure} size="small">
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>

                {enabled && module.features && (
                    <Box className="mt-4">
                        <Typography variant="subtitle2" className="mb-2">
                            Fonctionnalités incluses :
                        </Typography>
                        <ul className="list-disc pl-5 text-gray-600">
                            {module.features.map((feature, index) => (
                                <li key={index}>
                                    <Typography variant="body2">
                                        {feature}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ModuleCard;
