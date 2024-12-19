import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    FormControlLabel,
    Switch,
    TextField,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import PanelLayout from '@/Layouts/PanelLayout';

const LoadingButton = ({ loading, children, ...props }) => (
    <Button
        {...props}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
    >
        {children}
    </Button>
);

const Show = ({ auth, societe, configuration, options }) => {
    const { data, setData, put, processing, errors } = useForm({
        modules: configuration.modules || {},
        notifications: configuration.notifications || {},
        security: configuration.security || {},
        payment_methods: configuration.payment_methods || {},
        general: configuration.general || {},
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('superAdmin.societe.configuration.update', { societe: societe.id }));
    };

    return (
        <PanelLayout user={auth.user} auth={auth} active="societeConfiguration">
            <Head title={`Configuration - ${societe.nom}`} />

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                    Configuration de {societe.nom}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Modules */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Modules
                                    </Typography>
                                    {Object.entries(options.modules_disponibles).map(([key, label]) => (
                                        <FormControlLabel
                                            key={key}
                                            control={
                                                <Switch
                                                    checked={data.modules[key] || false}
                                                    onChange={(e) =>
                                                        setData('modules', {
                                                            ...data.modules,
                                                            [key]: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label={label}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Méthodes de paiement */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Méthodes de paiement
                                    </Typography>
                                    {Object.entries(options.methodes_paiement_disponibles).map(([key, label]) => (
                                        <FormControlLabel
                                            key={key}
                                            control={
                                                <Switch
                                                    checked={data.payment_methods[key] || false}
                                                    onChange={(e) =>
                                                        setData('payment_methods', {
                                                            ...data.payment_methods,
                                                            [key]: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label={label}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Paramètres généraux */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Paramètres généraux
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Langue par défaut"
                                                value={data.general.default_language || ''}
                                                onChange={(e) =>
                                                    setData('general', {
                                                        ...data.general,
                                                        default_language: e.target.value,
                                                    })
                                                }
                                            >
                                                {Object.entries(options.langues_disponibles).map(([code, name]) => (
                                                    <MenuItem key={code} value={code}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Devise"
                                                value={data.general.currency || ''}
                                                onChange={(e) =>
                                                    setData('general', {
                                                        ...data.general,
                                                        currency: e.target.value,
                                                    })
                                                }
                                            >
                                                {Object.entries(options.devises_disponibles).map(([code, name]) => (
                                                    <MenuItem key={code} value={code}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Fuseau horaire"
                                                value={data.general.timezone || ''}
                                                onChange={(e) =>
                                                    setData('general', {
                                                        ...data.general,
                                                        timezone: e.target.value,
                                                    })
                                                }
                                            >
                                                {options.fuseaux_horaires.map((timezone) => (
                                                    <MenuItem key={timezone} value={timezone}>
                                                        {timezone}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton
                            loading={processing}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Enregistrer les modifications
                        </LoadingButton>
                    </Box>
                </form>
            </Box>
        </PanelLayout>
    );
};

export default Show;
