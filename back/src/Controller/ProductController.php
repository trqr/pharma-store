<?php

namespace App\Controller;

use App\Dto\PaginatedResponseDto;
use App\Mapper\PharmacyProductMapper;
use App\Repository\MedicineReferenceRepository;
use App\Repository\PharmacyProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products')]
final class ProductController extends AbstractController
{

    #[Route('/medicines', name: 'app_medicines', methods: 'GET')]
    public function getMedicines(
        Request $request,
        MedicineReferenceRepository $medicineRepo,
        PharmacyProductRepository $productRepo,
        PharmacyProductMapper $mapper
    ): JsonResponse
    {
        $page = $request->query->get('page') ?? 1;
        $limit = $request->query->get('limit') ?? 20;
        $search = $request->query->get('search');

        $products = $medicineRepo->findAllPaginated($page, $limit, $search);

        $totalProducts = $medicineRepo->countSearch($search);
        $totalPages = ceil($totalProducts / $limit);

        $productDto = array_map(fn($med) => $mapper->mapToDto($med->getProduct(), $med), $products);

        return $this->json([
            'data' => $productDto,
            'pagination' => new PaginatedResponseDto($page, $limit, $totalProducts, $totalPages)
        ]);
    }

    #[Route('', name: 'app_products', methods: 'GET')]
    public function getProducts(
        Request $request,
        PharmacyProductRepository $productRepo,
        PharmacyProductMapper $mapper
    ): JsonResponse
    {
        $page = $request->query->get('page') ?? 1;
        $limit = $request->query->get('limit') ?? 20;

        $products = $productRepo->findAllPaginated($page, $limit);

        $totalProducts = $productRepo->count();
        $totalPages = ceil($totalProducts / $limit);

        $outputDto = array_map(fn($product) => $mapper->mapToDto($product, $product->getMedicine()), $products);


        return $this->json([
            'data' => $outputDto,
            'pagination' => new PaginatedResponseDto($page, $limit, $totalProducts, $totalPages)
        ]);    }

}
