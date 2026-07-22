<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260615122713 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE delivery (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, min_delivery_days INT NOT NULL, max_delivery_days INT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE purchase ADD delivery_type_id INT NOT NULL, DROP delivery_type');
        $this->addSql('ALTER TABLE purchase ADD CONSTRAINT FK_6117D13BCF52334D FOREIGN KEY (delivery_type_id) REFERENCES delivery (id)');
        $this->addSql('CREATE INDEX IDX_6117D13BCF52334D ON purchase (delivery_type_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE delivery');
        $this->addSql('ALTER TABLE `purchase` DROP FOREIGN KEY FK_6117D13BCF52334D');
        $this->addSql('DROP INDEX IDX_6117D13BCF52334D ON `purchase`');
        $this->addSql('ALTER TABLE `purchase` ADD delivery_type VARCHAR(255) NOT NULL, DROP delivery_type_id');
    }
}
