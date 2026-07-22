<?php

namespace App\Dto;

class CartItemDto
{
    public function __construct(
        public int $id,
        public PharmacyProductDto $product,
        public int $quantity,
    )
    {}
}
