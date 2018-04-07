# API RESTful pour le CRUD d’une entité Movie

## Démarrage de l'application

### Prérequis

 * postgres 10.3
 * node v9.8.0
 * npm 5.8.0

### Installation de l'api sur un poste de dev

    npm install

Ou

    yarn install

### Configuration de l'api

Modifier le fichier `config/default.json`

    {
        "port": 1337,
        "database_url": "postgres://postgres:azeqsd@localhost:32770/postgres"
    }

### Démarrage de la base de donnée

Démarrer une instance postgres et exécuter le fichier db.sql (non testé)

### Démarrage de l'api

    npm start

