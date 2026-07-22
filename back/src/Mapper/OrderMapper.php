<?php

namespace App\Mapper;

use App\Dto\OrderDto;
use App\Entity\Order;

readonly class OrderMapper
{

    public function __construct(
        private CartMapper $cartMapper
    ) {
    }
    public function entityToDto(Order $order, string $userEmail) : OrderDto
    {
        $cartDto = $this->cartMapper->entityToCartDto($order->getItems());

        $paymentMethod = $order->getPayment()?->getPaymentMethod()->getName();

        return new OrderDto(
            $order->getId(),
            $userEmail,
            $order->getStatus(),
            $paymentMethod ?? 'En attente de paiement',
            $cartDto->toArray(),
            $order->getTotalPrice(),
            $order->getDeliveryType()->getName(),
            $order->getDeliveryType()->getPrice(),
            $order->getDeliveryAddress(),
            $order->getPromoCode()?->getCode(),
            $order->getPromoCode()?->getDiscount() ?? 0,
            $order->getCreatedAt(),
        );
    }

}
