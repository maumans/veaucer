<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Îles Maurice - Gestion de Complexe de Loisirs

Application de gestion pour le complexe de loisirs Îles Maurice, développée avec Laravel, React, Inertia, Material UI et Tailwind CSS.

## DEVBOOK - Gestion des Stocks

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

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
#   v e a u c e r  
 