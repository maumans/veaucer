# DEVBOOK - Îles Maurice

Application de gestion pour le complexe de loisirs Îles Maurice, développée avec Laravel, React, Inertia, Material UI et Tailwind CSS.

## Table des matières

1. [Module de Gestion des Stocks](#module-de-gestion-des-stocks)
2. [Module de Gestion des Ventes](#module-de-gestion-des-ventes) (À venir)
3. [Module de Gestion des Clients](#module-de-gestion-des-clients) (À venir)
4. [Module de Gestion des Ressources Humaines](#module-de-gestion-des-ressources-humaines) (À venir)
5. [Module de Gestion Financière](#module-de-gestion-financière) (À venir)
6. [Module de Reporting](#module-de-reporting) (À venir)

---

## Module de Gestion des Stocks

### 1. Structure des Départements
- [x] Stock Principal (Magasin central)
- [x] Stock Restaurant
- [x] Stock Bar (en haut)
- [x] Stock Bar (en bas)

### 2. Modèles de Données
#### Produits (déjà dans les paramètres)
- [x] ID
- [x] Nom
- [x] Description
- [x] Prix d'achat
- [x] Prix de vente
- [x] Unité de mesure
- [x] Catégorie
- [x] Seuil d'alerte
- [ ] Code-barres
- [ ] Image

#### Départements
- [x] ID
- [x] Nom
- [x] Description
- [x] Type (PRINCIPAL, RESTAURANT, BAR_HAUT, BAR_BAS)
- [ ] Responsable

#### Stock
- [x] ID
- [x] Produit_ID
- [x] Département_ID
- [x] Quantité
- [ ] Emplacement
- [ ] Niveau minimum
- [ ] Niveau maximum

#### Mouvements de Stock
- [x] ID
- [x] Type (ENTREE, SORTIE, TRANSFERT)
- [x] Produit_ID
- [x] Département_Source_ID
- [x] Département_Destination_ID
- [x] Quantité
- [x] Date
- [x] Description
- [ ] Numéro de lot
- [ ] Date d'expiration
- [ ] Prix unitaire

#### Inventaires
- [ ] ID
- [ ] Département_ID
- [ ] Date_Début
- [ ] Date_Fin
- [ ] Statut (EN_COURS, TERMINÉ, VALIDÉ)
- [ ] Commentaires

### 3. Fonctionnalités à Implémenter

#### 3.1 Gestion des Entrées
- [x] Réception des produits au stock principal
- [ ] Validation des quantités reçues
- [ ] Scan des codes-barres
- [ ] Attribution des numéros de lot
- [ ] Gestion des dates d'expiration

#### 3.2 Gestion des Sorties
- [x] Sorties vers les départements
- [ ] Sorties pour perte/casse
- [ ] Sorties pour utilisation interne
- [ ] Validation des sorties par responsable

#### 3.3 Transferts Inter-Départements
- [ ] Demande de transfert
- [ ] Validation du transfert
- [ ] Confirmation de réception
- [ ] Historique des transferts

#### 3.4 Inventaires
- [ ] Planification des inventaires
- [ ] Saisie des comptages
- [ ] Validation des écarts
- [ ] Ajustements automatiques
- [ ] Rapports d'inventaire

#### 3.5 Alertes et Notifications
- [ ] Seuil minimum atteint
- [ ] Produits périmés ou proche péremption
- [ ] Demandes de transfert en attente
- [ ] Validation requise

#### 3.6 Rapports
- [ ] État des stocks par département
- [ ] Mouvements de stock
- [ ] Analyse des consommations
- [ ] Valorisation des stocks
- [ ] Rapport des pertes
- [ ] Historique des transferts

### 4. Interface Utilisateur

#### 4.1 Menu Principal
- Stock
  - Tableau de bord
  - Produits
  - Mouvements
  - Inventaires
  - Rapports

#### 4.2 Sous-menus
- Mouvements
  - Entrées
  - Sorties
  - Transferts
  - Historique

- Inventaires
  - Nouveau
  - En cours
  - Historique
  - Ajustements

- Rapports
  - État des stocks
  - Mouvements
  - Valorisation
  - Analyses

### 5. Sécurité et Permissions
- [ ] Rôles spécifiques pour la gestion des stocks
- [ ] Permissions par département
- [ ] Validation à plusieurs niveaux
- [ ] Traçabilité des opérations

---

## Module de Gestion des Ventes

*À compléter lors du développement de ce module*

---

## Module de Gestion des Clients

*À compléter lors du développement de ce module*

---

## Module de Gestion des Ressources Humaines

*À compléter lors du développement de ce module*

---

## Module de Gestion Financière

*À compléter lors du développement de ce module*

---

## Module de Reporting

*À compléter lors du développement de ce module*
