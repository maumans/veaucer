# DEVBOOK - Module Stock

Ce document sert à suivre l'évolution du module Stock de l'application Veaucer. Il documente la structure, les fonctionnalités et l'état d'avancement du module.

## Structure du Module

Le module Stock est organisé comme suit :

### Backend (PHP/Laravel)

#### Contrôleurs
- `StockController.php` - Gestion générale des stocks
- `MouvementController.php` - Gestion des mouvements de stock (entrées, sorties, transferts)
- `InventaireController.php` - Gestion de l'inventaire des produits
- `InventairePhysiqueController.php` - Gestion des inventaires physiques
- `AjustementInventaireController.php` - Gestion des ajustements d'inventaire
- `ProduitController.php` - Gestion des produits

#### Modèles
- `Stock.php` - Modèle pour les stocks
- `Produit.php` - Modèle pour les produits
- `Operation.php` - Modèle pour les opérations (mouvements)
  - Relations: `typeOperation`, `depenses`, `produits`, `typePrix`, `fournisseur`, `departementSource`, `departementDestination`, `caisseSource`, `caisseDestination`
- `OperationProduit.php` - Modèle pour les produits associés à une opération
  - Relations: `operation`, `produit`, `societe`, `receptions`, `depense`
- `TypeOperation.php` - Modèle pour les types d'opérations (entrée, sortie, transfert)
- `InventairePhysique.php` - Modèle pour les inventaires physiques
  - Relations: `details`, `departement`, `user`, `ajustements`
- `InventairePhysiqueDetail.php` - Modèle pour les détails d'un inventaire physique
  - Relations: `inventairePhysique`, `produit`
- `AjustementInventaire.php` - Modèle pour les ajustements d'inventaire
  - Relations: `produit`, `departement`, `user`, `inventairePhysique`

#### Routes
- `admin.stock` - Routes pour la gestion des stocks
- `admin.mouvement` - Routes pour la gestion des mouvements de stock
- `admin.stockInventaire` - Routes pour la gestion de l'inventaire standard
- `admin.inventaire.physique` - Routes pour la gestion des inventaires physiques
- `admin.inventaire.ajustement` - Routes pour la gestion des ajustements d'inventaire

### Frontend (React/Inertia.js)

#### Layout
- `PanelLayout.jsx` - Layout principal de l'application avec menu latéral et en-tête

#### Pages Stock
- `Index.jsx` - Liste des stocks
- `Create.jsx` - Création d'un stock
- `Edit.jsx` - Modification d'un stock
- `Show.jsx` - Affichage détaillé d'un stock

#### Pages Mouvement
- `Index.jsx` - Liste des mouvements avec pagination et filtrage
- `Create.jsx` - Création d'un mouvement (entrée, sortie, transfert)
  - Gestion des types d'opérations (entrée, sortie, transfert)
  - Sélection des produits, quantités, prix
  - Gestion des dépenses supplémentaires
- `Edit.jsx` - Modification d'un mouvement
- `Show.jsx` - Affichage détaillé d'un mouvement
  - Affichage des produits et des dépenses associés

#### Pages Produit
- `Index.jsx` - Liste des produits
- `Create.jsx` - Création d'un produit
- `Edit.jsx` - Modification d'un produit

#### Pages Inventaire
- `Index.jsx` - Gestion de l'inventaire standard

#### Pages Inventaire Physique
- `Physique/Index.jsx` - Liste des inventaires physiques
- `Physique/Create.jsx` - Création d'un inventaire physique
- `Physique/Show.jsx` - Affichage et gestion d'un inventaire physique

#### Pages Ajustement d'Inventaire
- `Ajustement/Index.jsx` - Liste des ajustements d'inventaire
- `Ajustement/Create.jsx` - Création d'un ajustement d'inventaire manuel
- `Ajustement/Show.jsx` - Affichage détaillé d'un ajustement d'inventaire

## Fonctionnalités

### Gestion des Stocks
- [x] Création d'un stock
- [x] Modification d'un stock
- [x] Suppression d'un stock
- [x] Affichage de la liste des stocks
- [x] Affichage détaillé d'un stock

### Gestion des Produits
- [x] Création d'un produit
- [x] Modification d'un produit
- [x] Suppression d'un produit
- [x] Affichage de la liste des produits
- [x] Association d'un produit à un fournisseur
- [x] Association d'un produit à une catégorie
- [x] Gestion des prix d'achat et de vente
- [x] Gestion des quantités d'achat et de vente
- [x] Gestion des seuils minimaux et maximaux

