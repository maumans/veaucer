# DEVBOOK - Gestion des Stocks Îles Maurice

## 1. Structure des Départements
- [x] Stock Principal (Magasin central)
- [x] Stock Restaurant
- [x] Stock Bar (en haut)
- [x] Stock Bar (en bas)

## 2. Modèles de Données
### Produits (déjà dans les paramètres)
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

### Départements
- [x] ID
- [x] Nom
- [x] Description
- [x] Type (PRINCIPAL, RESTAURANT, BAR_HAUT, BAR_BAS)
- [ ] Responsable

### Stock
- [x] ID
- [x] Produit_ID
- [x] Département_ID
- [x] Quantité
- [ ] Emplacement
- [ ] Niveau minimum
- [ ] Niveau maximum

### Mouvements de Stock
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

### Inventaires
- [ ] ID
- [ ] Département_ID
- [ ] Date_Début
- [ ] Date_Fin
- [ ] Statut (EN_COURS, TERMINÉ, VALIDÉ)
- [ ] Commentaires

## 3. Fonctionnalités à Implémenter

### 3.1 Gestion des Entrées
- [x] Réception des produits au stock principal
- [ ] Validation des quantités reçues
- [ ] Scan des codes-barres
- [ ] Attribution des numéros de lot
- [ ] Gestion des dates d'expiration

### 3.2 Gestion des Sorties
- [x] Sorties vers les départements
- [ ] Sorties pour perte/casse
- [ ] Sorties pour utilisation interne
- [ ] Validation des sorties par responsable

### 3.3 Transferts Inter-Départements
- [ ] Demande de transfert
- [ ] Validation du transfert
- [ ] Confirmation de réception
- [ ] Historique des transferts

### 3.4 Inventaires
- [ ] Planification des inventaires
- [ ] Saisie des comptages
- [ ] Validation des écarts
- [ ] Ajustements automatiques
- [ ] Rapports d'inventaire

### 3.5 Alertes et Notifications
- [ ] Seuil minimum atteint
- [ ] Produits périmés ou proche péremption
- [ ] Demandes de transfert en attente
- [ ] Validation requise

### 3.6 Rapports
- [ ] État des stocks par département
- [ ] Mouvements de stock
- [ ] Analyse des consommations
- [ ] Valorisation des stocks
- [ ] Rapport des pertes
- [ ] Historique des transferts

## 4. Interface Utilisateur

### 4.1 Menu Principal
- Stock
  - Tableau de bord
  - Produits
  - Mouvements
  - Inventaires
  - Rapports

### 4.2 Sous-menus
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

## 5. Sécurité et Permissions
- [ ] Rôles spécifiques pour la gestion des stocks
- [ ] Permissions par département
- [ ] Validation à plusieurs niveaux
- [ ] Traçabilité des opérations

## 6. Concepts Clés de Gestion des Stocks

### 6.1 Flux de Travail
1. **Réception au Stock Principal**
   - Enregistrement de la livraison fournisseur
   - Vérification des quantités et qualité
   - Entrée en stock avec numéro de lot et date d'expiration
   - Mise à jour du stock principal

2. **Ravitaillement des Départements**
   - Demande de ravitaillement par le département
   - Validation par le responsable du stock principal
   - Préparation et transfert des produits
   - Double écriture : 
     - Sortie du stock principal
     - Entrée dans le stock du département

3. **Inventaires**
   - Planification régulière (hebdomadaire/mensuelle)
   - Comptage physique par département
   - Comparaison avec les stocks théoriques
   - Ajustements si nécessaire
   - Validation des écarts

### 6.2 Types de Mouvements

- **Entrées**
  - Réception des produits des fournisseurs au stock principal
  - Retours de produits des autres départements
  - Ajustements d'inventaire positifs

- **Sorties**
  - Transferts vers les départements (Bar Haut, Bar Bas, Restaurant)
  - Pertes/Casse
  - Utilisations internes
  - Ajustements d'inventaire négatifs

- **Transferts**
  - Mouvements entre départements
  - Double écriture : sortie du département source + entrée dans le département destination

### 6.3 Bonnes Pratiques
- Toujours passer par le stock principal pour les approvisionnements
- Documenter les raisons des mouvements
- Faire des inventaires réguliers
- Suivre les dates de péremption
- Maintenir des seuils de sécurité
