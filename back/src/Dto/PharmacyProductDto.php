<?php

namespace App\Dto;

use App\Entity\MedicineReference;
use phpDocumentor\Reflection\Types\Boolean;

class PharmacyProductDto
{
    public function __construct(
        public int $id,
        public ?int $productId,
        public ?string $cis,
        public ?string $name,
        public ?float $price,
        public ?int $genericGroup,
        public ?string $activeSubstances,
        public ?string $description,
        public bool $isEnabled,
        public ?float $promotionPrice = null,
        public int $quantity,
    ) {}
}
