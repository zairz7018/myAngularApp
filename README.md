# Application Angular - Gestion des étudiants

## 1) Arborescence

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
    ├── environments/environment.ts
    └── app/
        ├── app.component.ts
        ├── app.routes.ts
        ├── layout/main-layout.component.ts
        ├── models/
        ├── services/api.service.ts
        ├── core/
        │   ├── guards/auth.guard.ts
        │   ├── interceptors/
        │   └── services/
        └── features/
            ├── auth/login.component.ts
            ├── pages/dashboard/dashboard.component.ts
            ├── students/
            ├── classes/classes.component.ts
            └── departments/departments.component.ts
```

## 2) Commandes d'installation

```bash
npm install
```

## 3) Commandes de génération Angular CLI (référence)

```bash
npx @angular/cli@20 new student-management-app --standalone --routing --style=scss --strict
ng generate component features/auth/login --standalone
ng generate component features/pages/dashboard/dashboard --standalone
ng generate component features/students/student-list --standalone
ng generate component features/students/student-form --standalone
ng generate component features/students/student-detail --standalone
ng generate component features/classes/classes --standalone
ng generate component features/departments/departments --standalone
```

## 4) Lancer le backend mock

```bash
npm run mock:api
```

## 5) Lancer l'application

```bash
npm start
```

## 6) Endpoints REST exposés

- `POST /auth/login`
- `GET /students`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`
- `GET /classes`
- `GET /departments`

## 7) Jeu de données initial

Voir `mock-api/db.json`.

## 8) Test des fonctionnalités

1. Connexion avec email + mot de passe (>= 6 caractères).
2. Navigation dashboard/students/classes/departments.
3. CRUD étudiant + détail + édition.
4. CRUD classes.
5. CRUD filières.
6. Recherche, tri, pagination sur la liste étudiants.

## 9) Vérification finale de cohérence

- Architecture standalone Angular moderne.
- TypeScript strict.
- Reactive Forms.
- Router + guard.
- HttpClient + service API centralisé.
- Interceptor JWT + interceptor d'erreur.
- UI Angular Material.
- Mock backend prêt à démarrer.
