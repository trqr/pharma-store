<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260613133054 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `purchase` (id INT AUTO_INCREMENT NOT NULL, status VARCHAR(100) NOT NULL, delivery_type VARCHAR(255) NOT NULL, total_price DOUBLE PRECISION NOT NULL, user_id INT NOT NULL, INDEX IDX_6117D13BA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE `purchase` ADD CONSTRAINT FK_6117D13BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE cart_item ADD purchase_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE cart_item ADD CONSTRAINT FK_F0FE2527558FBEB9 FOREIGN KEY (purchase_id) REFERENCES `purchase` (id)');
        $this->addSql('CREATE INDEX IDX_F0FE2527558FBEB9 ON cart_item (purchase_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `purchase` DROP FOREIGN KEY FK_6117D13BA76ED395');
        $this->addSql('DROP TABLE `purchase`');
        $this->addSql('ALTER TABLE cart_item DROP FOREIGN KEY FK_F0FE2527558FBEB9');
        $this->addSql('DROP INDEX IDX_F0FE2527558FBEB9 ON cart_item');
        $this->addSql('ALTER TABLE cart_item DROP purchase_id');
    }
}
