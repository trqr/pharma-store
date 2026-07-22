<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260524212309 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE medicine_reference (id INT AUTO_INCREMENT NOT NULL, cis VARCHAR(50) NOT NULL, name VARCHAR(255) NOT NULL, price DOUBLE PRECISION DEFAULT NULL, generic_group INT DEFAULT NULL, active_substances LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE pharmacy_product (id INT AUTO_INCREMENT NOT NULL, stock INT NOT NULL, price DOUBLE PRECISION NOT NULL, enabled TINYINT NOT NULL, promotion_price DOUBLE PRECISION DEFAULT NULL, medicine_id INT NOT NULL, UNIQUE INDEX UNIQ_F64702E22F7D140A (medicine_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE pharmacy_product ADD CONSTRAINT FK_F64702E22F7D140A FOREIGN KEY (medicine_id) REFERENCES medicine_reference (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE pharmacy_product DROP FOREIGN KEY FK_F64702E22F7D140A');
        $this->addSql('DROP TABLE medicine_reference');
        $this->addSql('DROP TABLE pharmacy_product');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
