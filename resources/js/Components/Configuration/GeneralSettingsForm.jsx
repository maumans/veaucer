import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material';

// Fuseaux horaires d'Afrique de l'Ouest
const TIMEZONES = [
    { value: 'Africa/Conakry', label: 'Conakry (GMT+0)' },
    { value: 'Africa/Dakar', label: 'Dakar (GMT+0)' },
    { value: 'Africa/Bamako', label: 'Bamako (GMT+0)' },
    { value: 'Africa/Abidjan', label: 'Abidjan (GMT+0)' },
];

// Langues courantes en Guinée
const LANGUAGES = [
    { value: 'fr', label: 'Français' },
    { value: 'pul', label: 'Pular (Peul)' },
    { value: 'man', label: 'Maninka (Malinké)' },
    { value: 'sus', label: 'Susu (Soussou)' },
];

// Devises locales et régionales
const CURRENCIES = [
    { value: 'GNF', label: 'Franc Guinéen (GNF)', symbol: 'FG' },
    { value: 'XOF', label: 'Franc CFA (BCEAO)', symbol: 'CFA' },
    { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
    { value: 'USD', label: 'Dollar US (USD)', symbol: '$' },
];

// Formats de numéros de téléphone par pays
const PHONE_FORMATS = [
    { value: 'GN', label: 'Guinée (+224)', pattern: '+224 XX XXX XX XX' },
    { value: 'SN', label: 'Sénégal (+221)', pattern: '+221 XX XXX XX XX' },
    { value: 'ML', label: 'Mali (+223)', pattern: '+223 XX XX XX XX' },
    { value: 'CI', label: 'Côte d\'Ivoire (+225)', pattern: '+225 XX XX XX XX XX' },
];

// Régions de Guinée
const REGIONS = [
    { value: 'conakry', label: 'Conakry' },
    { value: 'boke', label: 'Boké' },
    { value: 'kindia', label: 'Kindia' },
    { value: 'mamou', label: 'Mamou' },
    { value: 'labe', label: 'Labé' },
    { value: 'kankan', label: 'Kankan' },
    { value: 'faranah', label: 'Faranah' },
    { value: 'nzerekore', label: 'Nzérékoré' },
];

const GeneralSettingsForm = ({ settings, onChange }) => {
    const handleChange = (key, value) => {
        onChange({
            ...settings,
            [key]: value
        });
    };

    return (
        <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
                Paramètres généraux
            </Typography>

            <Grid container spacing={4}>
                {/* Localisation */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="mb-3">
                        Localisation
                    </Typography>

                    <FormControl fullWidth size="small" className="mb-4">
                        <InputLabel>Fuseau horaire</InputLabel>
                        <Select
                            value={settings.timezone}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                            label="Fuseau horaire"
                        >
                            {TIMEZONES.map((timezone) => (
                                <MenuItem key={timezone.value} value={timezone.value}>
                                    {timezone.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            Le fuseau horaire sera utilisé pour tous les affichages de dates
                        </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth size="small" className="mb-4">
                        <InputLabel>Langue par défaut</InputLabel>
                        <Select
                            value={settings.default_language}
                            onChange={(e) => handleChange('default_language', e.target.value)}
                            label="Langue par défaut"
                        >
                            {LANGUAGES.map((language) => (
                                <MenuItem key={language.value} value={language.value}>
                                    {language.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            La langue principale de l'interface
                        </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth size="small" className="mb-4">
                        <InputLabel>Région</InputLabel>
                        <Select
                            value={settings.region}
                            onChange={(e) => handleChange('region', e.target.value)}
                            label="Région"
                        >
                            {REGIONS.map((region) => (
                                <MenuItem key={region.value} value={region.value}>
                                    {region.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            La région principale d'opération
                        </FormHelperText>
                    </FormControl>
                </Grid>

                {/* Monnaie et Format */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="mb-3">
                        Monnaie et Format
                    </Typography>

                    <FormControl fullWidth size="small" className="mb-4">
                        <InputLabel>Devise principale</InputLabel>
                        <Select
                            value={settings.currency}
                            onChange={(e) => handleChange('currency', e.target.value)}
                            label="Devise principale"
                        >
                            {CURRENCIES.map((currency) => (
                                <MenuItem key={currency.value} value={currency.value}>
                                    {currency.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            La devise utilisée pour les transactions
                        </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth size="small" className="mb-4">
                        <InputLabel>Format de numéro de téléphone</InputLabel>
                        <Select
                            value={settings.phone_format}
                            onChange={(e) => handleChange('phone_format', e.target.value)}
                            label="Format de numéro de téléphone"
                        >
                            {PHONE_FORMATS.map((format) => (
                                <MenuItem key={format.value} value={format.value}>
                                    {format.label} - {format.pattern}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            Le format de numéro de téléphone par défaut
                        </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <TextField
                            label="Taux de TVA (%)"
                            type="number"
                            value={settings.tva_rate}
                            onChange={(e) => handleChange('tva_rate', e.target.value)}
                            size="small"
                            InputProps={{
                                inputProps: { min: 0, max: 100, step: 0.1 }
                            }}
                            helperText="Taux de TVA appliqué aux transactions (18% en Guinée)"
                        />
                    </FormControl>
                </Grid>

                {/* Informations de contact */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" className="mb-3">
                        Informations de contact
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Adresse"
                                multiline
                                rows={3}
                                value={settings.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                fullWidth
                                size="small"
                                className="mb-3"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Email de contact"
                                type="email"
                                value={settings.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                fullWidth
                                size="small"
                                className="mb-3"
                            />
                            <TextField
                                label="Numéro de téléphone principal"
                                value={settings.contact_phone}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                fullWidth
                                size="small"
                                className="mb-3"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Paramètres fiscaux */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" className="mb-3">
                        Paramètres fiscaux
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Numéro d'identification fiscale (NIF)"
                                value={settings.nif}
                                onChange={(e) => handleChange('nif', e.target.value)}
                                fullWidth
                                size="small"
                                className="mb-3"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Registre du commerce (RCCM)"
                                value={settings.rccm}
                                onChange={(e) => handleChange('rccm', e.target.value)}
                                fullWidth
                                size="small"
                                className="mb-3"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default GeneralSettingsForm;
