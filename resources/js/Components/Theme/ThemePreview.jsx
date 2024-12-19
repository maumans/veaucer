import React from 'react';
import { Box, Paper, Typography, Button, Card, CardContent } from '@mui/material';

const ThemePreview = ({ theme }) => {
    const {
        couleur_primaire,
        couleur_secondaire,
        couleur_accent,
        couleur_texte,
        couleur_fond,
        police_principale,
        police_secondaire
    } = theme;

    return (
        <Paper className="p-6" style={{ backgroundColor: couleur_fond }}>
            <Typography 
                variant="h4" 
                className="mb-4"
                style={{ 
                    fontFamily: police_principale,
                    color: couleur_texte 
                }}
            >
                Aperçu du thème
            </Typography>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Boutons */}
                <Card>
                    <CardContent>
                        <Typography 
                            variant="h6" 
                            className="mb-3"
                            style={{ 
                                fontFamily: police_secondaire,
                                color: couleur_texte 
                            }}
                        >
                            Boutons
                        </Typography>
                        <Box className="space-x-2">
                            <Button 
                                variant="contained"
                                style={{ 
                                    backgroundColor: couleur_primaire,
                                    fontFamily: police_principale 
                                }}
                            >
                                Primaire
                            </Button>
                            <Button 
                                variant="contained"
                                style={{ 
                                    backgroundColor: couleur_secondaire,
                                    fontFamily: police_principale 
                                }}
                            >
                                Secondaire
                            </Button>
                            <Button 
                                variant="contained"
                                style={{ 
                                    backgroundColor: couleur_accent,
                                    fontFamily: police_principale 
                                }}
                            >
                                Accent
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Typographie */}
                <Card>
                    <CardContent>
                        <Typography 
                            variant="h6" 
                            className="mb-3"
                            style={{ 
                                fontFamily: police_secondaire,
                                color: couleur_texte 
                            }}
                        >
                            Typographie
                        </Typography>
                        <Typography 
                            variant="body1"
                            style={{ 
                                fontFamily: police_principale,
                                color: couleur_texte 
                            }}
                        >
                            Police principale: {police_principale}
                        </Typography>
                        <Typography 
                            variant="body2"
                            style={{ 
                                fontFamily: police_secondaire,
                                color: couleur_texte 
                            }}
                        >
                            Police secondaire: {police_secondaire}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Carte exemple */}
            <Card 
                className="max-w-md mx-auto"
                style={{ 
                    backgroundColor: 'white',
                    borderColor: couleur_primaire,
                    borderWidth: 1
                }}
            >
                <CardContent>
                    <Typography 
                        variant="h5"
                        className="mb-2"
                        style={{ 
                            fontFamily: police_principale,
                            color: couleur_primaire
                        }}
                    >
                        Exemple de carte
                    </Typography>
                    <Typography 
                        variant="body1"
                        style={{ 
                            fontFamily: police_secondaire,
                            color: couleur_texte
                        }}
                    >
                        Ceci est un exemple de contenu avec les couleurs et polices sélectionnées.
                    </Typography>
                    <Box className="mt-4">
                        <Button 
                            variant="contained"
                            size="small"
                            style={{ 
                                backgroundColor: couleur_primaire,
                                fontFamily: police_principale 
                            }}
                        >
                            Action
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default ThemePreview;
