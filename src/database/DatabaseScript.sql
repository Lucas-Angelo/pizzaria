-- MySQL Script generated by MySQL Workbench
-- Fri Sep 30 11:21:36 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pizza
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pizza
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pizza` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin ;
USE `pizza` ;

-- -----------------------------------------------------
-- Table `pizza`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pizza`.`usuario` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(60) NOT NULL,
  `senha` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pizza`.`pizza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pizza`.`pizza` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(45) NOT NULL,
  `valor` DECIMAL(9,2) UNSIGNED NOT NULL,
  `tamanho` ENUM('35CM', '45CM', '60CM') NOT NULL,
  `image_url` VARCHAR(200) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `descricao_UNIQUE` (`descricao` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pizza`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pizza`.`pedido` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `status` ENUM('PENDENTE', 'PRODUCAO', 'CONCLUIDO') NOT NULL,
  `cliente_nome` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NOT NULL,
  `pizza_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_pedido_pizza_idx` (`pizza_id` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_pizza`
    FOREIGN KEY (`pizza_id`)
    REFERENCES `pizza`.`pizza` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

ALTER TABLE `pizza`.`pedido`
ADD COLUMN tipo ENUM('PRESENCIAL','TELEFONE');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
