<?php

namespace App\Command;

use App\Entity\Delivery;
use App\Entity\PaymentMethod;
use App\Entity\PromoCode;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-database',
    description: 'Seed reference data, import medicines and generate products on first launch',
)]
class SeedDatabaseCommand extends Command
{
    public function __construct(
        private readonly Connection $connection,
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $this->seedDeliveries($io);
        $this->seedPromoCodes($io);
        $this->seedPaymentMethods($io);

        $medicineCount = (int) $this->connection->fetchOne('SELECT COUNT(*) FROM medicine_reference');
        $productCount = (int) $this->connection->fetchOne('SELECT COUNT(*) FROM pharmacy_product');

        if ($medicineCount > 0 && $productCount > 0) {
            $io->info('Medicines and products already present, skipping catalog seed.');
            $io->success('Database seed completed.');

            return Command::SUCCESS;
        }

        $application = $this->getApplication();
        if ($application === null) {
            $io->error('Console application is not available.');

            return Command::FAILURE;
        }

        $application->setAutoExit(false);

        if ($medicineCount === 0) {
            $io->section('Importing medicines');
            $code = $application->find('app:import-medicines')->run(new ArrayInput([]), $output);
            if ($code !== Command::SUCCESS) {
                return Command::FAILURE;
            }
        } else {
            $io->info(sprintf('Medicines already present (%d), skipping import.', $medicineCount));
        }

        if ($productCount === 0) {
            $io->section('Generating pharmacy products and stocks');
            $code = $application->find('app:load-php-fixtures')->run(new ArrayInput([]), $output);
            if ($code !== Command::SUCCESS) {
                return Command::FAILURE;
            }
        } else {
            $io->info(sprintf('Products already present (%d), skipping fixtures.', $productCount));
        }

        $io->success('Database seed completed.');

        return Command::SUCCESS;
    }

    private function seedDeliveries(SymfonyStyle $io): void
    {
        if ((int) $this->connection->fetchOne('SELECT COUNT(*) FROM delivery') > 0) {
            $io->info('Deliveries already present, skipping.');

            return;
        }

        $io->section('Seeding delivery methods');

        $defaults = [
            ['Standart à domicile', 9.99, 3, 7],
            ['Express', 14.99, 1, 2],
            ['Standart en point relais', 3.99, 3, 7],
        ];

        foreach ($defaults as [$name, $price, $minDays, $maxDays]) {
            $delivery = new Delivery();
            $delivery->setName($name);
            $delivery->setPrice($price);
            $delivery->setMinDeliveryDays($minDays);
            $delivery->setMaxDeliveryDays($maxDays);
            $this->entityManager->persist($delivery);
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d delivery methods created.', count($defaults)));
    }

    private function seedPromoCodes(SymfonyStyle $io): void
    {
        if ((int) $this->connection->fetchOne('SELECT COUNT(*) FROM promo_code') > 0) {
            $io->info('Promo codes already present, skipping.');

            return;
        }

        $io->section('Seeding promo codes');

        $promo = new PromoCode();
        $promo->setCode('SUMMER2026');
        $promo->setDiscount(30);
        $promo->setActive(true);
        $this->entityManager->persist($promo);
        $this->entityManager->flush();

        $io->success('Promo code SUMMER2026 created.');
    }

    private function seedPaymentMethods(SymfonyStyle $io): void
    {
        if ((int) $this->connection->fetchOne('SELECT COUNT(*) FROM payment_method') > 0) {
            $io->info('Payment methods already present, skipping.');

            return;
        }

        $io->section('Seeding payment methods');

        $defaults = [
            ['bank_transfer', true],
            ['card', true],
            ['cash', false],
        ];

        foreach ($defaults as [$name, $active]) {
            $method = new PaymentMethod();
            $method->setName($name);
            $method->setActive($active);
            $this->entityManager->persist($method);
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d payment methods created.', count($defaults)));
    }
}
