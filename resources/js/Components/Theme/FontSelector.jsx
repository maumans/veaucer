import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';

const fonts = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
];

const FontSelector = ({ label, value, onChange, className }) => {
    return (
        <Box className={`mb-4 ${className}`}>
            <Typography variant="subtitle1" className="mb-2 text-gray-700">
                {label}
            </Typography>
            <FormControl fullWidth>
                <Select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-white"
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300
                            }
                        }
                    }}
                >
                    {fonts.map((font) => (
                        <MenuItem 
                            key={font.value} 
                            value={font.value}
                            style={{ fontFamily: font.value }}
                        >
                            <Box className="flex items-center justify-between w-full">
                                <Typography style={{ fontFamily: font.value }}>
                                    {font.label}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    className="text-gray-500"
                                    style={{ fontFamily: font.value }}
                                >
                                    Aa Bb Cc 123
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default FontSelector;