### Gestion des Mouvements de Stock
- [x] Entrée de stock (approvisionnement)
  - [x] Sélection des produits
  - [x] Saisie des quantités
  - [x] Saisie des prix d'achat
  - [x] Sélection du fournisseur
  - [x] Sélection du département de destination
  - [x] Gestion des dépenses supplémentaires
  - [x] Option d'enregistrement avec ou sans réception immédiate
- [x] Sortie de stock
  - [x] Sélection des produits
  - [x] Saisie des quantités
  - [x] Sélection du département source
  - [x] Sélection du motif de sortie
- [x] Transfert de stock
  - [x] Sélection des produits
  - [x] Saisie des quantités
  - [x] Sélection du département source
  - [x] Sélection du département destination
  - [x] Sélection du motif de transfert
- [x] Modification d'un mouvement
  - [x] Mise à jour des quantités et prix
  - [x] Ajout/suppression de produits
  - [x] Ajout/suppression de dépenses
- [x] Suppression d'un mouvement
- [x] Affichage de la liste des mouvements
  - [x] Pagination des résultats
  - [x] Filtrage par type d'opération, date, etc.
  - [x] Tri des résultats
- [x] Affichage détaillé d'un mouvement
  - [x] Informations générales (date, fournisseur, etc.)
  - [x] Liste des produits concernés
  - [x] Liste des dépenses associées
  - [x] Totaux calculés

### Gestion de l'Inventaire
- [x] Affichage de l'inventaire des produits
- [x] Filtrage de l'inventaire par catégorie, type de produit, etc.
- [x] Affichage des alertes pour les produits en rupture de stock
- [x] Affichage des alertes pour les produits sous le seuil minimal

### Gestion des Inventaires Physiques
- [x] Création d'un inventaire physique
  - [x] Sélection d'un département spécifique ou de tous les départements
  - [x] Planification de la date de début
- [x] Gestion du cycle de vie d'un inventaire physique
  - [x] Planification (status "planifié")
  - [x] Démarrage (status "en_cours")
  - [x] Comptage des produits
  - [x] Validation des comptages
  - [x] Finalisation (status "terminé")
  - [x] Annulation (status "annulé")
- [x] Affichage de la liste des inventaires physiques
  - [x] Filtrage par status, département, date
  - [x] Actions selon le status (démarrer, terminer, annuler)
- [x] Comptage des produits
  - [x] Saisie des quantités comptées
  - [x] Comparaison avec les quantités théoriques
  - [x] Identification des écarts
- [x] Génération d'ajustements d'inventaire
  - [x] Création automatique d'ajustements pour les produits avec écarts

### Gestion des Ajustements d'Inventaire
- [x] Création manuelle d'ajustements d'inventaire
  - [x] Sélection du produit
  - [x] Saisie de la nouvelle quantité
  - [x] Calcul automatique de la différence
  - [x] Saisie du motif d'ajustement
- [x] Gestion du cycle de vie d'un ajustement
  - [x] Création (status "en_attente")
  - [x] Validation (status "validé")
  - [x] Rejet (status "rejeté")
- [x] Affichage de la liste des ajustements
  - [x] Filtrage par status, produit, département
  - [x] Actions selon le status (valider, rejeter)
- [x] Mise à jour automatique des stocks lors de la validation d'un ajustement

## État d'Avancement

### Gestion des Stocks
- [x] Implémentation du modèle Stock
- [x] Implémentation du contrôleur StockController
- [x] Implémentation des vues Stock (Index, Create, Edit, Show)
- [x] Implémentation des routes Stock

### Gestion des Produits
- [x] Implémentation du modèle Produit
- [x] Implémentation du contrôleur ProduitController
- [x] Implémentation des vues Produit (Index, Create, Edit)
- [x] Implémentation des routes Produit

