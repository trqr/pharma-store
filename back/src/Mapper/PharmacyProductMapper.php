<?php

namespace App\Mapper;

use App\Dto\PharmacyProductDto;
use App\Entity\MedicineReference;
use App\Entity\PharmacyProduct;
use function PHPSTORM_META\map;

class PharmacyProductMapper
{
    public function mapToDto(?PharmacyProduct $product, ?MedicineReference $medicine): PharmacyProductDto
    {
        if (!$product) {
            return new PharmacyProductDto(
                $medicine->getId(),
                null,
                $medicine->getCis(),
                $medicine->getName(),
                $medicine->getPrice(),
                $medicine->getGenericGroup(),
                $medicine->getActiveSubstances(),
                $medicine->getDescription(),
                false,
                null,
                0,
            );
        }

        $totalQuantity = $product->getStocks()->reduce(fn($total, $stock) => $total + $stock->getStock(), 0);

        return new PharmacyProductDto(
            $medicine->getId(),
            $product->getId(),
            $medicine->getCis(),
            $medicine->getName(),
            $medicine->getPrice(),
            $medicine->getGenericGroup(),
            $medicine->getActiveSubstances(),
            $medicine->getDescription(),
            $product->isEnabled(),
            $product->getPromotionPrice(),
            $totalQuantity
        );
    }
}
