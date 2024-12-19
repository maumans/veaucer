import React from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControlLabel,
    Switch,
    TextField,
    Grid,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const PaymentMethodsForm = ({ settings, onChange }) => {
    const handleChange = (key, value) => {
        onChange({
            ...settings,
            [key]: value
        });
    };

    const handlePhoneNumberChange = (provider, index, value) => {
        const numbers = [...settings[`${provider}_numbers`]];
        numbers[index] = value;
        handleChange(`${provider}_numbers`, numbers);
    };

    const addPhoneNumber = (provider) => {
        const numbers = [...(settings[`${provider}_numbers`] || []), ''];
        handleChange(`${provider}_numbers`, numbers);
    };

    const removePhoneNumber = (provider, index) => {
        const numbers = settings[`${provider}_numbers`].filter((_, i) => i !== index);
        handleChange(`${provider}_numbers`, numbers);
    };

    return (
        <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
                Moyens de paiement
            </Typography>

            <Grid container spacing={4}>
                {/* Orange Money */}
                <Grid item xs={12} md={6}>
                    <Box className="mb-4">
                        <Typography variant="subtitle1" className="mb-3">
                            Orange Money
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.orange_money_enabled}
                                    onChange={(e) => handleChange('orange_money_enabled', e.target.checked)}
                                />
                            }
                            label="Activer Orange Money"
                            className="mb-3 block"
                        />

                        {settings.orange_money_enabled && (
                            <>
                                <Box className="mb-3">
                                    <Box className="flex justify-between items-center mb-2">
                                        <Typography variant="body2" color="textSecondary">
                                            Numéros de téléphone Orange Money
                                        </Typography>
                                        <Tooltip title="Ajouter un numéro">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => addPhoneNumber('orange_money')}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    {settings.orange_money_numbers?.map((number, index) => (
                                        <Box key={index} className="flex gap-2 mb-2">
                                            <TextField
                                                value={number}
                                                onChange={(e) => handlePhoneNumberChange('orange_money', index, e.target.value)}
                                                placeholder="Ex: +224 621234567"
                                                size="small"
                                                fullWidth
                                            />
                                            <IconButton 
                                                size="small"
                                                color="error"
                                                onClick={() => removePhoneNumber('orange_money', index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>

                                <TextField
                                    label="Nom du marchand"
                                    value={settings.orange_money_merchant_name}
                                    onChange={(e) => handleChange('orange_money_merchant_name', e.target.value)}
                                    fullWidth
                                    size="small"
                                    className="mb-3"
                                />

                                <TextField
                                    label="Code marchand"
                                    value={settings.orange_money_merchant_code}
                                    onChange={(e) => handleChange('orange_money_merchant_code', e.target.value)}
                                    fullWidth
                                    size="small"
                                    className="mb-3"
                                />
                            </>
                        )}
                    </Box>
                </Grid>

                {/* Mobile Money (MTN) */}
                <Grid item xs={12} md={6}>
                    <Box className="mb-4">
                        <Typography variant="subtitle1" className="mb-3">
                            Mobile Money (MTN)
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.momo_enabled}
                                    onChange={(e) => handleChange('momo_enabled', e.target.checked)}
                                />
                            }
                            label="Activer Mobile Money"
                            className="mb-3 block"
                        />

                        {settings.momo_enabled && (
                            <>
                                <Box className="mb-3">
                                    <Box className="flex justify-between items-center mb-2">
                                        <Typography variant="body2" color="textSecondary">
                                            Numéros de téléphone Mobile Money
                                        </Typography>
                                        <Tooltip title="Ajouter un numéro">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => addPhoneNumber('momo')}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    {settings.momo_numbers?.map((number, index) => (
                                        <Box key={index} className="flex gap-2 mb-2">
                                            <TextField
                                                value={number}
                                                onChange={(e) => handlePhoneNumberChange('momo', index, e.target.value)}
                                                placeholder="Ex: +224 661234567"
                                                size="small"
                                                fullWidth
                                            />
                                            <IconButton 
                                                size="small"
                                                color="error"
                                                onClick={() => removePhoneNumber('momo', index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>

                                <TextField
                                    label="Nom du marchand"
                                    value={settings.momo_merchant_name}
                                    onChange={(e) => handleChange('momo_merchant_name', e.target.value)}
                                    fullWidth
                                    size="small"
                                    className="mb-3"
                                />

                                <TextField
                                    label="Code marchand"
                                    value={settings.momo_merchant_code}
                                    onChange={(e) => handleChange('momo_merchant_code', e.target.value)}
                                    fullWidth
                                    size="small"
                                    className="mb-3"
                                />
                            </>
                        )}
                    </Box>
                </Grid>

                {/* Commission Settings */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" className="mb-3">
                        Paramètres de commission
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Commission Orange Money (%)"
                                type="number"
                                value={settings.orange_money_commission}
                                onChange={(e) => handleChange('orange_money_commission', e.target.value)}
                                fullWidth
                                size="small"
                                InputProps={{
                                    inputProps: { min: 0, max: 100, step: 0.1 }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Commission Mobile Money (%)"
                                type="number"
                                value={settings.momo_commission}
                                onChange={(e) => handleChange('momo_commission', e.target.value)}
                                fullWidth
                                size="small"
                                InputProps={{
                                    inputProps: { min: 0, max: 100, step: 0.1 }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default PaymentMethodsForm;
