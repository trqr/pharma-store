<?php

namespace App\Dto;

class PaginatedResponseDto
{
    public function __construct(
        public int $page,
        public int $limit,
        public int $totalProducts,
        public int $pages
    ) {}
}
