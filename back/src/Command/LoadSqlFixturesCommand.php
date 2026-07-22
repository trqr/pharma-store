<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:load-sql-fixtures',
    description: 'Execute all SQL files from /fixtures folder',
)]
class LoadSqlFixturesCommand extends Command
{
    public function __construct(
        private readonly Connection $connection,
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $fixturesDir = $this->projectDir . '/fixtures';

        if (!is_dir($fixturesDir)) {
            $io->error("Directory not found: {$fixturesDir}");

            return Command::FAILURE;
        }

        $sqlFiles = glob($fixturesDir . '/*.sql');

        sort($sqlFiles);

        if (empty($sqlFiles)) {
            $io->warning('No SQL files found.');

            return Command::SUCCESS;
        }

        foreach ($sqlFiles as $sqlFile) {
            $filename = basename($sqlFile);

            $io->section("Executing {$filename}");

            try {
                $sql = file_get_contents($sqlFile);

                if ($sql === false) {
                    throw new \RuntimeException("Unable to read {$filename}");
                }

                // Split queries by ;
                $queries = array_filter(
                    array_map('trim', explode(';', $sql))
                );

                foreach ($queries as $query) {

                    if (empty($query)) {
                        continue;
                    }

                    $this->connection->executeStatement($query);
                }

                $io->success("✅ {$filename} executed");

            } catch (\Throwable $e) {

                $io->error($e->getMessage());

                return Command::FAILURE;
            }
        }

        $io->success('All SQL fixtures executed successfully.');

        return Command::SUCCESS;
    }
}
