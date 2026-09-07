<?php

namespace App\EventListener;

use App\Entity\Order;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::RESPONSE)]
final class StripNestedJsonLdMetadataListener
{
    public function __invoke(ResponseEvent $event): void
    {
        if ($event->getRequest()->attributes->get('_api_resource_class') !== Order::class) {
            return;
        }

        $response = $event->getResponse();
        $data = json_decode($response->getContent(), true);
        if (!\is_array($data)) {
            return;
        }

        foreach ($data as $key => $value) {
            if (!\is_array($value) || str_starts_with((string) $key, '@')) {
                continue;
            }

            unset($data[$key]['@id'], $data[$key]['@type'], $data[$key]['@context']);
        }

        $response->setContent(json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
    }
}
