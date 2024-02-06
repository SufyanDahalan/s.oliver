# s.Oliver Code Challenge

## Getting started

### Run the backend db migrations

```bash
cd backend;
npm i;
npm run db -- migration:run -d ./src/data-source.ts
```

### seed the newly created sqlite.db

```bash
cd backend;
sqlite3 db.sqlite; # test username:password are set as sufian:mysecretpass

sqlite> .mode csv
sqlite> .import /home/su/git/challenge/soliver/backend/src/seedTables/user.csv user
sqlite> .import /home/su/git/challenge/soliver/backend/src/seedTables/product.csv product
sqlite> .import /home/su/git/challenge/soliver/backend/src/seedTables/cart_product.csv cart_product
```

### Run the backend and frontend:
1. Using docker:

```bash
rm -r ./backend/node_modules # TODO causes hiccups for the backend, investigate the issue
docker-compose -f compose.yaml up;
```

2. Using nix:

```bash
## Backend
nix develop;
cd backend;
npm i;
nodemon .;
## Frontend
nix develop;
cd frontend;
npm i;
npm run dev;
```

## Todo

1. Production Docker
2. Testing
3. CI/CD
