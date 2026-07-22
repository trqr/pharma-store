<?php

namespace App\Mapper;

use App\Dto\CartItemDto;
use App\Entity\CartItem;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class CartMapper
{

    public function __construct(
        private readonly PharmacyProductMapper $productMapper,
    ) {
    }
    public function entityToCartDto(Collection $cartItems): Collection
    {
        $cartDto = new ArrayCollection();
        foreach ($cartItems as $cartItem) {
            $item = new CartItemDto(
                $cartItem->getId(),
                $this->productMapper->mapToDto($cartItem->getProduct(), $cartItem->getProduct()->getMedicine()),
                $cartItem->getQuantity());
            $cartDto->add($item);
        }
        return $cartDto;
    }

    public function entityToItemDto(CartItem $cartItem): CartItemDto
    {
        return new CartItemDto(
            $cartItem->getId(),
            $this->productMapper->mapToDto($cartItem->getProduct(), $cartItem->getProduct()->getMedicine()),
            $cartItem->getQuantity());
    }
}
