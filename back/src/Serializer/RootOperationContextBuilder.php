<?php

namespace App\Serializer;

use ApiPlatform\State\SerializerContextBuilderInterface;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\AutowireDecorated;
use Symfony\Component\HttpFoundation\Request;

#[AsDecorator('api_platform.serializer.context_builder')]
final readonly class RootOperationContextBuilder implements SerializerContextBuilderInterface
{
    public function __construct(
        #[AutowireDecorated]
        private SerializerContextBuilderInterface $decorated,
    ) {
    }

    public function createFromRequest(Request $request, bool $normalization, ?array $attributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $attributes);
        $context['root_operation'] ??= $context['operation'] ?? null;
        $context['root_operation_name'] ??= $context['operation_name'] ?? null;

        return $context;
    }
}
