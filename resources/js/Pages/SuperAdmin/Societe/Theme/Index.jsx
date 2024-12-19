import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    IconButton,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import PanelLayout from '@/Layouts/PanelLayout';

const ThemeCard = ({ theme, societeId, onDelete }) => {
    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) {
            onDelete(theme.id);
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                        {theme.nom}
                    </Typography>
                    <Box>
                        <Link href={route('superAdmin.societe.theme.edit', { societe: societeId, theme: theme.id })}>
                            <IconButton color="primary" size="small">
                                <EditIcon />
                            </IconButton>
                        </Link>
                        {!theme.est_defaut && (
                            <IconButton color="error" size="small" onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {theme.est_defaut && (
                        <Chip
                            label="Thème par défaut"
                            color="primary"
                            size="small"
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: theme.couleur_primaire,
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {theme.derniere_mise_a_jour && `Mis à jour ${theme.derniere_mise_a_jour}`}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const Index = ({ auth, themes, societe }) => {
    const handleDelete = async (themeId) => {
        try {
            await router.delete(route('superAdmin.societe.theme.destroy', {
                societe: societe.id,
                theme: themeId
            }));
        } catch (error) {
            console.error('Erreur lors de la suppression du thème:', error);
        }
    };

    return (
        <PanelLayout user={auth.user} auth={auth} active="configuration">
            <Head title={`Thèmes - ${societe.nom}`} />

            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Thèmes de {societe.nom}
                    </Typography>

                    <Link href={route('superAdmin.societe.theme.create', { societe: societe.id })}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                        >
                            Nouveau thème
                        </Button>
                    </Link>
                </Box>

                <Grid container spacing={3}>
                    {themes.map((theme) => (
                        <Grid item xs={12} sm={6} md={4} key={theme.id}>
                            <ThemeCard
                                theme={theme}
                                societeId={societe.id}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </PanelLayout>
    );
};

export default Index;
