import React from "react";
import { useForm, usePage } from '@inertiajs/react';
import { Autocomplete, Button, TextField } from '@mui/material';
import {MRT_Localization_FR} from "material-react-table/locales/fr/index.js";
import {DatePicker} from "@mui/x-date-pickers";
import { motion } from 'framer-motion';
import NumberFormatCustomUtils from '@/Pages/Utils/NumberFormatCustomUtils';
import formatNumber from "@/Pages/Utils/formatNumber.js";
import dayjs from 'dayjs';
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import InputError from "@/Components/InputError.jsx";

const Edit = ({auth, errors, successSt, errorSt,appro}) => {

    const { data, setData, post } = useForm({
        date: appro.date || '',
        departement: null,
        caisse: null,
        fournisseur: null,
        produit: null,
        prixAchat: '',
        quantite: '',
        commandes: [],
        totalCommande: 0,
        motif: null,
        montantDepense: '',
        depenses: [],
        totalDepense: 0,
        enregistrer: false,
    });

    const departements = appro.departements || [];
    const caisses = appro.caisses || [];
    const fournisseurs = appro.fournisseurs || [];
    const produits = appro.produits || [];
    const motifs = appro.motifs || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.stockAppro.store"), { preserveScroll: true });
    };

    const handleAddToCommande = () => {
        // Ajouter la logique pour ajouter un produit à la commande
        const newCommande = {
            produit: data.produit,
            prixAchat: data.prixAchat,
            quantite: data.quantite,
            total: parseFloat(data.prixAchat) * parseFloat(data.quantite),
        };
        const updatedCommandes = [...data.commandes, newCommande];
        const totalCommande = updatedCommandes.reduce((total, item) => total + item.total, 0);

        setData({
            ...data,
            commandes: updatedCommandes,
            totalCommande: totalCommande,
            produit: null,
            prixAchat: '',
            quantite: '',
        });
    };

    const handleAddToDepense = () => {
        // Ajouter la logique pour ajouter une dépense supplémentaire
        const newDepense = {
            motif: data.motif,
            montant: data.montantDepense,
        };
        const updatedDepenses = [...data.depenses, newDepense];
        const totalDepense = updatedDepenses.reduce((total, item) => total + parseFloat(item.montant), 0);

        setData({
            ...data,
            depenses: updatedDepenses,
            totalDepense: totalDepense,
            motif: null,
            montantDepense: '',
        });
    };

    const table = useMaterialReactTable({
        columns: [
            {
                accessorKey: 'produit.nom',
                header: 'Produit',
            },
            {
                accessorKey: 'prixAchat',
                header: 'Prix d\'achat',
            },
            {
                accessorKey: 'quantite',
                header: 'Quantité',
            },
            {
                accessorKey: 'total',
                header: 'Total',
            },
        ],
        data: data.commandes,
        state: { showProgressBars: false },
        localization: MRT_Localization_FR,
    });

    const tableDepense = useMaterialReactTable({
        columns: [
            {
                accessorKey: 'motif.nom',
                header: 'Motif',
            },
            {
                accessorKey: 'montant',
                header: 'Montant',
            },
        ],
        data: data.depenses,
        state: { showProgressBars: false },
        localization: MRT_Localization_FR,
    });

    return (
        <PanelLayout
            auth={auth}
            success={successSt}
            error={errorSt}
            active={'stock'}
            sousActive={'appro'}
            breadcrumbs={[
                {
                    text: "Appro",
                    href: route("admin.stockAppro.index", auth.user.id),
                    active: false,
                },
                {
                    text: "Création",
                    href: route("admin.stockAppro.create", [auth.user.id]),
                    active: true,
                }
            ]}
        >
            <div>
                <div className="w-full">
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                        }}
                        style={{ width: '100%' }}
                    >
                        <form onSubmit={handleSubmit} className={"w-full space-y-5 gap-5 rounded bg-white p-5"}>
                            {/* Section d'informations générales */}
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className="w-full">
                                    <div className="md:col-span-2 font-bold text-orange-500">Date de la commande</div>
                                    <DatePicker
                                        className="w-full"
                                        openTo="day"
                                        views={['year', 'month', 'day']}
                                        format={'DD/MM/YYYY'}
                                        value={data.date}
                                        onChange={(newValue) => setData("date", newValue)}
                                    />
                                </div>

                                <div>
                                    <div className="md:col-span-2 font-bold text-orange-500">Stock à approvisionner</div>
                                    <Autocomplete
                                        value={data.departement}
                                        className="w-full"
                                        onChange={(e, val) => setData("departement", val)}
                                        disablePortal={true}
                                        options={departements}
                                        getOptionLabel={(option) => "Stock " + option.nom}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Stock" required />}
                                    />
                                    <InputError message={errors.departement} />
                                </div>

                                <div>
                                    <div className="md:col-span-2 font-bold text-orange-500">Caisse de paiement</div>
                                    <Autocomplete
                                        value={data.caisse}
                                        className="w-full"
                                        onChange={(e, val) => setData("caisse", val)}
                                        disablePortal={true}
                                        options={caisses}
                                        getOptionLabel={(option) => "Caisse dep. " + option.departement.nom}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Caisse" required />}
                                    />
                                    <InputError message={errors.caisse} />
                                    {data.caisse && (
                                        <div className="text-orange-500 font-bold mt-5">Solde: {formatNumber(data.caisse.solde) + ' GNF'}</div>
                                    )}
                                </div>

                                <div>
                                    <div className="md:col-span-2 font-bold text-orange-500">Fournisseur</div>
                                    <Autocomplete
                                        value={data.fournisseur}
                                        className="w-full"
                                        onChange={(e, val) => setData("fournisseur", val)}
                                        disablePortal={true}
                                        options={fournisseurs}
                                        getOptionLabel={(option) => option.nom}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Fournisseur" required />}
                                    />
                                    <InputError message={errors.fournisseur} />
                                </div>
                            </div>

                            {/* Section d'ajout des produits */}
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className="md:col-span-2 font-bold text-orange-500 text-xl">Ajout des produits</div>

                                <div className="md:col-span-2">
                                    <MaterialReactTable table={table} />
                                </div>

                                {data.totalCommande && (
                                    <div className="md:col-span-2 w-fit p-2 rounded bg-black text-white">
                                        {"Total: " + formatNumber(data.totalCommande) + ' GNF'}
                                    </div>
                                )}

                                <div>
                                    <Autocomplete
                                        value={data.produit}
                                        className="w-full"
                                        onChange={(e, val) => setData("produit", val)}
                                        disablePortal={true}
                                        options={produits}
                                        getOptionLabel={(option) => option.nom}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Produit" />}
                                    />
                                    <InputError message={errors.produit} />
                                </div>

                                <div className="w-full">
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
                                    />
                                    <InputError message={errors.prixAchat} />
                                </div>

                                <div className="w-full">
                                    <TextField
                                        value={data.quantite}
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                        }}
                                        className="w-full"
                                        label="Quantité"
                                        name="quantite"
                                        onChange={(e) => setData("quantite", e.target.value)}
                                    />
                                    <InputError message={errors.quantite} />
                                </div>

                                <div className="md:col-span-2 w-fit">
                                    <Button
                                        onClick={handleAddToCommande}
                                        variant="contained"
                                        sx={{ color: "white" }}
                                        color="primary"
                                        type="button"
                                    >
                                        Ajouter
                                    </Button>
                                </div>
                            </div>

                            {/* Section des dépenses supplémentaires */}
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className="md:col-span-2 font-bold text-orange-500 text-xl">Dépenses supplémentaires</div>

                                <div className="md:col-span-2">
                                    <MaterialReactTable table={tableDepense} />
                                </div>

                                {data.totalDepense && (
                                    <div className="md:col-span-2 w-fit p-2 rounded bg-black text-white">
                                        {"Total: " + formatNumber(data.totalDepense) + ' GNF'}
                                    </div>
                                )}

                                <div>
                                    <Autocomplete
                                        value={data.motif}
                                        className="w-full"
                                        onChange={(e, val) => setData("motif", val)}
                                        disablePortal={true}
                                        options={motifs}
                                        getOptionLabel={(option) => option.nom}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Motif" />}
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
                                    />
                                    <InputError message={errors.montantDepense} />
                                </div>

                                <div className="md:col-span-2 w-fit">
                                    <Button
                                        onClick={handleAddToDepense}
                                        variant="contained"
                                        sx={{ color: "white" }}
                                        color="primary"
                                        type="button"
                                    >
                                        Ajouter
                                    </Button>
                                </div>
                            </div>

                            {/* Section des actions du formulaire */}
                            <div className="w-full md:col-span-2 flex gap-4 mt-10 py-2 px-1 bg-gray-100 rounded">
                                <Button
                                    onClick={() => setData('enregistrer', false)}
                                    variant="contained"
                                    sx={{ color: "white" }}
                                    color="primary"
                                    type="submit"
                                >
                                    Enregistrer & recevoir
                                </Button>

                                <Button
                                    onClick={() => setData('enregistrer', true)}
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </PanelLayout>
    );
};

export default Edit;

