<?php

namespace App\Dto;

use DateTimeImmutable;

class OrderDto
{
    public function __construct(
        public int               $id,
        public string            $userEmail,
        public string            $status,
        public string            $paymentMethod,
        public array             $cartItems,
        public float             $total,
        public string            $deliveryName,
        public float             $deliveryPrice,
        public string            $deliveryAddress,
        public ?string           $promoCode,
        public ?float           $discount = 0,
        public DateTimeImmutable $createdAt
    )
    {}
}