### Gestion des Mouvements de Stock
- [x] Implémentation du contrôleur MouvementController
  - [x] Méthode `index` pour lister les mouvements
  - [x] Méthode `create` pour afficher le formulaire de création
  - [x] Méthode `store` pour enregistrer un nouveau mouvement
  - [x] Méthode `show` pour afficher les détails d'un mouvement
  - [x] Méthode `edit` pour afficher le formulaire d'édition
  - [x] Méthode `update` pour mettre à jour un mouvement
  - [x] Méthode `destroy` pour supprimer un mouvement
  - [x] Méthode `cancel` pour annuler un mouvement (création d'une opération inverse)
  - [x] Méthodes spécifiques pour les différents types de mouvements (`entree`, `sortie`, `transfert`)
- [x] Implémentation des vues Mouvement
  - [x] `Index.jsx` avec pagination, filtrage et actions (voir, modifier, annuler, supprimer)
  - [x] `Create.jsx` avec formulaire dynamique selon le type d'opération
  - [x] `Edit.jsx` pour la modification des mouvements
  - [x] `Show.jsx` pour l'affichage détaillé d'un mouvement
- [x] Implémentation des routes Mouvement
  - [x] Routes CRUD standard (index, create, store, show, edit, update, destroy)
  - [x] Route spécifique pour l'annulation d'un mouvement (`cancel`)
- [x] Gestion des entrées de stock
  - [x] Sélection des produits et saisie des quantités/prix
  - [x] Gestion des dépenses associées
  - [x] Option d'enregistrement avec ou sans réception immédiate
- [x] Gestion des sorties de stock
  - [x] Sélection des produits et saisie des quantités
  - [x] Sélection du motif de sortie
- [x] Gestion des transferts de stock
  - [x] Sélection des produits et saisie des quantités
  - [x] Sélection des départements source et destination

### Gestion de l'Inventaire
- [x] Implémentation du contrôleur InventaireController
- [x] Implémentation de la vue Inventaire (Index)
- [x] Implémentation des routes Inventaire

## Améliorations Futures

### Gestion des Stocks
- [ ] Ajout d'un historique des modifications de stock
- [ ] Ajout de graphiques pour visualiser l'évolution des stocks
- [ ] Implémentation d'un système de prévision des besoins en stock

### Gestion des Produits
- [ ] Ajout de la gestion des images de produits
- [ ] Ajout de codes-barres pour les produits
- [ ] Ajout d'un système de recherche avancée pour les produits
- [ ] Implémentation d'un système de catégorisation hiérarchique des produits

### Gestion des Mouvements de Stock
- [ ] Ajout d'un système de validation des mouvements (workflow d'approbation)
- [ ] Ajout d'un système de notification pour les mouvements importants
- [ ] Ajout d'un système d'exportation des mouvements (PDF, Excel)
- [ ] Amélioration du système de traçabilité des mouvements (audit trail)
- [ ] Ajout d'un tableau de bord spécifique pour les mouvements de stock
- [ ] Implémentation d'un système de réservation de stock
- [x] Ajout de la possibilité d'annuler un mouvement (avec historique)
- [ ] Amélioration de l'interface utilisateur pour la sélection multiple de produits
- [ ] Ajout d'un système de scan de code-barres pour les mouvements
- [ ] Implémentation d'un système de validation des stocks négatifs
- [ ] Ajout d'un historique des modifications pour chaque mouvement

### Gestion de l'Inventaire
- [x] Ajout d'un système d'inventaire physique
- [x] Ajout d'un système d'ajustement d'inventaire
- [ ] Implémentation d'un système de planification automatique des inventaires
- [ ] Ajout d'un système d'alerte par email pour les ruptures de stock
- [ ] Intégration d'un système de scan de codes-barres pour le comptage d'inventaire
- [ ] Ajout de rapports d'analyse des écarts d'inventaire
- [ ] Implémentation d'un système de prévision des besoins en stock basé sur l'historique

## Notes Techniques

### Structure de la Base de Données

#### Table `inventaires_physiques`
- `id` - Identifiant unique
- `date_debut` - Date de début de l'inventaire
- `date_fin` - Date de fin de l'inventaire (null si non terminé)
- `status` - Statut de l'inventaire (planifié, en_cours, terminé, annulé)
- `departement_id` - Référence au département concerné (null si tous les départements)
- `notes` - Notes ou commentaires sur l'inventaire
- `user_id` - Référence à l'utilisateur qui a créé l'inventaire
- `societe_id` - Référence à la société
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

#### Table `inventaire_physique_details`
- `id` - Identifiant unique
- `inventaire_physique_id` - Référence à l'inventaire physique
- `produit_id` - Référence au produit
- `quantite_theorique` - Quantité théorique en stock
- `quantite_comptee` - Quantité comptée lors de l'inventaire (null si non compté)
- `status` - Statut du détail (à_compter, compté, validé, écart)
- `notes` - Notes ou commentaires sur le comptage
- `societe_id` - Référence à la société
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

