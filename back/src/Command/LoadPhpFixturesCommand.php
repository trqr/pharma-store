<?php

namespace App\Command;

use App\Entity\MedicineReference;
use App\Entity\PharmacyProduct;
use App\Entity\Stock;
use App\Entity\Warehouse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:load-php-fixtures',
    description: 'Génère les PharmacyProduct et Stock à partir des données existantes',
)]
class LoadPhpFixturesCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->section('Nettoyage des tables PharmacyProduct et Stock');

        // Supprimer tous les stocks
        $this->entityManager->createQuery('DELETE FROM App\Entity\Stock')->execute();
        $io->info('Table Stock vidée');

        // Supprimer tous les pharmacy_products
        $this->entityManager->createQuery('DELETE FROM App\Entity\PharmacyProduct')->execute();
        $io->info('Table PharmacyProduct vidée');

        $io->section('Génération des PharmacyProduct');

        // Récupérer tous les médicaments
        $medicines = $this->entityManager->getRepository(MedicineReference::class)->findAll();

        if (empty($medicines)) {
            $io->warning('Aucun médicament trouvé en base. Veuillez d\'abord importer les médicaments.');
            return Command::FAILURE;
        }

        $pharmacyProducts = [];
        foreach ($medicines as $medicine) {

            if (rand(1, 100) >= 30) {
                continue;
            }

            $product = new PharmacyProduct();
            $product->setMedicine($medicine);

            // Prix = prix du médicament + marge aléatoire (10-30%)
            $basePrice = $medicine->getPrice() ?? 10.0;
            $product->setPrice(round($basePrice, 2));

            // 80% des produits sont activés
            $product->setEnabled(rand(1, 100) <= 80);

            // 20% des produits ont une promotion
            if (rand(1, 100) <= 20) {
                $promotionPrice = $product->getPrice() * (rand(70, 90) / 100);
                $product->setPromotionPrice(round($promotionPrice, 2));
            }

            $this->entityManager->persist($product);
            $pharmacyProducts[] = $product;
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d PharmacyProduct générés', count($pharmacyProducts)));

        $io->section('Génération des Stocks');

        // Récupérer tous les entrepôts
        $warehouses = $this->entityManager->getRepository(Warehouse::class)->findAll();

        if (empty($warehouses)) {
            $io->warning('Aucun entrepôt trouvé en base.');
            return Command::FAILURE;
        }

        $stockCount = 0;
        foreach ($pharmacyProducts as $product) {
            foreach ($warehouses as $warehouse) {
                // 70% de chance d'avoir du stock dans cet entrepôt
                if (rand(1, 100) <= 70) {
                    $stock = new Stock();
                    $stock->setProduct($product);
                    $stock->setWarehouse($warehouse);
                    // Stock aléatoire entre 0 et 500
                    $stock->setStock(rand(0, 200));

                    $this->entityManager->persist($stock);
                    $stockCount++;
                }
            }
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d Stocks générés', $stockCount));

        return Command::SUCCESS;
    }
}
