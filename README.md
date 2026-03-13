# Application Angular - Gestion des étudiants

## 1) Arborescence du projet

```text
.
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── mock-api/
│   ├── db.json
│   └── server.mjs
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss
    ├── environments/
    │   └── environment.ts
    └── app/
        ├── app.component.ts
        ├── app.routes.ts
        ├── layout/
        │   └── main-layout.component.ts
        ├── models/
        │   ├── auth.model.ts
        │   ├── class.model.ts
        │   ├── department.model.ts
        │   └── student.model.ts
        ├── services/
        │   └── api.service.ts
        ├── core/
        │   ├── guards/
        │   │   └── auth.guard.ts
        │   ├── interceptors/
        │   │   ├── auth.interceptor.ts
        │   │   └── error.interceptor.ts
        │   └── services/
        │       ├── auth.service.ts
        │       ├── error-handler.service.ts
        │       └── notification.service.ts
        └── features/
            ├── auth/
            │   └── login.component.ts
            ├── pages/dashboard/
            │   └── dashboard.component.ts
            ├── students/
            │   ├── components/confirm-dialog.component.ts
            │   ├── student-list.component.ts
            │   ├── student-list.component.html
            │   ├── student-detail.component.ts
            │   ├── student-form.component.ts
            │   └── student-form.component.html
            ├── classes/
            │   └── classes.component.ts
            └── departments/
                └── departments.component.ts
```

## 2) Commandes d'installation

```bash
npm install
```

## 3) Commandes Angular CLI de génération (référence)

```bash
npx @angular/cli@20 new student-management-app --standalone --routing --style=scss --strict
ng add @angular/material
ng generate component layout/main-layout --standalone
ng generate component features/auth/login --standalone
ng generate component features/pages/dashboard/dashboard --standalone
ng generate component features/students/student-list --standalone
ng generate component features/students/student-form --standalone
ng generate component features/students/student-detail --standalone
ng generate component features/students/components/confirm-dialog --standalone
ng generate component features/classes/classes --standalone
ng generate component features/departments/departments --standalone
```

## 4) Lancer le backend mock (json-server)

```bash
npm run mock:api
```

## 5) Lancer l'application Angular

```bash
npm run start
```

## 6) Endpoints REST disponibles

- `POST /auth/login`
- `GET /students`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`
- `GET /classes`
- `GET /departments`

## 7) Données mock initiales

Le jeu de données initial est défini dans `mock-api/db.json` :
- étudiants
- classes
- filières
- profile

## 8) Guide de test fonctionnel

1. Démarrer le mock backend (`npm run mock:api`).
2. Démarrer Angular (`npm run start`).
3. Se connecter avec un email valide et un mot de passe de 6+ caractères.
4. Vérifier:
   - redirection dashboard,
   - stats (étudiants, classes, actifs, filières),
   - liste étudiants avec recherche + filtres + tri + pagination,
   - création/modification/suppression étudiant,
   - fiche détail étudiant,
   - CRUD classes,
   - CRUD filières,
   - déconnexion.

## 9) Configuration technique fournie

- Angular 20 standalone + TypeScript strict.
- Angular Router + guard d'authentification.
- Reactive Forms pour tous les formulaires.
- HttpClient + service API centralisé.
- Interceptor JWT + interceptor global d'erreurs.
- Services de notification/snackbar pour succès/erreurs.
- UI Angular Material responsive.
