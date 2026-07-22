<?php

namespace App\Repository;

use App\Entity\PharmacyProduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PharmacyProduct>
 */
class PharmacyProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PharmacyProduct::class);
    }

    public function findAllPaginated(int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        $queryBuilder =  $this->createQueryBuilder('product')
            ->orderBy('product.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);


        return $queryBuilder->getQuery()->getResult();
    }

//    /**
//     * @return PharmacyProduct[] Returns an array of PharmacyProduct objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PharmacyProduct
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
