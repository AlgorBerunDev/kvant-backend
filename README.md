## Migrate in local

```
npx prisma migrate dev
```

## Push migration to database

```
npx prisma migrate dev --name init
npx prisma db push
```

## Migrate to production

```
npx prisma migrate deploy
```

## Start in production

- `pm2 start npm --name "KvantBackend3026" -- run "start:prod"` for add pm2
- `pm2 restart KvantBackend3026`
