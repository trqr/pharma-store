#!/bin/sh
set -e

echo "Waiting for MySQL..."
attempt=0
until php bin/console dbal:run-sql "SELECT 1" --env=prod; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    echo "Database check failed after $attempt attempts (see errors above)."
    exit 1
  fi
  echo "Database not ready, retrying in 2 seconds... ($attempt/30)"
  sleep 2
done

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --env=prod

echo "Seeding database (first launch only)..."
php bin/console app:seed-database --env=prod --no-interaction

echo "Warming cache..."
php bin/console cache:clear --env=prod --no-warmup
php bin/console cache:warmup --env=prod

exec php-fpm
