<?php

namespace App\Dto;

class CustomerAddressDto
{
    public function __construct(
        public int $id,
        public string $name,
        public string $address,
        public int $zip,
        public string $city,
    ){}

}
