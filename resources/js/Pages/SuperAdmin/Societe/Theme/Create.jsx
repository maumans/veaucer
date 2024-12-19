import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import PanelLayout from '@/Layouts/PanelLayout';
import ColorPicker from '@/Components/ColorPicker';
import SnackBar from '@/Components/SnackBar';

const Create = ({ auth, societe }) => {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        couleur_primaire: '#1976d2',
        couleur_secondaire: '#9c27b0',
        couleur_accent: '#ff9800',
        couleur_texte: '#000000',
        couleur_fond: '#ffffff',
        police_principale: 'Roboto',
        police_secondaire: 'Arial',
        styles_personnalises: {},
        est_defaut: false
    });

    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('superAdmin.societe.theme.store', { societe: societe.id }), {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: 'Thème créé avec succès',
                    severity: 'success'
                });
            },
            onError: () => {
                setSnackbar({
                    open: true,
                    message: 'Une erreur est survenue',
                    severity: 'error'
                });
            }
        });
    };

    return (
        <PanelLayout user={auth.user} auth={auth} active="configuration">
            <Head title="Créer un thème" />

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                    Nouveau thème pour {societe.nom}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nom du thème"
                                        value={data.nom}
                                        onChange={e => setData('nom', e.target.value)}
                                        error={!!errors.nom}
                                        helperText={errors.nom}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <ColorPicker
                                        label="Couleur primaire"
                                        value={data.couleur_primaire}
                                        onChange={color => setData('couleur_primaire', color)}
                                        error={!!errors.couleur_primaire}
                                        helperText={errors.couleur_primaire}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <ColorPicker
                                        label="Couleur secondaire"
                                        value={data.couleur_secondaire}
                                        onChange={color => setData('couleur_secondaire', color)}
                                        error={!!errors.couleur_secondaire}
                                        helperText={errors.couleur_secondaire}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <ColorPicker
                                        label="Couleur d'accent"
                                        value={data.couleur_accent}
                                        onChange={color => setData('couleur_accent', color)}
                                        error={!!errors.couleur_accent}
                                        helperText={errors.couleur_accent}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <ColorPicker
                                        label="Couleur de texte"
                                        value={data.couleur_texte}
                                        onChange={color => setData('couleur_texte', color)}
                                        error={!!errors.couleur_texte}
                                        helperText={errors.couleur_texte}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <ColorPicker
                                        label="Couleur de fond"
                                        value={data.couleur_fond}
                                        onChange={color => setData('couleur_fond', color)}
                                        error={!!errors.couleur_fond}
                                        helperText={errors.couleur_fond}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Police principale"
                                        value={data.police_principale}
                                        onChange={e => setData('police_principale', e.target.value)}
                                        error={!!errors.police_principale}
                                        helperText={errors.police_principale}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Police secondaire"
                                        value={data.police_secondaire}
                                        onChange={e => setData('police_secondaire', e.target.value)}
                                        error={!!errors.police_secondaire}
                                        helperText={errors.police_secondaire}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.est_defaut}
                                                onChange={e => setData('est_defaut', e.target.checked)}
                                            />
                                        }
                                        label="Définir comme thème par défaut"
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={processing}
                                >
                                    Créer le thème
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            </Box>

            <SnackBar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </PanelLayout>
    );
};

export default Create;
