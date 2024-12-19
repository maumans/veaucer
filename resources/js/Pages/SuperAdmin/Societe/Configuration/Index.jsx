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
    Stack,
} from '@mui/material';
import { Settings as SettingsIcon, Palette as PaletteIcon } from '@mui/icons-material';
import PanelLayout from '@/Layouts/PanelLayout';

const SocieteCard = ({ societe }) => (
    <Card>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div">
                    {societe.nom}
                </Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="center">
                <Link href={route('superAdmin.societe.configuration.show', { societe: societe.id })}>
                    <Button
                        variant="contained"
                        startIcon={<SettingsIcon />}
                        color="primary"
                        fullWidth
                    >
                        Configuration
                    </Button>
                </Link>
                <Link href={route('superAdmin.societe.theme.index', { societe: societe.id })}>
                    <Button
                        variant="contained"
                        startIcon={<PaletteIcon />}
                        color="secondary"
                        fullWidth
                    >
                        Thèmes
                    </Button>
                </Link>
            </Stack>
        </CardContent>
    </Card>
);

const Index = ({ auth, societes }) => {
    return (
        <PanelLayout user={auth.user} auth={auth} active="configuration">
            <Head title="Gestion des sociétés" />

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                    Gestion des sociétés
                </Typography>

                <Grid container spacing={3}>
                    {societes.map((societe) => (
                        <Grid item xs={12} sm={6} md={4} key={societe.id}>
                            <SocieteCard societe={societe} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </PanelLayout>
    );
};

export default Index;