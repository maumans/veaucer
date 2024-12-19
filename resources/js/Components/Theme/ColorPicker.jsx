import React from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { SketchPicker } from 'react-color';
import { Popover } from '@headlessui/react';
import { ColorLensOutlined } from '@mui/icons-material';

const ColorPicker = ({ label, color, onChange, defaultColor }) => {
    return (
        <Box className="mb-4">
            <Typography variant="subtitle1" className="mb-2 text-gray-700">
                {label}
            </Typography>
            <Popover className="relative">
                <Popover.Button as={Box} className="inline-block">
                    <Paper 
                        elevation={2} 
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <Box 
                            className="w-8 h-8 rounded border border-gray-200 mr-2"
                            style={{ backgroundColor: color || defaultColor }}
                        />
                        <Typography className="text-sm text-gray-600">
                            {color || defaultColor}
                        </Typography>
                        <Tooltip title="Choisir une couleur">
                            <IconButton size="small" className="ml-2">
                                <ColorLensOutlined />
                            </IconButton>
                        </Tooltip>
                    </Paper>
                </Popover.Button>

                <Popover.Panel className="absolute z-50 mt-2">
                    <SketchPicker
                        color={color || defaultColor}
                        onChange={(color) => onChange(color.hex)}
                        disableAlpha
                    />
                </Popover.Panel>
            </Popover>
        </Box>
    );
};

export default ColorPicker;
