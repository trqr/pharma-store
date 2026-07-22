<?php

namespace App\Dto;

class LoginDto
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}


    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}
