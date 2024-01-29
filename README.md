# s.Oliver Code Challenge

## Getting started

1. Run the backend db migrations

```bash
cd backend;
npm i;
npm run db -- migration:run -d ./src/data-source.ts
```
2. seed the newly created sqlite.db
```bash
cd backend;
sqlite3 db.sqlite; # test username:password are set as sufian:mysecretpass

sqlite> .mode csv
sqlite> .import /home/su/git/challenge/soliver/backend/src/seedTables/user.csv user
sqlite> .import /home/su/git/challenge/soliver/backend/src/seedTables/product.csv product
sqlite> .import /home/su/git/challenge/soliver/backend/src/seedTables/cart_product.csv cart_product
```
3. Run the dev docker containers
```bash
rm -r ./backend/node_modules # TODO causes hiccups for the backend, investigate the issue
docker-compose -f compose.yaml up;
```


## Todo

1. Production Docker
2. Testing
3. CI/CD