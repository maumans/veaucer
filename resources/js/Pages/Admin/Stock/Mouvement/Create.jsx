import React, { useEffect, useMemo, useState } from 'react';
import {
    Autocomplete,
    Button,
    TextareaAutosize,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Typography,
    Box
} from "@mui/material";
import { motion } from "framer-motion";

import InputError from "@/Components/InputError";
import { router, useForm } from "@inertiajs/react";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
    ArrowBack,
    Check,
    Close,
    Delete,
    Edit,
    Visibility,
    NavigateNext,
    NavigateBefore
} from "@mui/icons-material";
import { MRT_Localization_FR } from "material-react-table/locales/fr/index.js";
import { formatNumber } from "chart.js/helpers";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';

function Create({ auth, produits, departements, departementPrincipal, caisses, caissePrincipale, motifsEntrees, motifsSorties, motifsTransferts, motifsDepenses, motifEntreeDefaut, motifSortieDefaut, motifTransfertDefaut, fournisseurs, fournisseurPrincipal, devises, uniteMesures, errors, success, error, referentiels, typeOperations, typeOperation, mouvement }) {

    // Étapes du formulaire
    const steps = [
        'Informations générales',
        'Sélection des produits',
        'Détails des produits',
        'Dépenses supplémentaires',
        'Récapitulatif'
    ];

    const [activeStep, setActiveStep] = useState(0);
    const navigationOccurredRef = React.useRef(false);

    const handleNext = () => {
        navigationOccurredRef.current = true; // Signaler que la navigation est en cours
        // Annuler les timeouts en attente et réinitialiser les refs
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
            fieldValuesRef.current = {};
            updateTimeoutRef.current = null;
        }
        if (depenseUpdateTimeoutRef.current) {
            clearTimeout(depenseUpdateTimeoutRef.current);
            depenseFieldValuesRef.current = {};
            depenseUpdateTimeoutRef.current = null;
        }

        const nextStep = activeStep + 1;
        const isEnteringSummaryStep = (
            (data.typeOperation?.nom === "entrée" && nextStep === 4) ||
            (data.typeOperation?.nom !== "entrée" && nextStep === 3)
        );

        setActiveStep(nextStep); // Déplacé plus haut

        if (isEnteringSummaryStep) {
            let newTotalOperation = 0;
            let newOperationData = [];

            if (data.operations && data.operations.length > 0) {
                data.operations.forEach((op) => {
                    const prixAchat = parseFloat(data[`prixAchat.${op.id}`] || 0);
                    const quantiteAchat = parseFloat(data[`quantiteAchat.${op.id}`] || 0);

                    if (data.typeOperation?.nom === "entrée") {
                        if (quantiteAchat > 0 && prixAchat > 0) {
                            newTotalOperation += prixAchat * quantiteAchat;
                            newOperationData.push({
                                id: op.id,
                                produit_id: op.produit_id,
                                produit_nom: op.produit_nom,
                                type_produit_id: data.typeProduitGlobal,
                                prixAchat: prixAchat,
                                quantiteAchat: quantiteAchat,
                            });
                        }
                    } else if (data.typeOperation?.nom === "sortie" || data.typeOperation?.nom === "transfert") {
                        if (quantiteAchat > 0) {
                            newOperationData.push({
                                id: op.id,
                                produit_id: op.produit_id,
                                produit_nom: op.produit_nom,
                                quantiteAchat: quantiteAchat,
                                // Pas de prix d'achat ou de total pour sorties/transferts ici, géré côté serveur si besoin
                            });
                        }
                    }
                });
            }

            let newTotalDepense = 0;
            let newDepenseData = [];
            if (data.typeOperation?.nom === "entrée" && data.depenses && data.depenses.length > 0) {
                data.depenses.forEach((dep) => {
                    const montant = parseFloat(data[`montantDepense.${dep.id}`] || 0);
                    if (montant > 0) {
                        newTotalDepense += montant;
                        newDepenseData.push({
                            id: dep.id,
                            motif_id: dep.motif_id,
                            motif: dep.motif,
                            montant: montant,
                            commentaire: data[`commentaire.${dep.id}`] || '',
                        });
                    }
                });
            }

            setData(prevData => ({
                ...prevData,
                operationData: newOperationData,
                totalOperation: newTotalOperation,
                depenseData: newDepenseData,
                totalDepense: newTotalDepense,
                total: newTotalOperation + newTotalDepense,
            }));
        }

        // setActiveStep(nextStep); // Déplacé plus haut
    };

    const handleBack = () => {
        navigationOccurredRef.current = true; // Signaler que la navigation est en cours
        // Annuler les timeouts en attente et réinitialiser les refs
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
            fieldValuesRef.current = {};
            updateTimeoutRef.current = null;
        }
        if (depenseUpdateTimeoutRef.current) {
            clearTimeout(depenseUpdateTimeoutRef.current);
            depenseFieldValuesRef.current = {};
            depenseUpdateTimeoutRef.current = null;
        }

        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const { data, setData, processing } = useForm({
        "date": dayjs(),
        'nom': '',
        'prixAchat': '',
        'prixVente': '',
        'quantiteAchat': '',
        'produit': null,
        'motif': null,
        'fournisseur': fournisseurPrincipal,
        'departementSource': null,
        'departementDestination': null,
        'caisse': caissePrincipale,
        'uniteMesure': null,
        'devise': null,
        'operations': [],
        'depenses': [],
        'montantDepense': "",
        'totalOperation': null,
        'totalDepense': null,
        'enregistrer': false,
        "typeOperation": typeOperation,
        produits: [],
        motifsDepenses: [],
        motifEntree: motifEntreeDefaut,
        motifSortie: motifSortieDefaut,
        motifTransfert: motifTransfertDefaut,
        'typeProduitGlobal': 1, // 1 pour unité par défaut, 2 pour ensemble
    });

    useEffect(() => {
        if (data.typeOperation?.nom === "entrée") {
            setData("departementDestination", departementPrincipal);
        }
        if (data.typeOperation?.nom === "sortie") {
            setData("departementSource", departementPrincipal);
        }
        if (data.typeOperation?.nom === "transfert") {
            setData(prevData => ({
                ...prevData,
                "departementSource": departementPrincipal,
                "departementDestination": null,
            }));
        }
    }, [data.typeOperation]);

    const [isRefetching, setIsRefetching] = useState(false);
    const [successSt, setSuccessSt] = useState(false);
    const [errorSt, setErrorSt] = useState(false);

    // Utiliser une référence pour stocker les valeurs des champs sans déclencher de re-rendu
    const fieldValuesRef = React.useRef({});
    const updateTimeoutRef = React.useRef(null);

    // Fonction pour gérer les changements de champs des opérations
    const onHandleChangeOperation = (e) => {
        navigationOccurredRef.current = false; // Nouvelle interaction, réinitialiser le drapeau de navigation
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        fieldValuesRef.current[name] = value;

        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
            if (navigationOccurredRef.current) { // Vérifier si une navigation a eu lieu
                fieldValuesRef.current = {};
                updateTimeoutRef.current = null;
                return;
            }

            // Si l'étape active n'est plus celle de la modification des détails produits (index 2), ne pas exécuter setData.
            if (activeStep !== 2) {
                fieldValuesRef.current = {}; // Nettoyer les changements en attente
                updateTimeoutRef.current = null;
                return;
            }

            setData(prevData => {
                const currentChanges = { ...fieldValuesRef.current };
                const dataWithFieldUpdates = {
                    ...prevData,
                    ...currentChanges
                };

                let newTotalOperation = 0;
                let newOperationData = [];

                if (dataWithFieldUpdates.operations && dataWithFieldUpdates.operations.length > 0) {
                    dataWithFieldUpdates.operations.forEach((op) => {
                        const prixAchat = parseFloat(dataWithFieldUpdates[`prixAchat.${op.id}`] || 0);
                        const quantiteAchat = parseFloat(dataWithFieldUpdates[`quantiteAchat.${op.id}`] || 0);

                        const opFieldsDefinedInData = prevData.hasOwnProperty(`prixAchat.${op.id}`) || prevData.hasOwnProperty(`quantiteAchat.${op.id}`);
                        const opFieldsBeingChanged = currentChanges.hasOwnProperty(`prixAchat.${op.id}`) || currentChanges.hasOwnProperty(`quantiteAchat.${op.id}`);
                        const opHasSomeValue = prixAchat > 0 || quantiteAchat > 0;

                        if (opFieldsDefinedInData || opFieldsBeingChanged || opHasSomeValue) {
                            if (dataWithFieldUpdates.typeOperation?.nom === "entrée") {
                                newOperationData.push({
                                    id: op.id, produit_id: op.produit_id, produit_nom: op.produit_nom,
                                    type_produit_id: dataWithFieldUpdates.typeProduitGlobal,
                                    prixAchat: prixAchat, quantiteAchat: quantiteAchat,
                                });
                                if (quantiteAchat > 0 && prixAchat > 0) {
                                    newTotalOperation += prixAchat * quantiteAchat;
                                }
                            } else if (dataWithFieldUpdates.typeOperation?.nom === "sortie" || dataWithFieldUpdates.typeOperation?.nom === "transfert") {
                                newOperationData.push({
                                    id: op.id, produit_id: op.produit_id, produit_nom: op.produit_nom,
                                    quantiteAchat: quantiteAchat,
                                });
                                // Pas de total opération pour sorties/transferts basé sur prix client
                            }
                        }
                    });
                }

                const currentTotalDepense = dataWithFieldUpdates.totalDepense || 0;

                return {
                    ...dataWithFieldUpdates,
                    operationData: newOperationData,
                    totalOperation: newTotalOperation,
                    total: newTotalOperation + currentTotalDepense,
                };
            });

            fieldValuesRef.current = {};
            updateTimeoutRef.current = null;
        }, 1000);
    };

    // Référence pour les champs de dépenses
    const depenseFieldValuesRef = React.useRef({});
    const depenseUpdateTimeoutRef = React.useRef(null);

    // Fonction pour gérer les changements des champs de dépenses
    const onHandleChangeDepense = (e) => {
        navigationOccurredRef.current = false; // Nouvelle interaction, réinitialiser le drapeau de navigation
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        depenseFieldValuesRef.current[name] = value;

        if (depenseUpdateTimeoutRef.current) {
            clearTimeout(depenseUpdateTimeoutRef.current);
        }

        depenseUpdateTimeoutRef.current = setTimeout(() => {
            if (navigationOccurredRef.current) { // Vérifier si une navigation a eu lieu
                depenseFieldValuesRef.current = {};
                depenseUpdateTimeoutRef.current = null;
                return;
            }

            // Si l'étape active n'est plus celle de la modification des dépenses (index 3), ne pas exécuter setData.
            if (activeStep !== 3) {
                depenseFieldValuesRef.current = {}; // Nettoyer les changements en attente
                depenseUpdateTimeoutRef.current = null;
                return;
            }

            setData(prevData => {
                const currentChanges = { ...depenseFieldValuesRef.current };
                const dataWithFieldUpdates = {
                    ...prevData,
                    ...currentChanges
                };

                let newTotalDepense = 0;
                let newDepenseData = [];

                if (dataWithFieldUpdates.depenses && dataWithFieldUpdates.depenses.length > 0) {
                    dataWithFieldUpdates.depenses.forEach((dep) => {
                        const montant = parseFloat(dataWithFieldUpdates[`montantDepense.${dep.id}`] || 0);
                        const commentaire = dataWithFieldUpdates[`commentaire.${dep.id}`] || '';

                        const depFieldsDefinedInData = prevData.hasOwnProperty(`montantDepense.${dep.id}`) || prevData.hasOwnProperty(`commentaire.${dep.id}`);
                        const depFieldsBeingChanged = currentChanges.hasOwnProperty(`montantDepense.${dep.id}`) || currentChanges.hasOwnProperty(`commentaire.${dep.id}`);
                        const depHasSomeValue = montant > 0 || commentaire.trim() !== '';

                        if (depFieldsDefinedInData || depFieldsBeingChanged || depHasSomeValue) {
                            newDepenseData.push({
                                id: dep.id,
                                motif_id: dep.motif_id,
                                motif: dep.motif, // Assurez-vous que dep.motif contient l'objet motif complet
                                montant: montant,
                                commentaire: commentaire,
                            });
                            if (montant > 0) {
                                newTotalDepense += montant;
                            }
                        }
                    });
                }

                const currentTotalOperation = dataWithFieldUpdates.totalOperation || 0;

                return {
                    ...dataWithFieldUpdates,
                    depenseData: newDepenseData,
                    totalDepense: newTotalDepense,
                    total: currentTotalOperation + newTotalDepense,
                };
            });

            depenseFieldValuesRef.current = {};
            depenseUpdateTimeoutRef.current = null;
        }, 1000);
    };


    const [isTypeProduitChanging, setIsTypeProduitChanging] = useState(false);

    // Fonction pour gérer le changement de type de produit
    const handleTypeProduitChange = (e, val) => {
        const newTypeProduitGlobal = val?.id || 1;
        setIsTypeProduitChanging(true);
        // Met à jour immédiatement typeProduitGlobal pour que les calculs suivants l'utilisent
        setData("typeProduitGlobal", newTypeProduitGlobal);

        setTimeout(() => {
            setData(prevData => {
                let priceUpdates = {};
                let newOperationData = [];
                let newTotalOperation = 0;

                if (prevData.operations.length > 0 && prevData.typeOperation?.nom === "entrée") {
                    prevData.operations.forEach(op => {
                        const produit = produits.find(p => p.id === op.produit_id);
                        let currentPrice = parseFloat(prevData[`prixAchat.${op.id}`] || 0);

                        if (newTypeProduitGlobal === 2 && produit?.prixEnsemble) {
                            currentPrice = produit.prixEnsemble;
                            priceUpdates[`prixAchat.${op.id}`] = produit.prixEnsemble;
                        } else if (newTypeProduitGlobal === 1 && produit?.prixAchat) {
                            currentPrice = produit.prixAchat;
                            priceUpdates[`prixAchat.${op.id}`] = produit.prixAchat;
                        }
                        // Si le type de produit ne change pas le prix (ex: pas de prixEnsemble défini), currentPrice reste le prix existant

                        const quantiteAchat = parseFloat(prevData[`quantiteAchat.${op.id}`] || 0);

                        newOperationData.push({
                            id: op.id,
                            produit_id: op.produit_id,
                            produit_nom: op.produit_nom,
                            type_produit_id: newTypeProduitGlobal, // Utilise le nouveau type global
                            prixAchat: currentPrice,
                            quantiteAchat: quantiteAchat,
                        });

                        if (quantiteAchat > 0 && currentPrice > 0) {
                            newTotalOperation += currentPrice * quantiteAchat;
                        }
                    });
                }

                const currentTotalDepense = prevData.totalDepense || 0;

                return {
                    ...prevData,
                    ...priceUpdates, // Applique les mises à jour des prix
                    typeProduitGlobal: newTypeProduitGlobal, // Assure que c'est bien la nouvelle valeur
                    operationData: newOperationData,
                    totalOperation: newTotalOperation,
                    total: newTotalOperation + currentTotalDepense,
                };
            });

            setIsTypeProduitChanging(false);
        }, 100); // Délai pour permettre au state de typeProduitGlobal de se mettre à jour avant de recalculer
    };


    const [columnVisibility, setColumnVisibility] = useState({
        prixAchat: data.typeOperation?.nom === "entrée",
        montant: data.typeOperation?.nom === "entrée",
        typeProduit: data.typeOperation?.nom === "entrée",
        quantiteEnsemble: data.typeOperation?.nom === "entrée" && data.typeProduitGlobal === 2
    });

    // Mettre à jour la visibilité des colonnes lorsque le type d'opération ou le type de produit change
    useEffect(() => {
        setColumnVisibility({
            prixAchat: data.typeOperation?.nom === "entrée",
            montant: data.typeOperation?.nom === "entrée",
            typeProduit: data.typeOperation?.nom === "entrée",
            quantiteEnsemble: data.typeOperation?.nom === "entrée" && data.typeProduitGlobal === 2
        });
    }, [data.typeOperation, data.typeProduitGlobal]);



    useEffect(() => {
        setData(prevData => {
            let newRawOperations = [];
            let priceFieldsToUpdate = {};
            let newOperationData = [];
            let newTotalOperation = 0;

            const currentProduits = prevData.produits || [];
            const currentTypeProduitGlobal = prevData.typeProduitGlobal || 1;
            const currentTypeOperationNom = prevData.typeOperation?.nom;

            currentProduits.forEach(p => {
                let prixAchat = 0;
                if (currentTypeOperationNom === "entrée") {
                    if (currentTypeProduitGlobal === 2 && p.prixEnsemble) {
                        prixAchat = parseFloat(p.prixEnsemble) || 0;
                    } else {
                        prixAchat = parseFloat(p.prixAchat) || 0;
                    }
                    priceFieldsToUpdate[`prixAchat.${p.id}`] = prixAchat;
                }

                const quantiteAchat = parseFloat(prevData[`quantiteAchat.${p.id}`] || 0);

                let operationEntry = {
                    id: p.id,
                    produit: p,
                    produit_id: p.id,
                    produit_nom: p.nom,
                    type_produit_id: currentTypeProduitGlobal,
                    quantiteAchat: prevData[`quantiteAchat.${p.id}`] || '', // Conserver la chaîne vide si c'est l'intention
                    montant: '', // Généralement calculé ou pour affichage
                };
                if (currentTypeOperationNom === "entrée") {
                    operationEntry.prixAchat = prixAchat;
                }
                newRawOperations.push(operationEntry);

                let operationDataEntry = {
                    id: p.id,
                    produit_id: p.id,
                    produit_nom: p.nom,
                    type_produit_id: currentTypeProduitGlobal,
                    quantiteAchat: quantiteAchat,
                };
                if (currentTypeOperationNom === "entrée") {
                    operationDataEntry.prixAchat = prixAchat;
                    if (quantiteAchat > 0 && prixAchat > 0) {
                        newTotalOperation += prixAchat * quantiteAchat;
                    }
                }
                newOperationData.push(operationDataEntry);
            });

            const currentTotalDepense = prevData.totalDepense || 0;
            const newTotal = newTotalOperation + currentTotalDepense;

            // Nettoyer les champs orphelins de prevData
            const cleanedData = { ...prevData };
            Object.keys(prevData).forEach(key => {
                if (key.startsWith("prixAchat.") || key.startsWith("quantiteAchat.")) {
                    const opId = key.split('.')[1];
                    if (!currentProduits.some(prod => prod.id.toString() === opId)) {
                        delete cleanedData[key];
                    }
                }
            });

            return {
                ...cleanedData,
                operations: newRawOperations,
                ...priceFieldsToUpdate,
                operationData: newOperationData,
                totalOperation: newTotalOperation,
                total: newTotal,
            };
        });
    }, [data.produits, data.typeProduitGlobal, data.typeOperation?.nom]); // Ajout de data.typeOperation?.nom aux dépendances

    function handleRemoveToOperation(id) {
        setData(prevData => {
            const newProduits = prevData.produits.filter((p) => p.id !== id);

            const updatedData = { ...prevData, produits: newProduits };
            delete updatedData[`prixAchat.${id}`];
            delete updatedData[`quantiteAchat.${id}`];
            // Si d'autres champs spécifiques à l'opération comme `montant.${id}` existent et doivent être nettoyés, ajoutez-les ici.

            // Le useEffect dépendant de data.produits se chargera de recalculer operations, operationData et les totaux.
            return updatedData;
        });
        setSuccessSt('Produit retiré avec succès');
    }

    useEffect(() => {
        setData(prevData => {
            let newRawDepenses = [];
            let newDepenseData = [];
            let newTotalDepense = 0;

            const currentMotifsDepenses = prevData.motifsDepenses || [];

            currentMotifsDepenses.forEach(m => {
                const montant = parseFloat(prevData[`montantDepense.${m.id}`] || 0);
                const commentaire = prevData[`commentaire.${m.id}`] || '';

                newRawDepenses.push({
                    id: m.id,
                    motif: m, // Conserve l'objet motif complet
                    motif_id: m.id,
                    montant: prevData[`montantDepense.${m.id}`] || '', // Conserver la chaîne vide si c'est l'intention
                    commentaire: commentaire,
                });

                newDepenseData.push({
                    id: m.id,
                    motif_id: m.id,
                    motif: m, // Conserve l'objet motif complet
                    montant: montant,
                    commentaire: commentaire,
                });

                if (montant > 0) {
                    newTotalDepense += montant;
                }
            });

            const currentTotalOperation = prevData.totalOperation || 0;
            const newTotal = currentTotalOperation + newTotalDepense;

            // Nettoyer les champs orphelins de prevData
            const cleanedData = { ...prevData };
            Object.keys(prevData).forEach(key => {
                if (key.startsWith("montantDepense.") || key.startsWith("commentaire.")) {
                    const depId = key.split('.')[1];
                    if (!currentMotifsDepenses.some(motif => motif.id.toString() === depId)) {
                        delete cleanedData[key];
                    }
                }
            });

            return {
                ...cleanedData,
                depenses: newRawDepenses,
                depenseData: newDepenseData,
                totalDepense: newTotalDepense,
                total: newTotal,
            };
        });
    }, [data.motifsDepenses]);

    function handleRemoveToDepense(id) {
        setData(prevData => {
            const newMotifsDepenses = prevData.motifsDepenses.filter((m) => m.id !== id);

            const updatedData = { ...prevData, motifsDepenses: newMotifsDepenses };
            delete updatedData[`montantDepense.${id}`];
            delete updatedData[`commentaire.${id}`];

            // Le useEffect dépendant de data.motifsDepenses se chargera de recalculer depenses, depenseData et les totaux.
            return updatedData;
        });
        setSuccessSt('Dépense retirée avec succès');
    }


    const [selectAll, setSelectAll] = useState(false);
    const selectAllOption = { id: 'select-all', nom: 'Tous les produits' };
    const optionsWithSelectAll = [selectAllOption, ...produits];

    const handleChangeProduits = (event, newValues) => {
        // Handle "Select All" logic
        if (newValues.some(option => option.id === 'select-all')) {
            // If "Select All" is selected, toggle between all products and no products
            if (selectAll) {
                setData('produits', []);
                setSelectAll(false);
            } else {
                setData('produits', produits);
                setSelectAll(true);
            }
        } else {
            // Normal selection
            setData('produits', newValues);
            // Check if all products are now selected
            setSelectAll(newValues.length === produits.length);
        }
    };

    const [selectAllMotif, setSelectAllMotif] = useState(false);
    const selectAllOptionMotif = { id: 'select-all', nom: 'Tous les motifs' };
    const optionsWithSelectAllMotif = [selectAllOptionMotif, ...motifsDepenses];

    const handleChangeMotifs = (event, newValues) => {
        // Handle "Select All" logic
        if (newValues.some(option => option.id === 'select-all')) {
            // If "Select All" is selected, toggle between all products and no products
            if (selectAllMotif) {
                setData('motifsDepenses', []);
                setSelectAllMotif(false);
            } else {
                setData('motifsDepenses', motifsDepenses);
                setSelectAllMotif(true);
            }
        } else {
            // Normal selection
            setData('motifsDepenses', newValues);
            // Check if all products are now selected
            setSelectAllMotif(newValues.length === motifsDepenses.length);
        }
    };

    // Fonction de soumission du formulaire
    function handleSubmit(e) {
        e.preventDefault();
        router.post(route("admin.stock.mouvement.store", auth.user.id), {
            date: data.date,
            typeOperation: data.typeOperation?.id,
            typeOperation_nom: data.typeOperation?.nom,
            fournisseur: data.typeOperation?.nom === "entrée" ? data.fournisseur?.id : null,
            departementSource: data.departementSource?.id,
            departementDestination: data.departementDestination?.id,
            motifSortie: data.typeOperation?.nom === "sortie" ? data.motifSortie?.id : null,
            motifTransfert: data.typeOperation?.nom === "transfert" ? data.motifTransfert?.id : null,
            caisse: data.caisse?.id,
            operations: data.operationData,
            depenses: data.depenseData,
            totalOperation: data.totalOperation,
            totalDepense: data.totalDepense,
        }, { preserveScroll: true })
    }

    // Définition des colonnes pour le tableau des produits
    const columns = useMemo(
        () => [
            {
                accessorKey: 'N°', //access nested data with dot notationid', //access nested data with dot notation
                header: 'N°',
                Cell: ({ row }) => (
                    row.index + 1
                )
            },
            {
                accessorKey: 'nom', //access nested data with dot notation
                header: 'Nom',
                //size: 10,
                Cell: ({ row }) => (
                    row.original.produit?.nom
                )
            },
            {
                accessorKey: 'typeProduit',
                header: "Type de produit",
                Cell: ({ row }) => (
                    <div className="text-center">
                        {data.typeProduitGlobal === 1 ? 'Unité' : 'Ensemble'}
                    </div>
                )
            },
            {
                accessorKey: 'prixAchat',
                header: "Prix d'achat (GNF)",
                Cell: ({ row }) => (
                    <TextField
                        name={`prixAchat.${row.original.id}`}
                        value={data[`prixAchat.${row.original.id}`] || ''}
                        InputProps={{
                            inputComponent: NumberFormatCustomUtils,
                            inputProps: {
                                max: 100000000000,
                                min: 0,
                            },
                        }}
                        className="w-full"
                        onChange={onHandleChangeOperation}
                        size="small"
                    />
                )
            },
            {
                accessorKey: 'quantiteAchat',
                header: "Quantité",
                Cell: ({ row }) => (
                    <TextField
                        name={`quantiteAchat.${row.original.id}`}
                        value={data[`quantiteAchat.${row.original.id}`] || ''}
                        InputProps={{
                            inputComponent: NumberFormatCustomUtils,
                            inputProps: {
                                max: 100000000000,
                                min: 0,
                            },
                        }}
                        className="w-full"
                        onChange={onHandleChangeOperation}
                        size="small"
                    />
                )
            },
            {
                accessorKey: 'quantiteEnsemble',
                header: "Quantité par ensemble",
                Cell: ({ row }) => {
                    const produit = produits.find(p => p.id === row.original.produit_id);
                    return (
                        <div className="text-center">
                            {produit?.quantiteEnsemble ? formatNumber(produit.quantiteEnsemble) : '-'}
                        </div>
                    );
                }
            },
            {
                accessorKey: 'montant',
                header: "Montant (GNF)",
                Cell: ({ row }) => {
                    const prixAchat = parseFloat(data[`prixAchat.${row.original.id}`] || 0);
                    const quantiteAchat = parseFloat(data[`quantiteAchat.${row.original.id}`] || 0);
                    const montant = prixAchat * quantiteAchat;

                    return montant > 0
                        ? `${formatNumber(montant)} GNF`
                        : '';
                }
            },
            {
                accessorKey: 'action', //access nested data with dot notation
                header: "Action",
                //size: 10,
                Cell: ({ row }) => (
                    <Button key={row.original.id} onClick={() => handleRemoveToOperation(row.original.id)} variant={'contained'} size={'small'} color={'error'}>
                        <Close />
                    </Button>
                )
            },
        ],
        [data, onHandleChangeOperation, handleRemoveToOperation]
    );

    // Définition des colonnes pour le tableau des dépenses
    const columnsDepense = useMemo(
        () => [
            {
                accessorKey: 'motif', //access nested data with dot notation
                header: 'Motif',
                //size: 10,
                Cell: ({ row }) => (
                    row.original.motif?.nom
                )
            },
            {
                accessorKey: 'montant',
                header: "Montant (GNF)",
                Cell: ({ row }) => (
                    <TextField
                        name={`montantDepense.${row.original.id}`}
                        value={data[`montantDepense.${row.original.id}`] || ''}
                        InputProps={{
                            inputComponent: NumberFormatCustomUtils,
                            inputProps: {
                                max: 100000000000,
                                min: 0,
                            },
                        }}
                        className="w-full"
                        onChange={onHandleChangeDepense}
                        size="small"
                    />
                )
            },
            {
                accessorKey: 'commentaire', //access nested data with dot notation
                header: 'Commentaire',
                //size: 10,
                Cell: ({ row }) => (
                    <TextareaAutosize
                        name={`commentaire.${row.original.id}`}
                        value={data[`commentaire.${row.original.id}`] || ''}
                        className="w-full"
                        onChange={onHandleChangeDepense}
                        size="small"
                        multiline
                        minRows={1}
                        required={row?.original?.motif?.nom === 'autres'}
                    />
                )
            },
            {
                accessorKey: 'action', //access nested data with dot notation
                header: "Action",
                //size: 10,
                Cell: ({ row }) => (
                    <Button key={row.original.id} onClick={() => handleRemoveToDepense(row.original.id)} variant={'contained'} size={'small'} color={'error'} type={'button'}>
                        <Close></Close>
                    </Button>
                )
            },
        ],
        [data, onHandleChangeDepense, handleRemoveToDepense]
    );

    const table = useMaterialReactTable({
        columns,
        data: data.operations,
        state: {
            columnVisibility,
            showProgressBars: isRefetching,
        },
        onColumnVisibilityChange: setColumnVisibility,
        localization: MRT_Localization_FR
    });

    const tableDepense = useMaterialReactTable({
        columns: columnsDepense,
        data: data.depenses,
        //enableRowSelection: true,
        state: {
            showProgressBars: isRefetching,
        },
        localization: MRT_Localization_FR
    });

    // Composants pour chaque étape
    const StepInformationsGenerales = () => (
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
            <div className={"w-full"}>
                <div className={"md:col-span-2 font-bold text-orange-500"}>
                    Date de l'operation
                </div>
                <DatePicker
                    className={"w-full"}
                    openTo="day"
                    views={['year', 'month', 'day']}
                    format={'DD/MM/YYYY'}
                    value={data.date}
                    onChange={(newValue) => {
                        setData("date", newValue);
                    }}
                    slotProps={{ textField: { size: 'small' } }}
                />
            </div>
            <div>
                <div className={"md:col-span-2 font-bold text-orange-500"}>
                    Mouvement
                </div>
                <Autocomplete
                    value={data.typeOperation}
                    className={"w-full"}
                    onChange={(e, val) => setData("typeOperation", val)}
                    disablePortal={true}
                    options={typeOperations}
                    getOptionLabel={(option) => option.libelle}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => <TextField fullWidth {...params} placeholder={"mouvement"} label={params.libelle} required />}
                    size="small"
                />
                <InputError message={errors["typeOperation"]} />
            </div>

            {
                data.typeOperation?.nom === "sortie" &&
                <div>
                    <div className={"md:col-span-2 font-bold text-orange-500"}>
                        Motif de sortie
                    </div>
                    <Autocomplete
                        value={data.motifSortie}
                        className={"w-full"}
                        onChange={(e, val) => setData("motifSortie", val)}
                        disablePortal={true}
                        options={motifsSorties}
                        getOptionLabel={(option) => option.nom?.charAt(0).toUpperCase() + option.nom?.slice(1)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"motif"} label={params.libelle} required />}
                        size="small"
                    />
                    <InputError message={errors["motifSortie"]} />
                </div>
            }

            {
                data.typeOperation?.nom === "transfert" &&
                <div>
                    <div className={"md:col-span-2 font-bold text-orange-500"}>
                        Motif de transfert
                    </div>
                    <Autocomplete
                        value={data.motifTransfert}
                        className={"w-full"}
                        onChange={(e, val) => setData("motifTransfert", val)}
                        disablePortal={true}
                        options={motifsTransferts}
                        getOptionLabel={(option) => option.nom?.charAt(0).toUpperCase() + option.nom?.slice(1)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"motif de transfert"} label={params.libelle} required />}
                        size="small"
                    />
                    <InputError message={errors["motifTransfert"]} />
                </div>
            }
            <div className={"md:col-span-2 grid md:grid-cols-2 gap-2"}>
                {
                    (data.typeOperation?.nom === "sortie" || data.typeOperation?.nom === "transfert") &&
                    <div>
                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                            Stock source
                        </div>
                        <Autocomplete
                            value={data.departementSource}
                            className={"w-full"}
                            onChange={(e, val) => setData("departementSource", val)}
                            disablePortal={true}
                            options={departements.filter((d) => d.id !== data.departementDestination?.id)}
                            getOptionLabel={(option) => "Stock " + option.nom}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"Stock"} label={params.nom} required />}
                            size="small"
                        />
                        <InputError message={errors["departementSource"]} />
                    </div>
                }
                {
                    (data.typeOperation?.nom === "entrée" || data.typeOperation?.nom === "transfert") &&
                    <div>
                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                            Stock de destination
                        </div>
                        <Autocomplete
                            value={data.departementDestination}
                            className={"w-full"}
                            onChange={(e, val) => setData("departementDestination", val)}
                            disablePortal={true}
                            options={departements.filter((d) => d.id !== data.departementSource?.id)}
                            getOptionLabel={(option) => "Stock " + option.nom}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"Stock"} label={params.nom} required />}
                            size="small"
                        />
                        <InputError message={errors["departementDestination"]} />
                    </div>
                }
            </div>

            {
                data.typeOperation?.nom === "entrée" &&
                <>
                    <div>
                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                            Caisse de paiement
                        </div>
                        <Autocomplete
                            value={data.caisse}
                            className={"w-full"}
                            onChange={(e, val) => setData("caisse", val)}
                            disablePortal={true}
                            options={caisses}
                            getOptionLabel={(option) => "Caisse dep. " + option?.departement?.nom}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"Caisse"} label={params.nom} required />}
                            size="small"
                        />
                        <InputError message={errors["caisse"]} />
                        {
                            data.caisse
                            &&
                            <div className={'text-orange-500 font-bold mt-1'}>
                                Solde: {formatNumber(data.caisse.solde) + ' GNF'}
                            </div>
                        }
                    </div>

                    <div>
                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                            Fournisseur
                        </div>
                        <Autocomplete
                            value={data.fournisseur}
                            className={"w-full"}
                            onChange={(e, val) => setData("fournisseur", val)}
                            disablePortal={true}
                            options={fournisseurs}
                            getOptionLabel={(option) => option.nom}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"Fournisseur"} label={params.nom} /* required */ />}
                            size="small"
                        />
                        <InputError message={errors["fournisseur"]} />
                    </div>
                </>
            }
        </div>
    );

    // Étape 2: Sélection des produits
    const StepSelectionProduits = () => (
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
            <div className={"md:col-span-2 font-bold text-orange-500 text-xl"}>
                Ajout des produits
            </div>

            <div>
                <Autocomplete
                    value={data.produits}
                    className="w-full"
                    onChange={handleChangeProduits}
                    disablePortal={false}
                    options={optionsWithSelectAll}
                    multiple={true}
                    getOptionLabel={(option) => option.nom}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                        <TextField
                            fullWidth
                            {...params}
                            placeholder="Produits"
                            label={params.nom}
                        />
                    )}
                    disableCloseOnSelect={true}
                    size="small"
                    ListboxProps={{
                        style: { maxHeight: '200px' }
                    }}
                    componentsProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: 'flip',
                                    enabled: false,
                                },
                                {
                                    name: 'preventOverflow',
                                    enabled: true,
                                    options: {
                                        altAxis: true,
                                        altBoundary: true,
                                        tether: true,
                                        rootBoundary: 'document',
                                        padding: 8,
                                    },
                                },
                            ],
                        },
                    }}
                />
                <InputError message={errors["produits"]} />
            </div>

            {data.typeOperation?.nom === "entrée" && (
                <div className={"w-full"}>
                    <Autocomplete
                        value={data.typeProduitGlobal === 1 ? { id: 1, nom: "Unité" } : { id: 2, nom: "Ensemble" }}
                        className="w-full"
                        onChange={handleTypeProduitChange}
                        disablePortal={true}
                        options={[
                            { id: 1, nom: "Unité" },
                            { id: 2, nom: "Ensemble" }
                        ]}
                        getOptionLabel={(option) => option.nom}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField fullWidth {...params} label={"Mode d'achat"} placeholder="Type de produit" size="small" />}
                        size="small"
                    />
                </div>
            )}

            <div className={"md:col-span-2"}>
                {data.operations.length > 0 ? (
                    <div className="text-green-600 mb-2">
                        {data.operations.length} produit(s) sélectionné(s)
                    </div>
                ) : (
                    <div className="text-red-600 mb-2">
                        Aucun produit sélectionné
                    </div>
                )}
            </div>
        </div>
    );

    // Étape 3: Détails des produits
    const StepDetailsProduits = () => (
        <div className={"grid grid-cols-1 gap-5 border p-3 rounded"}>
            <div className={"font-bold text-orange-500 text-xl"}>
                Détails des produits
            </div>

            <div className={"w-full"}>
                <MaterialReactTable table={table} />
            </div>

            {data.totalOperation ? (
                <div className={"w-fit p-2 rounded bg-black text-white"}>
                    {"Total des produits : " + formatNumber(data.totalOperation) + ' GNF'}
                </div>
            ) : (
                <div className="text-red-600">
                    Veuillez remplir les quantités et prix pour calculer le total
                </div>
            )}
        </div>
    );

    // Étape 4: Dépenses supplémentaires (uniquement pour les entrées)
    const StepDepensesSupplementaires = () => (
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
            <div className={"md:col-span-2 font-bold text-orange-500 text-xl"}>
                Dépenses supplémentaires
            </div>

            <div>
                <Autocomplete
                    value={data.motifsDepenses}
                    className="w-full"
                    onChange={handleChangeMotifs}
                    disablePortal={false}
                    options={optionsWithSelectAllMotif}
                    multiple={true}
                    getOptionLabel={(option) => option.nom}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                        <TextField
                            fullWidth
                            {...params}
                            placeholder="Motifs"
                            label={params.nom}
                        />
                    )}
                    disableCloseOnSelect={true}
                    size="small"
                    ListboxProps={{
                        style: { maxHeight: '200px' }
                    }}
                    componentsProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: 'flip',
                                    enabled: false,
                                },
                                {
                                    name: 'preventOverflow',
                                    enabled: true,
                                    options: {
                                        altAxis: true,
                                        altBoundary: true,
                                        tether: true,
                                        rootBoundary: 'document',
                                        padding: 8,
                                    },
                                },
                            ],
                        },
                    }}
                />
                <InputError message={errors["motifsDepenses"]} />
            </div>

            <div className={"md:col-span-2"}>
                <MaterialReactTable table={tableDepense} />
            </div>

            {data.totalDepense ? (
                <div className={"w-fit p-2 rounded bg-black text-white"}>
                    {"Total des dépenses: " + formatNumber(data.totalDepense) + ' GNF'}
                </div>
            ) : (
                <div className="text-orange-600">
                    Aucune dépense supplémentaire
                </div>
            )}
        </div>
    );

    // Étape 5: Récapitulatif
    const StepRecapitulatif = () => (
        <div className={"grid grid-cols-1 gap-5 border p-3 rounded"}>
            <div className={"font-bold text-orange-500 text-xl"}>
                Récapitulatif du mouvement
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div>
                    <h3 className="font-bold">Informations générales</h3>
                    <div className="mt-2">
                        <p><span className="font-semibold">Date:</span> {data.date.format('DD/MM/YYYY')}</p>
                        <p><span className="font-semibold">Type d'opération:</span> {data.typeOperation?.libelle}</p>

                        {data.typeOperation?.nom === "entrée" && (
                            <>
                                <p><span className="font-semibold">Fournisseur:</span> {data.fournisseur?.nom || 'Non spécifié'}</p>
                                <p><span className="font-semibold">Caisse:</span> {data.caisse ? `Caisse dep. ${data.caisse?.departement?.nom}` : 'Non spécifié'}</p>
                                <p><span className="font-semibold">Stock de destination:</span> {data.departementDestination ? `Stock ${data.departementDestination?.nom}` : 'Non spécifié'}</p>
                            </>
                        )}

                        {data.typeOperation?.nom === "sortie" && (
                            <>
                                <p><span className="font-semibold">Motif de sortie:</span> {data.motifSortie?.nom || 'Non spécifié'}</p>
                                <p><span className="font-semibold">Stock source:</span> {data.departementSource ? `Stock ${data.departementSource?.nom}` : 'Non spécifié'}</p>
                            </>
                        )}

                        {data.typeOperation?.nom === "transfert" && (
                            <>
                                <p><span className="font-semibold">Motif de transfert:</span> {data.motifTransfert?.nom || 'Non spécifié'}</p>
                                <p><span className="font-semibold">Stock source:</span> {data.departementSource ? `Stock ${data.departementSource?.nom}` : 'Non spécifié'}</p>
                                <p><span className="font-semibold">Stock de destination:</span> {data.departementDestination ? `Stock ${data.departementDestination?.nom}` : 'Non spécifié'}</p>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold">Résumé financier</h3>
                    <div className="mt-2">
                        <p><span className="font-semibold">Nombre de produits:</span> {data.operations.length}</p>
                        <p><span className="font-semibold">Total des produits:</span> {formatNumber(data.totalOperation || 0)} GNF</p>

                        {data.typeOperation?.nom === "entrée" && (
                            <>
                                <p><span className="font-semibold">Nombre de dépenses:</span> {data.depenses.length}</p>
                                <p><span className="font-semibold">Total des dépenses:</span> {formatNumber(data.totalDepense || 0)} GNF</p>
                            </>
                        )}

                        <p className="mt-4 font-bold text-lg">
                            <span className="font-bold">TOTAL:</span> {formatNumber(data.total || 0)} GNF
                        </p>
                    </div>
                </div>
            </div>

            {/* Tableau récapitulatif des produits */}
            <div>
                <h3 className="font-bold mb-2">Liste des produits</h3>
                <MaterialReactTable table={table} />
            </div>

            {/* Tableau récapitulatif des dépenses si applicable */}
            {data.typeOperation?.nom === "entrée" && data.depenses.length > 0 && (
                <div>
                    <h3 className="font-bold mb-2">Liste des dépenses</h3>
                    <MaterialReactTable table={tableDepense} />
                </div>
            )}
        </div>
    );

    // Rendu du composant principal
    return (
        <PanelLayout
            auth={auth}
            success={successSt}
            error={errorSt}
            active={'stock'}
            sousActive={'mouvement'}
            breadcrumbs={[
                {
                    text: "Mouvement",
                    href: route("admin.stock.mouvement.index", auth.user.id),
                    active: false
                },
                {
                    text: "Nouveau",
                    href: route("admin.stock.mouvement.create", auth.user.id),
                    active: true
                }
            ]}
        >
            <div>
                <div className="w-full">
                    <div className="p-4 bg-white rounded mb-4">
                        <div className="flex justify-between items-center">
                            <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                                <h2>Nouveau mouvement</h2>
                            </div>
                            <Button
                                variant={'outlined'}
                                startIcon={<ArrowBack />}
                                onClick={() => router.get(route('admin.stock.mouvement.index', auth.user.id))}
                            >
                                Retour
                            </Button>
                        </div>
                    </div>

                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                        }}
                        style={{ width: '100%' }}
                    >
                        <Paper className="p-5 bg-white rounded">
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <Box className="mt-8">
                                {activeStep === steps.length ? (
                                    <div>
                                        <Typography>Toutes les étapes sont complétées</Typography>
                                        <Button onClick={handleReset} className="mt-4">
                                            Réinitialiser
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            {activeStep === 0 && <StepInformationsGenerales />}
                                            {activeStep === 1 && <StepSelectionProduits />}
                                            {activeStep === 2 && <StepDetailsProduits />}
                                            {activeStep === 3 && (
                                                data.typeOperation?.nom === "entrée" ?
                                                    <StepDepensesSupplementaires /> :
                                                    <StepRecapitulatif />
                                            )}
                                            {activeStep === 4 && <StepRecapitulatif />}

                                            <div className="flex justify-between mt-8">
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    startIcon={<NavigateBefore />}
                                                    type="button"
                                                >
                                                    Précédent
                                                </Button>

                                                {activeStep === 4 && (
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        Enregistrer
                                                    </Button>
                                                )}

                                                {activeStep !== 4 && (
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleNext}
                                                        endIcon={<NavigateNext />}
                                                        type="button"
                                                    >
                                                        Suivant
                                                    </Button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </Box>
                        </Paper>
                    </motion.div>
                </div>
            </div>
        </PanelLayout>
    );
}

export default Create;
