import React, { useMemo } from 'react';
import {MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import PanelLayout from '@/Layouts/PanelLayout'; // Assure-toi que le chemin est correct
import formatNumber from '@/Pages/Utils/formatNumber';
import dayjs from "dayjs"; // Si tu as une fonction de formatage de nombre

const Show = ({ auth, appro }) => {
    // Configuration des colonnes pour les commandes
    const columnsCommandes = useMemo(() => [
        {
            accessorKey: 'produit.nom', // Accès au nom du produit
            header: 'Produit',
        },
        {
            accessorKey: 'quantite',
            header: 'Quantité',
        },
        {
            accessorKey: 'prixAchat',
            header: "Prix d'achat",
            Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF', // Format du prix
        },
    ], []);

    // Configuration des colonnes pour les dépenses
    const columnsDepenses = useMemo(() => [
        {
            accessorKey: 'motif.libelle', // Accès au motif
            header: 'Motif',
        },
        {
            accessorKey: 'montant',
            header: 'Montant',
            Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF', // Format du montant
        },
    ], []);

    // Configurer le tableau des commandes
    const tableCommandes = useMaterialReactTable({
        columns: columnsCommandes,
        data: appro.commandes,
        localization: MRT_Localization_FR,
    });

    // Configurer le tableau des dépenses
    const tableDepenses = useMaterialReactTable({
        columns: columnsDepenses,
        data: appro.depenses,
        localization: MRT_Localization_FR,
    });

    return (
        <PanelLayout
            auth={auth}
            active="stock"
            sousActive="mouvement"
            breadcrumbs={[
                {
                    text: 'Mouvement',
                    href: route('admin.mouvement.index', auth.user.id),
                    active: false,
                },
                {
                    text: 'Détail',
                    href: route('admin.mouvement.show', [auth.user.id, appro.id]),
                    active: true,
                },
            ]}
        >
            <div className="w-full">
                <div className="p-5 bg-white rounded">
                    <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                        <h2 >Détail de l'approvisionnement</h2>
                    </div>

                    <div className="mt-5 space-y-20">
                        <div className="flex justify-between items-center">
                            <div>
                                <strong>Date :</strong> {dayjs(appro.date).format('DD/MM/YYYY')}
                            </div>
                            <div>
                                <strong>Fournisseur :</strong> {appro.fournisseur.nom}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-orange-500">Produits commandés</h3>
                            <MaterialReactTable table={tableCommandes} />
                            {appro.totalCommande ? (
                                <div className="mt-3 text-black font-bold bg-gray-200 p-2 rounded">
                                    {"Total Commande : " + formatNumber(appro.totalCommande) + ' GNF'}
                                </div>
                            ):''}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-orange-500">Dépenses supplémentaires</h3>
                            <MaterialReactTable table={tableDepenses} />
                            {appro.totalDepense ? (
                                <div className="mt-3 text-black font-bold bg-gray-200 p-2 rounded">
                                    {"Total Dépenses : " + formatNumber(appro.totalDepense) + ' GNF'}
                                </div>
                            ):''}
                        </div>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
};

export default Show;
