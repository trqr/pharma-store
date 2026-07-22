<?php

namespace App\Dto;

class CreateAddressRequestDto
{
    public function __construct(
        public string $name,
        public string $address,
        public int $zip,
        public string $city,
    ){}
}
