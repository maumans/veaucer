import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    TextField,
    Switch,
    FormControlLabel,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import PanelLayout from '@/Layouts/PanelLayout';

const ColorField = ({ label, value, onChange }) => {
    const [showPicker, setShowPicker] = React.useState(false);

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    onClick={() => setShowPicker(!showPicker)}
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: value,
                        cursor: 'pointer',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                />
                <TextField
                    size="small"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ width: 120 }}
                />
            </Box>
            {showPicker && (
                <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                    <Box
                        sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                        onClick={() => setShowPicker(false)}
                    />
                    <ChromePicker
                        color={value}
                        onChange={(color) => onChange(color.hex)}
                    />
                </Box>
            )}
        </Box>
    );
};

const LoadingButton = ({ loading, children, ...props }) => (
    <Button
        {...props}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
    >
        {children}
    </Button>
);

const Edit = ({ auth, theme, societe, preview }) => {
    const { data, setData, put, processing, errors } = useForm({
        nom: theme.nom,
        couleur_primaire: theme.couleur_primaire,
        couleur_secondaire: theme.couleur_secondaire,
        couleur_accent: theme.couleur_accent,
        couleur_texte: theme.couleur_texte,
        couleur_fond: theme.couleur_fond,
        police_principale: theme.police_principale,
        police_secondaire: theme.police_secondaire,
        styles_personnalises: theme.styles_personnalises || {},
        est_defaut: theme.est_defaut,
        actif: theme.actif
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('superAdmin.societe.theme.update', { societe: societe.id, theme: theme.id }), {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: 'Thème mis à jour avec succès',
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

    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });

    return (
        <PanelLayout auth={auth} active="configuration">
            <Head title={`Modifier le thème - ${theme.nom}`} />

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                    Modifier le thème {theme.nom}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 3 }}>
                                        Informations générales
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        label="Nom du thème"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        error={!!errors.nom}
                                        helperText={errors.nom}
                                        sx={{ mb: 2 }}
                                    />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.est_defaut}
                                                onChange={(e) => setData('est_defaut', e.target.checked)}
                                            />
                                        }
                                        label="Thème par défaut"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.actif}
                                                onChange={(e) => setData('actif', e.target.checked)}
                                            />
                                        }
                                        label="Thème actif"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 3 }}>
                                        Couleurs
                                    </Typography>

                                    <ColorField
                                        label="Couleur primaire"
                                        value={data.couleur_primaire}
                                        onChange={(value) => setData('couleur_primaire', value)}
                                    />

                                    <ColorField
                                        label="Couleur secondaire"
                                        value={data.couleur_secondaire}
                                        onChange={(value) => setData('couleur_secondaire', value)}
                                    />

                                    <ColorField
                                        label="Couleur d'accent"
                                        value={data.couleur_accent}
                                        onChange={(value) => setData('couleur_accent', value)}
                                    />

                                    <ColorField
                                        label="Couleur de texte"
                                        value={data.couleur_texte}
                                        onChange={(value) => setData('couleur_texte', value)}
                                    />

                                    <ColorField
                                        label="Couleur de fond"
                                        value={data.couleur_fond}
                                        onChange={(value) => setData('couleur_fond', value)}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {preview && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Aperçu des styles
                            </Typography>
                            <Box sx={{ 
                                p: 2, 
                                borderRadius: 1,
                                bgcolor: data.couleur_fond,
                                color: data.couleur_texte
                            }}>
                                <Typography variant="h5" sx={{ color: data.couleur_primaire }}>
                                    Exemple de titre
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Ceci est un exemple de texte pour visualiser le rendu des couleurs et des polices.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    sx={{ 
                                        mt: 2,
                                        bgcolor: data.couleur_primaire,
                                        '&:hover': {
                                            bgcolor: data.couleur_secondaire
                                        }
                                    }}
                                >
                                    Bouton d'exemple
                                </Button>
                            </Box>
                        </Box>
                    )}

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

            <SnackBar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </PanelLayout>
    );
};

export default Edit;
