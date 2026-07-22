#!/bin/sh
set -e

echo "Waiting for MySQL..."
until php bin/console dbal:run-sql "SELECT 1" --env=prod > /dev/null 2>&1; do
  sleep 2
done

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --env=prod

echo "Warming cache..."
php bin/console cache:clear --env=prod --no-warmup
php bin/console cache:warmup --env=prod

exec php-fpm
