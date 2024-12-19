import React from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControlLabel,
    Switch,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Grid,
} from '@mui/material';

const SecurityForm = ({ settings, onChange }) => {
    const handleChange = (key, value) => {
        onChange({
            ...settings,
            [key]: value
        });
    };

    return (
        <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
                Paramètres de sécurité
            </Typography>

            <Grid container spacing={4}>
                {/* Authentication */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="mb-3">
                        Authentification
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.two_factor_auth}
                                onChange={(e) => handleChange('two_factor_auth', e.target.checked)}
                            />
                        }
                        label="Authentification à deux facteurs"
                        className="mb-2 block"
                    />

                    <FormControl fullWidth size="small" className="mb-3">
                        <InputLabel>Méthode 2FA</InputLabel>
                        <Select
                            value={settings.two_factor_method}
                            onChange={(e) => handleChange('two_factor_method', e.target.value)}
                            label="Méthode 2FA"
                            disabled={!settings.two_factor_auth}
                        >
                            <MenuItem value="app">Application d'authentification</MenuItem>
                            <MenuItem value="sms">SMS</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.single_session}
                                onChange={(e) => handleChange('single_session', e.target.checked)}
                            />
                        }
                        label="Session unique par utilisateur"
                        className="mb-2 block"
                    />
                </Grid>

                {/* Password Policy */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="mb-3">
                        Politique de mot de passe
                    </Typography>

                    <Box className="mb-3">
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Longueur minimale du mot de passe
                        </Typography>
                        <Slider
                            value={settings.password_min_length}
                            onChange={(_, value) => handleChange('password_min_length', value)}
                            min={6}
                            max={32}
                            step={1}
                            marks
                            valueLabelDisplay="auto"
                        />
                    </Box>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.password_requires_uppercase}
                                onChange={(e) => handleChange('password_requires_uppercase', e.target.checked)}
                            />
                        }
                        label="Exiger une majuscule"
                        className="mb-2 block"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.password_requires_number}
                                onChange={(e) => handleChange('password_requires_number', e.target.checked)}
                            />
                        }
                        label="Exiger un chiffre"
                        className="mb-2 block"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.password_requires_symbol}
                                onChange={(e) => handleChange('password_requires_symbol', e.target.checked)}
                            />
                        }
                        label="Exiger un caractère spécial"
                        className="mb-2 block"
                    />
                </Grid>

                {/* Session Security */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="mb-3">
                        Sécurité des sessions
                    </Typography>

                    <Box className="mb-3">
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Durée maximale de session (heures)
                        </Typography>
                        <TextField
                            type="number"
                            value={settings.session_lifetime}
                            onChange={(e) => handleChange('session_lifetime', parseInt(e.target.value))}
                            size="small"
                            fullWidth
                        />
                    </Box>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.force_ssl}
                                onChange={(e) => handleChange('force_ssl', e.target.checked)}
                            />
                        }
                        label="Forcer HTTPS"
                        className="mb-2 block"
                    />
                </Grid>

                {/* IP Security */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="mb-3">
                        Sécurité IP
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.ip_restriction}
                                onChange={(e) => handleChange('ip_restriction', e.target.checked)}
                            />
                        }
                        label="Restriction par IP"
                        className="mb-2 block"
                    />

                    <TextField
                        label="IPs autorisées"
                        value={settings.allowed_ips}
                        onChange={(e) => handleChange('allowed_ips', e.target.value)}
                        helperText="Séparez les IPs par des virgules"
                        size="small"
                        fullWidth
                        disabled={!settings.ip_restriction}
                        className="mb-3"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.brute_force_protection}
                                onChange={(e) => handleChange('brute_force_protection', e.target.checked)}
                            />
                        }
                        label="Protection contre les attaques par force brute"
                        className="mb-2 block"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SecurityForm;
