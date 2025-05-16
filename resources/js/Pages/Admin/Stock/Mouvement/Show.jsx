import React, { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import PanelLayout from '@/Layouts/PanelLayout';
import formatNumber from '@/Pages/Utils/formatNumber';
import dayjs from "dayjs";
import { Button } from '@mui/material';
import { router } from '@inertiajs/react';

const Show = ({ auth, operation }) => {
    // Pour le débogage
    console.log('Operation reçue:', operation);
    // Configuration des colonnes pour les produits
    const columnsProduits = useMemo(() => [
        {
            accessorKey: 'produit.nom',
            header: 'Produit',
        },
        {
            accessorKey: 'quantiteAchat',
            header: 'Quantité',
        },
        {
            accessorKey: 'prixAchat',
            header: "Prix d'achat",
            Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF',
        },
        {
            accessorKey: 'total',
            header: "Total",
            Cell: ({ row }) => formatNumber(row.original.quantiteAchat * row.original.prixAchat) + ' GNF',
        },
    ], []);

    // Configuration des colonnes pour les dépenses
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
    ], []);

    // Configurer le tableau des produits
    const tableProduits = useMaterialReactTable({
        columns: columnsProduits,
        data: operation?.produits || [],
        localization: MRT_Localization_FR,
        enableColumnFilters: false,
        enableColumnActions: false,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: true,
        initialState: {
            density: 'compact',
            showColumnFilters: false,
        },
    });

    // Configurer le tableau des dépenses
    const tableDepenses = useMaterialReactTable({
        columns: columnsDepenses,
        data: operation?.depenses || [],
        localization: MRT_Localization_FR,
        enableColumnFilters: false,
        enableColumnActions: false,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: true,
        initialState: {
            density: 'compact',
            showColumnFilters: false,
        },
    });

    // Fonction pour retourner à la liste des mouvements
    const handleRetour = () => {
        router.get(route('admin.stock.mouvement.index', auth.user.id));
    };

    // Fonction pour éditer le mouvement
    const handleEdit = () => {
        router.get(route('admin.stock.mouvement.edit', [auth.user.id, operation.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active="stock"
            sousActive="mouvement"
            breadcrumbs={[
                {
                    text: 'Mouvement',
                    href: route('admin.stock.mouvement.index', auth.user.id),
                    active: false,
                },
                {
                    text: 'Détail',
                    href: route('admin.stock.mouvement.show', [auth.user.id, operation.id]),
                    active: true,
                },
            ]}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border'}>
                <div className="p-5 bg-white rounded">
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                            <h2>Détail du mouvement de stock</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEdit}
                            >
                                Modifier
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleRetour}
                            >
                                Retour
                            </Button>
                        </div>
                    </div>

                    <div className="mt-5 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded">
                            <div>
                                <strong>Date :</strong> {dayjs(operation?.date).format('DD/MM/YYYY')}
                            </div>
                            <div>
                                <strong>Fournisseur :</strong> {operation?.fournisseur?.nom || 'Non spécifié'}
                            </div>
                            <div>
                                <strong>Type d'opération :</strong> {operation?.typeOperation?.nom || 'Non spécifié'}
                            </div>
                            {operation?.departementSource && (
                                <div>
                                    <strong>Département source :</strong> {operation.departementSource.nom}
                                </div>
                            )}
                            {operation?.departementDestination && (
                                <div>
                                    <strong>Département destination :</strong> {operation.departementDestination.nom}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-bold text-orange-500 mb-2">Produits</h3>
                        <MaterialReactTable table={tableProduits} />
                        {operation?.totalCommande ? (
                            <div className="mt-3 text-black font-bold bg-gray-200 p-2 rounded">
                                {"Total : " + formatNumber(operation.totalCommande) + ' GNF'}
                            </div>
                        ) : ''}
                    </div>

                    {operation?.depenses && operation.depenses.length > 0 && (
                        <div className="bg-white p-4 rounded shadow overflow-hidden">
                            <h3 className="text-lg font-bold text-orange-500 mb-2">Dépenses supplémentaires</h3>
                            <MaterialReactTable table={tableDepenses} />
                            {operation?.totalDepense ? (
                                <div className="mt-3 text-black font-bold bg-gray-200 p-2 rounded">
                                    {"Total Dépenses : " + formatNumber(operation.totalDepense) + ' GNF'}
                                </div>
                            ) : ''}
                        </div>
                    )}

                    {/* Total général */}
                    <div className="mt-4 p-3 bg-black text-white font-bold rounded w-fit">
                        Total général : {formatNumber((operation?.totalCommande || 0) + (operation?.totalDepense || 0))} GNF
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
};

export default Show;
