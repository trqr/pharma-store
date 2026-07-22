<?php

namespace App\Dto;

use Doctrine\Common\Collections\Collection;

class UserDto
{
    public function __construct(
        public int $id,
        public string $email,
        public string $role,
        public Collection $cartItems
    ) {}
}

