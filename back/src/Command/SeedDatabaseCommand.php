<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-database',
    description: 'Import medicines and generate products/stocks on first launch only',
)]
class SeedDatabaseCommand extends Command
{
    public function __construct(
        private readonly Connection $connection,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $medicineCount = (int) $this->connection->fetchOne('SELECT COUNT(*) FROM medicine_reference');
        $productCount = (int) $this->connection->fetchOne('SELECT COUNT(*) FROM pharmacy_product');

        if ($medicineCount > 0 && $productCount > 0) {
            $io->info('Database already seeded, skipping.');

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
}
