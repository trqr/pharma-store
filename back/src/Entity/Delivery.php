<?php

namespace App\Entity;

use App\Repository\DeliveryRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DeliveryRepository::class)]
class Delivery
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column]
    private ?int $minDeliveryDays = null;

    #[ORM\Column]
    private ?int $maxDeliveryDays = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }
    public function getMinDeliveryDays(): ?int
    {
        return $this->minDeliveryDays;
    }

    public function setMinDeliveryDays(int $minDeliveryDays): static
    {
        $this->minDeliveryDays = $minDeliveryDays;

        return $this;
    }

    public function getMaxDeliveryDays(): ?int
    {
        return $this->maxDeliveryDays;
    }

    public function setMaxDeliveryDays(int $maxDeliveryDays): static
    {
        $this->maxDeliveryDays = $maxDeliveryDays;

        return $this;
    }
}
