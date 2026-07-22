<?php

namespace App\Controller;

use App\Repository\DeliveryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/delivery')]
final class DeliveryController extends AbstractController
{

    #[Route('', name: 'app_get_delivery_types', methods: 'GET')]
    public function getDeliveryTypes(DeliveryRepository $deliveryRepository): JsonResponse
    {
        return $this->json($deliveryRepository->findAll());
    }
}
