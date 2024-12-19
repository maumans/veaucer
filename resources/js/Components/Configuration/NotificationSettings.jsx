import React from 'react';
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Paper,
    Divider,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

const NotificationSettings = ({ settings, onChange }) => {
    const handleChange = (key, value) => {
        onChange({
            ...settings,
            [key]: value
        });
    };

    return (
        <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
                Paramètres de notification
            </Typography>

            <Box className="space-y-4">
                {/* Email Notifications */}
                <Box>
                    <Typography variant="subtitle1" className="mb-2">
                        Notifications par email
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.email_enabled}
                                onChange={(e) => handleChange('email_enabled', e.target.checked)}
                            />
                        }
                        label="Activer les notifications par email"
                    />
                    {settings.email_enabled && (
                        <Box className="mt-2 pl-4">
                            <TextField
                                fullWidth
                                label="Email de l'expéditeur"
                                value={settings.sender_email}
                                onChange={(e) => handleChange('sender_email', e.target.value)}
                                size="small"
                                className="mb-2"
                            />
                            <TextField
                                fullWidth
                                label="Nom de l'expéditeur"
                                value={settings.sender_name}
                                onChange={(e) => handleChange('sender_name', e.target.value)}
                                size="small"
                            />
                        </Box>
                    )}
                </Box>

                <Divider />

                {/* SMS Notifications */}
                <Box>
                    <Typography variant="subtitle1" className="mb-2">
                        Notifications SMS
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.sms_enabled}
                                onChange={(e) => handleChange('sms_enabled', e.target.checked)}
                            />
                        }
                        label="Activer les notifications SMS"
                    />
                    {settings.sms_enabled && (
                        <Box className="mt-2 pl-4">
                            <FormControl fullWidth size="small">
                                <InputLabel>Fournisseur SMS</InputLabel>
                                <Select
                                    value={settings.sms_provider}
                                    onChange={(e) => handleChange('sms_provider', e.target.value)}
                                    label="Fournisseur SMS"
                                >
                                    <MenuItem value="twilio">Twilio</MenuItem>
                                    <MenuItem value="nexmo">Nexmo</MenuItem>
                                    <MenuItem value="messagebird">MessageBird</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </Box>

                <Divider />

                {/* Push Notifications */}
                <Box>
                    <Typography variant="subtitle1" className="mb-2">
                        Notifications Push
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.push_enabled}
                                onChange={(e) => handleChange('push_enabled', e.target.checked)}
                            />
                        }
                        label="Activer les notifications push"
                    />
                </Box>

                <Divider />

                {/* Notification Preferences */}
                <Box>
                    <Typography variant="subtitle1" className="mb-2">
                        Préférences de notification
                    </Typography>
                    <FormControl fullWidth size="small" className="mb-2">
                        <InputLabel>Fréquence des notifications</InputLabel>
                        <Select
                            value={settings.notification_frequency}
                            onChange={(e) => handleChange('notification_frequency', e.target.value)}
                            label="Fréquence des notifications"
                        >
                            <MenuItem value="immediate">Immédiate</MenuItem>
                            <MenuItem value="hourly">Toutes les heures</MenuItem>
                            <MenuItem value="daily">Quotidienne</MenuItem>
                            <MenuItem value="weekly">Hebdomadaire</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.digest_enabled}
                                onChange={(e) => handleChange('digest_enabled', e.target.checked)}
                            />
                        }
                        label="Activer les résumés de notification"
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default NotificationSettings;
