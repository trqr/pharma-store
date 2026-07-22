<?php

namespace App\Controller;

use App\Dto\LoginDto;
use App\Dto\RegisterDto;
use App\Entity\User;
use App\Mapper\UserMapper;
use App\Repository\UserRepository;
use App\Util\JwtUtil;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/auth')]
final class AuthController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserMapper $mapper,
        private readonly JwtUtil $jwtUtil,
        private readonly SerializerInterface $serializer,
        private readonly UserRepository $userRepository
    ) {
    }


    #[Route('/register', name: 'app_register', methods: 'POST')]
    function register(Request $request): JsonResponse {

        $requestDto = $this->serializer->deserialize($request->getContent(), RegisterDto::class, 'json');

        $matches = $this->userRepository->findOneBy(['email' => $requestDto->getEmail()]);

        if ($matches) {
            throw new BadRequestHttpException('Ce email existe déjà');
        }

        $created = new User();

        $hashedPassword = $this->passwordHasher->hashPassword($created, $requestDto->getPassword());

        $created->setEmail($requestDto->getEmail());
        $created->setPassword($hashedPassword);

        $this->entityManager->persist($created);
        $this->entityManager->flush();

        $jwt = $this->jwtUtil->generate($created);

        return $this->json([
            'user' => $this->mapper->userToDto($created),
            'token' => $jwt
        ]);
    }

    #[Route('/login', name: 'app_login', methods: 'POST')]
    public function login(Request $request): JsonResponse
    {
        $requestDto = $this->serializer->deserialize($request->getContent(), LoginDto::class, 'json');

        $user = $this->userRepository->findOneBy(['email' => $requestDto->getEmail()]);

        if (!$user) {
            throw new BadRequestHttpException('Utilisateur ou mot de passe incorrect');
        }

        $matches = password_verify($requestDto->getPassword(), $user->getPassword());

        if (!$matches) {
            throw new BadRequestHttpException('Utilisateur ou mot de passe incorrect');
        }

        $jwt = $this->jwtUtil->generate($user);

        return $this->json([
            'user' => $this->mapper->userToDto($user),
            'token' => $jwt
        ]);
    }

    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    #[Route('/me', name: 'app_me', methods: 'GET')]
    public function me(): JsonResponse
    {
        return $this->json([
            'user' => $this->mapper->userToDto($this->getUser()),
            'token' => $this->jwtUtil->generate($this->getUser())
        ]);
    }
}
