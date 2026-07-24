<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260528212353 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Table may never have existed on a fresh database
        $this->addSql('DROP TABLE IF EXISTS sql_fixtures_executed');
        $this->addSql('ALTER TABLE medicine_reference ADD product_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE medicine_reference ADD CONSTRAINT FK_B4839FA84584665A FOREIGN KEY (product_id) REFERENCES pharmacy_product (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B4839FA84584665A ON medicine_reference (product_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE sql_fixtures_executed (id INT AUTO_INCREMENT NOT NULL, filename VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, executed_at DATETIME NOT NULL, UNIQUE INDEX filename (filename), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE medicine_reference DROP FOREIGN KEY FK_B4839FA84584665A');
        $this->addSql('DROP INDEX UNIQ_B4839FA84584665A ON medicine_reference');
        $this->addSql('ALTER TABLE medicine_reference DROP product_id');
    }
}
