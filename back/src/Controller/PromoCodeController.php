<?php

namespace App\Controller;

use App\Repository\PromoCodeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/promo-codes')]
final class PromoCodeController extends AbstractController
{
    #[Route('/validate', name: 'app_promo_code_validate', methods: 'GET')]
    public function validate(Request $request, PromoCodeRepository $promoCodeRepository): Response
    {
        $code = $request->query->get('code');
        $promoCode = $promoCodeRepository->findOneBy(['code' => $code, 'active' => true]);

        if (!$promoCode) {
            return $this->json(['error' => 'Invalid promo code'], 404);
        }

        return $this->json($promoCode);
    }
}
