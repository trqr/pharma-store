<?php

namespace App\Command;

use App\Service\ImportMedicinesService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import-medicines',
    description: 'Import all medicines from API'
)]
class ImportMedicinesCommand extends Command
{
    public function __construct(
        private ImportMedicinesService $importMedicinesService
    ) {
        parent::__construct();
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output
    ): int {

        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $output->writeln('');
        $output->writeln('Starting medicines import...');
        $output->writeln('');

        $start = microtime(true);

        $result = $this->importMedicinesService->import();

        $duration = round(
            microtime(true) - $start,
            2
        );

        $output->writeln('');
        $output->writeln(sprintf(
            'Import completed : %d medicines imported in %ss',
            $result['imported'],
            $duration
        ));
        $output->writeln('');

        return Command::SUCCESS;
    }
}
