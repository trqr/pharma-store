<?php

namespace App\Service;

use App\Entity\MedicineReference;
use App\Repository\MedicineReferenceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ImportMedicinesService
{
    public function __construct(
        private HttpClientInterface $httpClient,
        private EntityManagerInterface $em,
        private MedicineReferenceRepository $medicineRepository
    ) {}

    public function import(): array
    {
        $response = $this->httpClient->request(
            'GET',
            'https://medicaments-api.giygas.dev/v1/medicaments/export'
        );

        $medicines = $response->toArray();

        $count = 0;

        foreach ($medicines as $medicineData) {

            $cis = $medicineData['cis'] ?? null;

            if (!$cis) {
                continue;
            }

            $existing = $this->medicineRepository->findOneBy([
                'cis' => $cis
            ]);

            if ($existing) {
                continue;
            }

            $medicine = new MedicineReference();

            $medicine->setCis($cis);

            $medicine->setName(
                $medicineData['elementPharmaceutique']
                    ?? 'Unknown'
            );

            $price = null;

            if (!empty($medicineData['presentation'])) {

                foreach ($medicineData['presentation'] as $presentation) {

                    if (isset($presentation['prix'])) {
                        $price = (float)$presentation['prix'];
                        break;
                    }
                }
            }

            $medicine->setPrice($price);

            $genericGroup = null;

            if (!empty($medicineData['generiques'][0]['group'])) {
                $genericGroup =
                    (int)$medicineData['generiques'][0]['group'];
            }

            $medicine->setGenericGroup($genericGroup);

            $substances = [];

            if (!empty($medicineData['composition'])) {

                foreach ($medicineData['composition'] as $composition) {

                    if (!empty($composition['denominationSubstance'])) {

                        $substances[] =
                            $composition['denominationSubstance'];
                    }
                }
            }

            $medicine->setDescription($medicineData['formePharmaceutique']) ?? null;

            $medicine->setActiveSubstances(
                implode(', ', array_unique($substances))
            );

            $medicine->setCreatedAt(
                new \DateTimeImmutable()
            );

            $this->em->persist($medicine);

            $count++;

            if ($count % 500 === 0) {

                $this->em->flush();
                $this->em->clear();

                gc_collect_cycles();
            }
        }

        $this->em->flush();

        return [
            'imported' => $count
        ];
    }
}
