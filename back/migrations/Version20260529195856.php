<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260529195856 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE medicine_reference DROP FOREIGN KEY `FK_B4839FA84584665A`');
        $this->addSql('DROP INDEX UNIQ_B4839FA84584665A ON medicine_reference');
        $this->addSql('ALTER TABLE medicine_reference DROP product_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE medicine_reference ADD product_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE medicine_reference ADD CONSTRAINT `FK_B4839FA84584665A` FOREIGN KEY (product_id) REFERENCES pharmacy_product (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B4839FA84584665A ON medicine_reference (product_id)');
    }
}
