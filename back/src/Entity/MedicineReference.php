<?php

namespace App\Entity;

use App\Repository\MedicineReferenceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MedicineReferenceRepository::class)]
class MedicineReference
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $cis = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?float $price = null;

    #[ORM\Column(nullable: true)]
    private ?int $genericGroup = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $activeSubstances = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\OneToOne(
        targetEntity: PharmacyProduct::class,
        mappedBy: 'medicine'
    )]
    private ?PharmacyProduct $product = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCis(): ?string
    {
        return $this->cis;
    }

    public function setCis(string $cis): static
    {
        $this->cis = $cis;

        return $this;
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

    public function setPrice(?float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getGenericGroup(): ?int
    {
        return $this->genericGroup;
    }

    public function setGenericGroup(?int $genericGroup): static
    {
        $this->genericGroup = $genericGroup;

        return $this;
    }

    public function getActiveSubstances(): ?string
    {
        return $this->activeSubstances;
    }

    public function setActiveSubstances(?string $activeSubstances): static
    {
        $this->activeSubstances = $activeSubstances;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getProduct(): ?PharmacyProduct
    {
        return $this->product;
    }

    public function setProduct(?PharmacyProduct $product): static
    {
        $this->product = $product;

        return $this;
    }
}
