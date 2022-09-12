<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220630091733 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message CHANGE read_status read_status TINYINT(1) NOT NULL, CHANGE sending_status sending_status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD is_verified TINYINT(1) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message CHANGE read_status read_status TINYINT(1) DEFAULT 0 NOT NULL, CHANGE sending_status sending_status TINYINT(1) DEFAULT 0');
        $this->addSql('ALTER TABLE user DROP is_verified');
    }
}
