<?php

namespace App\Mapper;

use App\Dto\CreateAddressRequestDto;
use App\Dto\CustomerAddressDto;
use App\Entity\CustomerAddress;
use App\Entity\User;

class CustomerAddressMapper
{
    public function entityToDto(CustomerAddress $customerAddress) : CustomerAddressDto
    {
        return new CustomerAddressDto(
            $customerAddress->getId(),
            $customerAddress->getName(),
            $customerAddress->getAddress(),
            $customerAddress->getZip(),
            $customerAddress->getCity(),
        );
    }

    public function dtoToEntity(CreateAddressRequestDto $requestDto, User $user) : CustomerAddress
    {
        $created = new CustomerAddress();
        $created->setUser($user);
        $created->setName($requestDto->name);
        $created->setAddress($requestDto->address);
        $created->setZip($requestDto->zip);
        $created->setCity($requestDto->city);

        return $created;
    }
}
