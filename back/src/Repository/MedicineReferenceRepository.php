<?php

namespace App\Repository;

use App\Entity\MedicineReference;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MedicineReference>
 */
class MedicineReferenceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MedicineReference::class);
    }

    public function findAllPaginated(int $page = 1, int $limit = 20, ?string $search = null): array
    {
        $offset = ($page - 1) * $limit;

        $queryBuilder =  $this->createQueryBuilder('product')
            ->orderBy('product.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($search) {
            $queryBuilder->andWhere(
                'product.name LIKE :search
                OR product.description LIKE :search'
            )
                ->setParameter('search', '%' . $search . '%');
        }

        return $queryBuilder->getQuery()->getResult();
    }

    public function countSearch(?string $search = null): int
    {
        $qb = $this->createQueryBuilder('product')
            ->select('COUNT(product.id)');

        if ($search) {
            $qb->andWhere('product.name LIKE :search')
                ->setParameter('search', '%' . $search . '%');
        }

        return (int) $qb
            ->getQuery()
            ->getSingleScalarResult();
    }

    //    /**
    //     * @return MedicineReference[] Returns an array of MedicineReference objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MedicineReference
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
