<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\Payment;
use App\Mapper\OrderMapper;
use App\Repository\CartItemRepository;
use App\Repository\CustomerAddressRepository;
use App\Repository\DeliveryRepository;
use App\Repository\OrderRepository;
use App\Repository\PaymentMethodRepository;
use App\Repository\PromoCodeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/order')]
final class OrderController extends AbstractController
{

    public function __construct(
        private readonly OrderMapper $orderMapper,
    )
    {
    }
    #[Route('', name: 'app_user_orders', methods: 'GET')]
    public function getUserOrders(OrderRepository $orderRepository): JsonResponse
    {
        $user = $this->getUser();
        $orders = $orderRepository->findBy(['user' => $user]);

        $outputDto = array_map(fn(Order $order) => $this->orderMapper->entityToDto($order, $user->getUserIdentifier()), $orders);

        return $this->json($outputDto);
    }

    #[Route('/create', name: 'app_order_create', methods : 'POST')]
    public function create(
        Request $request,
        CartItemRepository $cartItemRepository,
        DeliveryRepository $deliveryRepository,
        CustomerAddressRepository $addressRepository,
        PromoCodeRepository $promoCodeRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $itemIds = $data['ids'];
        $deliveryTypeId = $data['deliveryId'];
        $deliveryAddressId = $data['deliveryAddressId'];
        $promoCode = $data['promoCode'] ?? null;

        $created = new Order();
        $itemsPrice = 0;
        $delivery = $deliveryRepository->find($deliveryTypeId);
        if (!$delivery) { throw new NotFoundHttpException('Veuillez selectionner un mode de livraison');}
        $deliveryAddress = $addressRepository->find($deliveryAddressId);
        if (!$deliveryAddress) { throw new NotFoundHttpException('Adresse de livraison introuvable');}
        $isPromotionCodeActive = $promoCodeRepository->findOneBy(['code' => $promoCode, 'active' => true]);


        foreach ($itemIds as $itemId) {
            $cartItem = $cartItemRepository->find($itemId);

            if ($cartItem->getPurchase()) { throw new \Exception('Item already in order');}
            if ($cartItem->getUser() !== $this->getUser()) { throw new BadRequestHttpException('Unauthorized');}

            $created->addItem($cartItem);

            $cartItem->setPurchase($created);
            $entityManager->persist($cartItem);

            $itemsPrice += $cartItem->getProduct()->getPromotionPrice() ?? $cartItem->getProduct()->getPrice() ?? 0 * $cartItem->getQuantity();
        }

        if ($isPromotionCodeActive) {
             $itemsPrice -= $isPromotionCodeActive->getDiscount() * $itemsPrice / 100;
        }
        $totalPrice = $itemsPrice + $delivery->getPrice();
        $totalPrice = round($totalPrice, 2);

        $created->setUser($this->getUser());
        $created->setStatus('pending');
        $created->setTotalPrice($totalPrice);
        $created->setPromoCode($isPromotionCodeActive ?? null);
        $created->setDeliveryType($delivery);
        $created->setDeliveryAddress($deliveryAddress->getName().', '.$deliveryAddress->getAddress().' '.$deliveryAddress->getZip().' '.$deliveryAddress->getCity());
        $entityManager->persist($created);
        $entityManager->flush();

        $outputDto = $this->orderMapper->entityToDto($created, $this->getUser()->getUserIdentifier());

        return $this->json($outputDto, 202);
    }


    #[Route('/payment', name: 'app_order_payment', methods: 'POST')]
    public function orderPayment(
        Request $request,
        OrderRepository $orderRepository,
        PaymentMethodRepository $paymentMethodRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $creditCardNumber = $data['creditCardNumber'];
        $creditCardExpirationDate = $data['creditCardExpirationDate'];
        $creditCardCvv = $data['creditCardCvv'];
        $orderId = $data['orderId'];
        $paymentMethodId = $data['paymentMethodId'];
        $paymentAmount = $data['paymentAmount'];

        $order = $orderRepository->find($orderId);

        if ($creditCardNumber != '4242424242424242')
        {
            $order->setStatus('payment_failed');
            $entityManager->persist($order);
            $entityManager->flush();

            return $this->json([
                'error' => 'Invalid credit card number',
                'success' => false
            ], 403);
        }

        if ($order->getStatus() != 'pending')
        {
            return $this->json([
                'error' => 'Order already paid',
                'success' => false
            ], 403);
        }

        if ($paymentAmount != $order->getTotalPrice())
        {
            return $this->json([
                'error' => 'Invalid payment amount',
                'success' => false
            ], 403);
        }

        $paymentMethod = $paymentMethodRepository->find($paymentMethodId);
        $payment = new Payment();
        $payment->setPaymentMethod($paymentMethod);
        $payment->setAmount($paymentAmount);
        $payment->setPurchase($order);
        $payment->setUser($order->getUser());
        $entityManager->persist($payment);

        $order->setStatus('paid');
        $order->setPayment($payment);
        $entityManager->persist($order);
        $entityManager->flush();

        return $this->json([
            'message' => 'Payment successful',
            'success' => true
        ], 202);

    }
}
