<?php

namespace App\Mapper;

use App\Dto\CartItemDto;
use App\Dto\PharmacyProductDto;
use App\Dto\UserDto;
use App\Entity\CartItem;
use App\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;

class UserMapper
{

    public function __construct(
        private readonly CartMapper $cartMapper
    ) {
    }
    public function userToDto(User $user): UserDto
    {
        $cartItems = $user->getCartItems();
        $notOrderedItems = $cartItems->filter(fn(CartItem $item) => $item->getPurchase() === null);

        $itemsOutPut = $this->cartMapper->entityToCartDto($notOrderedItems);

        return new UserDto(
            $user->getId(),
            $user->getEmail(),
            $user->getRole(),
            $itemsOutPut,
        );
    }
}
