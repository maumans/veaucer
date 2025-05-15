import React, { useState, useEffect, useMemo } from "react";
import { useForm, router } from '@inertiajs/react';
import { Autocomplete, Button, TextField, IconButton, Tooltip } from '@mui/material';
import { MRT_Localization_FR } from "material-react-table/locales/fr/index.js";
import { DatePicker } from "@mui/x-date-pickers";
import { motion } from 'framer-motion';
import NumberFormatCustomUtils from '@/Pages/Utils/NumberFormatCustomUtils';
import formatNumber from "@/Pages/Utils/formatNumber.js";
import dayjs from 'dayjs';
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import InputError from "@/Components/InputError.jsx";
import { Delete, ArrowBack } from '@mui/icons-material';

const Edit = ({ auth, errors, operation, produits, departements, fournisseurs, caisses, typeOperations, motifs }) => {
    // Pour le débogage
    console.log('Operation reçue dans Edit:', operation);
    console.log('Produits:', produits);
    console.log('Motifs:', motifs);
    // Initialiser le formulaire avec les données de l'opération existante
    const { data, setData, put, processing, reset } = useForm({
        id: operation.id,
        date: dayjs(operation.date),
        typeOperation: operation.typeOperation,
        departementSource: operation.departementSource,
        departementDestination: operation.departementDestination,
        caisseSource: operation.caisseSource,
        caisseDestination: operation.caisseDestination,
        fournisseur: operation.fournisseur,
        produit: null,
        prixAchat: '',
        quantiteAchat: '',
        produits: operation.produits || [],
        totalProduits: operation.totalCommande || 0,
        motif: null,
        montantDepense: '',
        commentaireDepense: '',
        depenses: operation.depenses || [],
        totalDepenses: operation.totalDepense || 0,
        commentaire: operation.commentaire || '',
    });
    
    // État pour gérer les messages de succès et d'erreur
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Préparer les données pour l'envoi
        const formData = {
            id: data.id,
            date: data.date,
            typeOperation: data.typeOperation,
            fournisseur: data.fournisseur?.id || null,
            departementSource: data.departementSource,
            departementDestination: data.departementDestination,
            caisseSource: data.caisseSource,
            caisseDestination: data.caisseDestination,
            produits: data.produits,
            depenses: data.depenses,
            commentaire: data.commentaire,
        };
        
        console.log('Données envoyées au serveur:', formData);
        
        // Envoyer les données au serveur via Inertia
        put(route("admin.stock.mouvement.update", [auth.user.id, data.id]), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Mouvement mis à jour avec succès');
                // Redirection vers la page d'index après 1.5 secondes
                setTimeout(() => {
                    router.visit(route('admin.stock.mouvement.index', auth.user.id));
                }, 1500);
            },
            onError: (errors) => {
                setErrorMessage('Erreur lors de la mise à jour: ' + (errors.error || 'Veuillez vérifier les champs'));
                console.error(errors);
            }
        });
    };

    // Fonction pour ajouter un produit à la liste
    const handleAddProduit = () => {
        if (!data.produit || !data.quantiteAchat || !data.prixAchat) {
            setErrorMessage('Veuillez remplir tous les champs du produit');
            return;
        }

        // Créer un nouvel objet produit
        const newProduit = {
            id: Date.now(), // ID temporaire pour l'interface
            produit: data.produit,
            quantiteAchat: parseFloat(data.quantiteAchat),
            prixAchat: parseFloat(data.prixAchat),
            total: parseFloat(data.quantiteAchat) * parseFloat(data.prixAchat),
        };

        // Ajouter le produit à la liste et calculer le nouveau total
        const updatedProduits = [...data.produits, newProduit];
        const totalProduits = updatedProduits.reduce((total, item) => total + item.total, 0);

        // Mettre à jour l'état du formulaire
        setData({
            ...data,
            produits: updatedProduits,
            totalProduits: totalProduits,
            produit: null,
            prixAchat: '',
            quantiteAchat: '',
        });

        setErrorMessage('');
    };

    // Fonction pour supprimer un produit de la liste
    const handleRemoveProduit = (id) => {
        const updatedProduits = data.produits.filter(item => item.id !== id);
        const totalProduits = updatedProduits.reduce((total, item) => total + item.total, 0);

        setData({
            ...data,
            produits: updatedProduits,
            totalProduits: totalProduits,
        });
    };

    // Fonction pour ajouter une dépense à la liste
    const handleAddDepense = () => {
        if (!data.motif || !data.montantDepense) {
            setErrorMessage('Veuillez remplir tous les champs de la dépense');
            return;
        }

        // Créer un nouvel objet dépense
        const newDepense = {
            id: Date.now(), // ID temporaire pour l'interface
            motif: data.motif,
            montant: parseFloat(data.montantDepense),
            commentaire: data.commentaireDepense || '',
        };

        // Ajouter la dépense à la liste et calculer le nouveau total
        const updatedDepenses = [...data.depenses, newDepense];
        const totalDepenses = updatedDepenses.reduce((total, item) => total + item.montant, 0);

        // Mettre à jour l'état du formulaire
        setData({
            ...data,
            depenses: updatedDepenses,
            totalDepenses: totalDepenses,
            motif: null,
            montantDepense: '',
            commentaireDepense: '',
        });

        setErrorMessage('');
    };

    // Fonction pour supprimer une dépense de la liste
    const handleRemoveDepense = (id) => {
        const updatedDepenses = data.depenses.filter(item => item.id !== id);
        const totalDepenses = updatedDepenses.reduce((total, item) => total + item.montant, 0);

        setData({
            ...data,
            depenses: updatedDepenses,
            totalDepenses: totalDepenses,
        });
    };
    
    // Fonction pour annuler et retourner à la liste
    const handleCancel = () => {
        router.get(route('admin.stock.mouvement.index', auth.user.id));
    };

    // Configuration des colonnes pour le tableau des produits
    const columnsProduits = useMemo(() => [
        {
            accessorKey: 'produit.nom',
            header: 'Produit',
        },
        {
            accessorKey: 'quantiteAchat',
            header: 'Quantité',
            Cell: ({ cell }) => formatNumber(cell.getValue()),
        },
        {
            accessorKey: 'prixAchat',
            header: 'Prix d\'achat',
            Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF',
        },
        {
            accessorKey: 'total',
            header: 'Total',
            Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF',
        },
        {
            id: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <IconButton
                    color="error"
                    onClick={() => handleRemoveProduit(row.original.id)}
                    size="small"
                >
                    <Delete />
                </IconButton>
            ),
        },
    ], []);

    // Configuration des colonnes pour le tableau des dépenses
    const columnsDepenses = useMemo(() => [
        {
            accessorKey: 'motif.nom',
            header: 'Motif',
        },
        {
            accessorKey: 'montant',
            header: 'Montant',
            Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF',
        },
        {
            accessorKey: 'commentaire',
            header: 'Commentaire',
        },
        {
            id: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <IconButton
                    color="error"
                    onClick={() => handleRemoveDepense(row.original.id)}
                    size="small"
                >
                    <Delete />
                </IconButton>
            ),
        },
    ], []);

    // Configuration du tableau des produits
    const tableProduits = useMaterialReactTable({
        columns: columnsProduits,
        data: data.produits,
        enableColumnFilters: false,
        enableColumnActions: false,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: true,
        localization: MRT_Localization_FR,
    });

    // Configuration du tableau des dépenses
    const tableDepenses = useMaterialReactTable({
        columns: columnsDepenses,
        data: data.depenses,
        enableColumnFilters: false,
        enableColumnActions: false,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: true,
        localization: MRT_Localization_FR,
    });

    return (
        <PanelLayout
            auth={auth}
            active={'stock'}
            sousActive={'mouvement'}
            breadcrumbs={[
                {
                    text: 'Mouvement',
                    href: route('admin.stock.mouvement.index', auth.user.id),
                    active: false,
                },
                {
                    text: 'Modifier',
                    href: route('admin.stock.mouvement.edit', [auth.user.id, operation.id]),
                    active: true,
                },
            ]}
        >
            <div className="w-full">
                <div className="p-5 bg-white rounded">
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                            <h2>Modifier le mouvement de stock</h2>
                        </div>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ArrowBack />}
                            onClick={handleCancel}
                        >
                            Retour
                        </Button>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {errorMessage}
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-5"
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <DatePicker
                                        label="Date"
                                        value={data.date}
                                        onChange={(newValue) => setData('date', newValue)}
                                        slotProps={{ textField: { fullWidth: true, size: "small" } }}
                                    />
                                    <InputError message={errors.date} />
                                </div>

                                <div>
                                    <Autocomplete
                                        value={data.fournisseur}
                                        className="w-full"
                                        onChange={(e, val) => setData("fournisseur", val)}
                                        disablePortal={true}
                                        options={fournisseurs}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Fournisseur" size="small" />}
                                        size="small"
                                    />
                                    <InputError message={errors.fournisseur} />
                                </div>

                                <div>
                                    <Autocomplete
                                        value={data.departement}
                                        className="w-full"
                                        onChange={(e, val) => setData("departement", val)}
                                        disablePortal={true}
                                        options={departements}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Département" size="small" />}
                                        size="small"
                                    />
                                    <InputError message={errors.departement} />
                                </div>

                                <div>
                                    <Autocomplete
                                        value={data.caisse}
                                        className="w-full"
                                        onChange={(e, val) => setData("caisse", val)}
                                        disablePortal={true}
                                        options={caisses}
                                        getOptionLabel={(option) => option.departement.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Caisse" size="small" />}
                                        size="small"
                                    />
                                    <InputError message={errors.caisse} />
                                </div>

                                <div>
                                    <TextField
                                        value={data.commentaire}
                                        className="w-full"
                                        label="Commentaire"
                                        name="commentaire"
                                        multiline
                                        rows={2}
                                        onChange={(e) => setData("commentaire", e.target.value)}
                                        size="small"
                                    />
                                </div>

                                <div className="md:col-span-2 border p-3 rounded bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="md:col-span-3 font-bold text-orange-500 text-xl">
                                            Produits
                                        </div>

                                        <div>
                                            <Autocomplete
                                                value={data.produit}
                                                className="w-full"
                                                onChange={(e, val) => setData("produit", val)}
                                                disablePortal={true}
                                                options={produits}
                                                getOptionLabel={(option) => option.nom}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => <TextField fullWidth {...params} label="Produit" size="small" />}
                                                size="small"
                                            />
                                            <InputError message={errors.produit} />
                                        </div>

                                        <div>
                                            <TextField
                                                value={data.quantiteAchat}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustomUtils, 
                                                }}
                                                className="w-full"
                                                label="Quantité"
                                                name="quantiteAchat"
                                                onChange={(e) => setData("quantiteAchat", e.target.value)}
                                                size="small"
                                            />
                                            <InputError message={errors.quantiteAchat} />
                                        </div>

                                        <div>
                                            <TextField
                                                value={data.prixAchat}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustomUtils,
                                                    endAdornment: "GNF",
                                                }}
                                                className="w-full"
                                                label="Prix d'achat"
                                                name="prixAchat"
                                                onChange={(e) => setData("prixAchat", e.target.value)}
                                                size="small"
                                            />
                                            <InputError message={errors.prixAchat} />
                                        </div>

                                        <div className="md:col-span-3 w-fit">
                                            <Button
                                                onClick={handleAddProduit}
                                                variant="contained"
                                                sx={{ color: "white" }}
                                                color="primary"
                                                type="button"
                                                size="small"
                                            >
                                                Ajouter
                                            </Button>
                                        </div>

                                        <div className="md:col-span-3">
                                            <MaterialReactTable table={tableProduits} />
                                        </div>

                                        {data.totalProduits > 0 && (
                                            <div className="md:col-span-3 w-fit p-2 rounded bg-black text-white">
                                                {"Total: " + formatNumber(data.totalProduits) + ' GNF'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2 border p-3 rounded bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2 font-bold text-orange-500 text-xl">
                                            Dépenses supplémentaires
                                        </div>

                                        <div>
                                            <Autocomplete
                                                value={data.motif}
                                                className="w-full"
                                                onChange={(e, val) => setData("motif", val)}
                                                disablePortal={true}
                                                options={motifs}
                                                getOptionLabel={(option) => option.nom}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => <TextField fullWidth {...params} label="Motif" size="small" />}
                                                size="small"
                                            />
                                            <InputError message={errors.motif} />
                                        </div>

                                        <div className="w-full">
                                            <TextField
                                                value={data.montantDepense}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustomUtils,
                                                    endAdornment: "GNF",
                                                }}
                                                className="w-full"
                                                label="Montant"
                                                name="montantDepense"
                                                onChange={(e) => setData("montantDepense", e.target.value)}
                                                size="small"
                                            />
                                            <InputError message={errors.montantDepense} />
                                        </div>

                                        <div className="md:col-span-2">
                                            <TextField
                                                value={data.commentaireDepense}
                                                className="w-full"
                                                label="Commentaire"
                                                name="commentaireDepense"
                                                onChange={(e) => setData("commentaireDepense", e.target.value)}
                                                size="small"
                                            />
                                        </div>

                                        <div className="md:col-span-2 w-fit">
                                            <Button
                                                onClick={handleAddDepense}
                                                variant="contained"
                                                sx={{ color: "white" }}
                                                color="primary"
                                                type="button"
                                                size="small"
                                            >
                                                Ajouter
                                            </Button>
                                        </div>

                                        <div className="md:col-span-2">
                                            <MaterialReactTable table={tableDepenses} />
                                        </div>

                                        {data.totalDepenses > 0 && (
                                            <div className="md:col-span-2 w-fit p-2 rounded bg-black text-white">
                                                {"Total: " + formatNumber(data.totalDepenses) + ' GNF'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(data.totalProduits > 0 || data.totalDepenses > 0) && (
                                    <div className="md:col-span-2 w-fit p-3 rounded bg-black text-white font-bold">
                                        {"Total général: " + formatNumber(data.totalProduits + data.totalDepenses) + ' GNF'}
                                    </div>
                                )}

                                <div className="w-full md:col-span-2 flex gap-4 mt-6 py-3 px-4 bg-gray-100 rounded">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleCancel}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </PanelLayout>
    );
};

export default Edit;

