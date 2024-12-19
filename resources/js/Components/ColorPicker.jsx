import React from 'react';
import { Box, FormControl, FormHelperText, InputLabel, TextField } from '@mui/material';

const ColorPicker = ({ label, value, onChange, error, helperText }) => {
    return (
        <FormControl fullWidth error={error}>
            <InputLabel shrink>{label}</InputLabel>
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: '50px',
                        height: '56px',
                        padding: 0,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                />
                <TextField
                    fullWidth
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    error={error}
                    placeholder="#000000"
                    size="small"
                />
            </Box>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default ColorPicker;
