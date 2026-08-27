<?php

namespace App\Controller;

use App\Entity\CartItem;
use App\Entity\PharmacyProduct;
use App\Mapper\CartMapper;
use App\Repository\CartItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Event\Telemetry\System;
use SebastianBergmann\Environment\Console;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/cart')]
final class CartController extends AbstractController
{

    public function __construct(
        private readonly CartMapper $mapper,
        private readonly EntityManagerInterface $entityManager,
    ){}

    #[Route('', name: 'app_cart_items', methods: 'GET')]
    public function getCartItems(): JsonResponse
    {
        $cartItems = $this->getUser()->getCartItems()->filter(fn(CartItem $item) => $item->getPurchase() === null);
        $dto = $this->mapper->entityToCartDto($cartItems);

        return $this->json($dto);
    }

    #[Route('/add/{id}', name: 'app_cart_add_item', methods: 'POST')]
    public function addToCart(Request $request, PharmacyProduct $product) : JsonResponse
    {
        $quantity = $request->query->get('quantity') ?? 1;
        $totalStock = [];
        $highestStock = 0;
        $stocks = $product->getStocks();

        foreach ($stocks as $stock) {

            $warehouseStock = $stock->getStock();

            if ($warehouseStock > $highestStock) {
                $highestStock = $warehouseStock;
            }

            $totalStock[] = $warehouseStock;
        }

        if ($highestStock < $quantity) {
            throw new \Exception('Pas assez de stock disponible dans nos entrepots');
        }

        $created = new CartItem();
        $created->setUser($this->getUser());
        $created->setProduct($product);
        $created->setQuantity($quantity);

        $this->entityManager->persist($created);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Item added to cart',
            'item' => $this->mapper->entityToItemDto($created),
            'totalStock' => $totalStock
        ]);
    }

    #[Route('/remove/{id}', name: 'app_cart_remove_item', methods: 'DELETE')]
    public function removeFromCart(CartItem $cartItem) : JsonResponse
    {
        if ($cartItem->getUser() !== $this->getUser())
            return $this->json(['error' => 'Unauthorized'], 403);

        $this->entityManager->remove($cartItem);
        $this->entityManager->flush();

        return $this->json(['message' => 'Item removed from cart']);
    }
}
