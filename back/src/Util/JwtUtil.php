<?php

namespace App\Util;

use App\Entity\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtUtil
{
    private const MIN_SECRET_LENGTH = 32;

    public function __construct(
        private readonly string $jwtSecret,
        private readonly int $jwtExpiration,
    ) {
        if (\strlen($this->jwtSecret) < self::MIN_SECRET_LENGTH) {
            throw new \InvalidArgumentException(sprintf(
                'JWT_SECRET must be at least %d characters for HS256 (got %d). Generate one with: openssl rand -base64 32',
                self::MIN_SECRET_LENGTH,
                \strlen($this->jwtSecret)
            ));
        }
    }

    public function generate(User $user): string
    {
        $payload = [
            'sub' => $user->getEmail(),
            'iat' => time(),
            'exp' => time() + $this->jwtExpiration,
        ];

        return JWT::encode(
            $payload,
            $this->jwtSecret,
            'HS256'
        );
    }

    public function decode(string $token): object
    {
        return JWT::decode(
            $token,
            new Key($this->jwtSecret, 'HS256')
        );
    }

    public function isValid(string $token): bool
    {
        try {
            $this->decode($token);

            return true;
        } catch (\Throwable) {
            return false;
        }
    }

}