#### Table `ajustements_inventaire`
- `id` - Identifiant unique
- `produit_id` - Référence au produit
- `quantite_avant` - Quantité avant ajustement
- `quantite_apres` - Quantité après ajustement
- `difference` - Différence entre les quantités
- `motif` - Motif de l'ajustement
- `date_ajustement` - Date de l'ajustement
- `status` - Statut de l'ajustement (en_attente, validé, rejeté)
- `departement_id` - Référence au département concerné
- `inventaire_physique_id` - Référence à l'inventaire physique source (null si ajustement manuel)
- `user_id` - Référence à l'utilisateur qui a créé l'ajustement
- `societe_id` - Référence à la société
- `notes` - Notes ou commentaires sur l'ajustement
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

### Structure de la Base de Données (Tables existantes)

#### Table `stocks`
- `id` - Identifiant unique
- `quantite` - Quantité en stock
- `stockCritique` - Stock critique de stock
- `seuilMaximal` - Seuil maximal de stock
- `slug` - Slug pour l'URL
- `type` - Type de stock (PRINCIPAL, SECONDAIRE)
- `status` - Statut du stock (actif/inactif)
- `produit_id` - Référence au produit
- `user_id` - Référence à l'utilisateur
- `departement_id` - Référence au département
- `societe_id` - Référence à la société
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

#### Table `produits`
- `id` - Identifiant unique
- `slug` - Slug pour l'URL
- `nom` - Nom du produit
- `description` - Description du produit
- `stockGlobal` - Stock global
- `stockCritique` - Stock critique de stock
- `seuilMaximal` - Seuil maximal de stock
- `image` - Image du produit
- `notes` - Notes sur le produit
- `etat` - État du produit (ACTIF, HORS STOCK, EN PROMOTION)
- `type_produit_achat_id` - Référence au type de produit pour l'achat
- `quantiteAchat` - Quantité d'achat
- `prixAchat` - Prix d'achat
- `type_produit_vente_id` - Référence au type de produit pour la vente
- `quantiteVente` - Quantité de vente
- `prixVente` - Prix de vente
- `status` - Statut du produit (actif/inactif)
- `categorie_id` - Référence à la catégorie
- `fournisseur_principal_id` - Référence au fournisseur principal
- `unite_mesure_id` - Référence à l'unité de mesure
- `devise_id` - Référence à la devise
- `societe_id` - Référence à la société
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

#### Table `operations`
- `id` - Identifiant unique
- `date` - Date de l'opération
- `montant` - Montant total de l'opération
- `description` - Description de l'opération
- `status` - Statut de l'opération (actif/inactif)
- `type_operation_id` - Référence au type d'opération (entrée, sortie, transfert)
- `fournisseur_id` - Référence au fournisseur
- `departement_source_id` - Référence au département source
- `departement_destination_id` - Référence au département destination
- `caisse_source_id` - Référence à la caisse source
- `caisse_destination_id` - Référence à la caisse destination
- `societe_id` - Référence à la société
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

#### Table `operation_produits`
- `id` - Identifiant unique
- `quantite` - Quantité du produit dans l'opération
- `prixAchat` - Prix d'achat du produit
- `prixVente` - Prix de vente du produit
- `status` - Statut (actif/inactif)
- `produit_id` - Référence au produit
- `operation_id` - Référence à l'opération
- `stock_id` - Référence au stock
- `societe_id` - Référence à la société
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

### Logique Métier

#### Processus d'Inventaire Physique
1. Création d'un inventaire physique avec status "planifié"
2. Démarrage de l'inventaire, passage au status "en_cours"
3. Pour chaque produit:
   - Affichage de la quantité théorique en stock
   - Saisie de la quantité comptée physiquement
   - Calcul de l'écart entre quantité théorique et quantité comptée
   - Validation du comptage
4. Finalisation de l'inventaire, passage au status "terminé"
5. Génération des ajustements d'inventaire pour les produits présentant des écarts

