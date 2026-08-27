<?php

namespace App\Controller;

use App\Dto\CreateAddressRequestDto;
use App\Entity\CustomerAddress;
use App\Entity\User;
use App\Mapper\CustomerAddressMapper;
use App\Mapper\UserMapper;
use App\Repository\CustomerAddressRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use function PHPSTORM_META\map;

#[Route('/api/users')]
final class UserController extends AbstractController
{

    public function __construct(
        private readonly CustomerAddressMapper $customerAddressMapper,
    )
    {
    }

    #[Route('', name: 'app_users', methods: 'GET')]
    public function getUsers(UserRepository $userRepo, UserMapper $mapper): JsonResponse
    {
        $users = $userRepo->findAll();

        $userDtos = array_map(fn(User $user) => $mapper->userToDto($user), $users);

        return $this->json($userDtos);
    }

    #[Route('/addresses', name: 'app_user_addresses', methods: 'GET')]
    public function getAddresses(CustomerAddressRepository $addressRepo): JsonResponse
    {
        $user = $this->getUser();

        $addresses = $addressRepo->findBy(['user' => $user], limit: 6);

        $outputDto = array_map(fn(CustomerAddress $address) =>
            $this->customerAddressMapper->entityToDto($address), $addresses);

        return $this->json($outputDto);
    }

    #[Route('/addresses/create', name: 'app_user_addresses_create', methods: 'POST')]
    public function createAddress(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $data = $serializer->deserialize($request->getContent(), CreateAddressRequestDto::class, 'json');

        $user = $this->getUser();

        $address = $this->customerAddressMapper->dtoToEntity($data, $user);

        $entityManager->persist($address);
        $entityManager->flush();

        $outputDto = $this->customerAddressMapper->entityToDto($address);

        return $this->json($outputDto);
    }
}