#### Processus d'Ajustement d'Inventaire
1. Création d'un ajustement (manuel ou automatique depuis un inventaire physique)
2. Enregistrement avec status "en_attente"
3. Validation de l'ajustement:
   - Passage au status "validé"
   - Mise à jour de la quantité en stock du produit
   - Création d'une entrée dans la table des stocks pour tracer l'ajustement
4. Ou rejet de l'ajustement:
   - Passage au status "rejeté"
   - Enregistrement du motif de rejet

### Logique Métier (Processus existants)

#### Entrée de Stock
1. Sélection des produits à ajouter au stock
2. Saisie des quantités et des prix d'achat
3. Sélection du fournisseur et du département de destination
4. Ajout éventuel de dépenses supplémentaires (transport, manutention, etc.)
5. Choix entre enregistrement simple ou enregistrement avec réception immédiate
6. Validation de l'entrée de stock
7. Si réception immédiate, mise à jour des quantités en stock des produits concernés

#### Sortie de Stock
1. Sélection des produits à retirer du stock
2. Saisie des quantités
3. Sélection du département source et du motif de sortie
4. Validation de la sortie de stock
5. Mise à jour des quantités en stock des produits concernés

#### Transfert de Stock
1. Sélection des produits à transférer
2. Saisie des quantités
3. Sélection du département source et du département destination
4. Sélection du motif de transfert
5. Validation du transfert de stock
6. Mise à jour des quantités en stock des produits concernés dans les départements source et destination

### Flux de Données pour les Mouvements de Stock

#### Création d'un Mouvement
1. L'utilisateur sélectionne le type d'opération (entrée, sortie, transfert)
2. L'interface s'adapte en fonction du type d'opération sélectionné
3. L'utilisateur remplit les informations nécessaires
4. Les données sont envoyées au contrôleur MouvementController
5. Le contrôleur valide les données et crée les enregistrements nécessaires
6. Les quantités de stock sont mises à jour si nécessaire

#### Modification d'un Mouvement
1. L'utilisateur sélectionne un mouvement existant
2. Les données du mouvement sont chargées dans le formulaire
3. L'utilisateur modifie les informations nécessaires
4. Les données sont envoyées au contrôleur MouvementController
5. Le contrôleur annule les effets du mouvement original
6. Le contrôleur applique les effets du mouvement modifié
7. Les quantités de stock sont mises à jour en conséquence

### Optimisations Possibles pour les Mouvements de Stock

1. **Performance**
   - Utilisation de transactions pour garantir l'intégrité des données
   - Optimisation des requêtes pour réduire le temps de chargement
   - Mise en cache des données fréquemment utilisées

2. **Interface Utilisateur**
   - Ajout d'une fonctionnalité de recherche rapide de produits
   - Implémentation d'un système de suggestions basé sur les mouvements fréquents
   - Amélioration de la visualisation des données avec des graphiques

3. **Fonctionnalités**
   - Ajout d'un système de validation en plusieurs étapes pour les mouvements importants
   - Implémentation d'un système de notifications pour les mouvements critiques
   - Ajout d'un système d'exportation des données (PDF, Excel)

### Optimisations Possibles pour les Inventaires Physiques

1. **Performance**
   - Optimisation du processus de comptage pour les inventaires avec un grand nombre de produits
   - Mise en place d'un système de mise à jour en temps réel des comptages

2. **Interface Utilisateur**
   - Implémentation d'une interface mobile pour faciliter le comptage sur le terrain
   - Ajout d'un système de scan de codes-barres pour accélérer le comptage
   - Visualisation des écarts d'inventaire avec des graphiques et tableaux de bord

3. **Fonctionnalités**
   - Ajout d'un système de comptage par échantillonnage pour les grands inventaires
   - Implémentation d'un système de comptage cyclique (inventaire tournant)
   - Intégration avec des appareils de comptage automatisés

1. **Performance**
   - Utilisation de transactions pour garantir l'intégrité des données
   - Optimisation des requêtes pour réduire le temps de chargement
   - Mise en cache des données fréquemment utilisées

2. **Interface Utilisateur**
   - Ajout d'une fonctionnalité de recherche rapide de produits
   - Implémentation d'un système de suggestions basé sur les mouvements fréquents
   - Amélioration de la visualisation des données avec des graphiques

3. **Fonctionnalités**
   - Ajout d'un système de validation en plusieurs étapes pour les mouvements importants
   - Implémentation d'un système de notifications pour les mouvements critiques
   - Ajout d'un système d'exportation des données (PDF, Excel)
