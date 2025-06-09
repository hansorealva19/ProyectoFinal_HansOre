-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema veterinaria_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema veterinaria_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `veterinaria_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `veterinaria_db` ;

-- -----------------------------------------------------
-- Table `veterinaria_db`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `celular` VARCHAR(20) NULL DEFAULT NULL,
  `dni` VARCHAR(20) NULL DEFAULT NULL,
  `usuario` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('dueño', 'veterinario') NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `correo` (`correo` ASC) VISIBLE,
  UNIQUE INDEX `usuario` (`usuario` ASC) VISIBLE,
  UNIQUE INDEX `dni` (`dni` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria_db`.`mascota`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`mascota` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `raza` VARCHAR(100) NULL DEFAULT NULL,
  `especie` VARCHAR(100) NULL DEFAULT NULL,
  `duenio_id` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `duenio_id` (`duenio_id` ASC) VISIBLE,
  CONSTRAINT `mascota_ibfk_1`
    FOREIGN KEY (`duenio_id`)
    REFERENCES `veterinaria_db`.`usuario` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria_db`.`consulta_veterinaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`consulta_veterinaria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mascota_id` INT NOT NULL,
  `veterinario_id` INT NOT NULL,
  `fecha` DATETIME NOT NULL,
  `sintomas` TEXT NULL DEFAULT NULL,
  `diagnostico` TEXT NULL DEFAULT NULL,
  `tratamiento` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `mascota_id` (`mascota_id` ASC) VISIBLE,
  INDEX `veterinario_id` (`veterinario_id` ASC) VISIBLE,
  CONSTRAINT `consulta_veterinaria_ibfk_1`
    FOREIGN KEY (`mascota_id`)
    REFERENCES `veterinaria_db`.`mascota` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `consulta_veterinaria_ibfk_2`
    FOREIGN KEY (`veterinario_id`)
    REFERENCES `veterinaria_db`.`usuario` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria_db`.`tipo_suscripcion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`tipo_suscripcion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria_db`.`suscripcion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`suscripcion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mascota_id` INT NOT NULL,
  `tipo_id` INT NOT NULL,
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_fin` DATETIME NOT NULL,
  `estado` ENUM('activa', 'inactiva', 'vencida') NOT NULL DEFAULT 'activa',
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `mascota_id` (`mascota_id` ASC) VISIBLE,
  INDEX `fk_suscripcion_tipo` (`tipo_id` ASC) VISIBLE,
  CONSTRAINT `fk_suscripcion_tipo`
    FOREIGN KEY (`tipo_id`)
    REFERENCES `veterinaria_db`.`tipo_suscripcion` (`id`)
    ON DELETE RESTRICT,
  CONSTRAINT `suscripcion_ibfk_1`
    FOREIGN KEY (`mascota_id`)
    REFERENCES `veterinaria_db`.`mascota` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria_db`.`vacuna`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`vacuna` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mascota_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `fecha_aplicacion` DATE NULL DEFAULT NULL,
  `proxima_dosis` DATE NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_vacuna_mascota` (`mascota_id` ASC) VISIBLE,
  CONSTRAINT `fk_vacuna_mascota`
    FOREIGN KEY (`mascota_id`)
    REFERENCES `veterinaria_db`.`mascota` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria_db`.`vacuna_catalogo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`vacuna_catalogo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `fabricante` VARCHAR(100) NULL DEFAULT NULL,
  `precio` DECIMAL(10,2) NULL DEFAULT NULL,
  `dosis` VARCHAR(50) NULL DEFAULT NULL,
  `especie_destino` VARCHAR(50) NULL DEFAULT NULL,
  `via_administracion` VARCHAR(50) NULL DEFAULT NULL,
  `edad_minima` INT NULL DEFAULT NULL,
  `periodicidad` VARCHAR(50) NULL DEFAULT NULL,
  `lote` VARCHAR(50) NULL DEFAULT NULL,
  `fecha_vencimiento` DATE NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria_db`.`vacuna_mascota`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria_db`.`vacuna_mascota` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mascota_id` INT NOT NULL,
  `vacuna_id` INT NOT NULL,
  `fecha_aplicacion` DATETIME NOT NULL,
  `fecha_vencimiento` DATETIME NULL DEFAULT NULL,
  `veterinario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `mascota_id` (`mascota_id` ASC) VISIBLE,
  INDEX `veterinario_id` (`veterinario_id` ASC) VISIBLE,
  INDEX `vacuna_mascota_ibfk_2` (`vacuna_id` ASC) VISIBLE,
  CONSTRAINT `vacuna_mascota_ibfk_1`
    FOREIGN KEY (`mascota_id`)
    REFERENCES `veterinaria_db`.`mascota` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `vacuna_mascota_ibfk_2`
    FOREIGN KEY (`vacuna_id`)
    REFERENCES `veterinaria_db`.`vacuna_catalogo` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `vacuna_mascota_ibfk_3`
    FOREIGN KEY (`veterinario_id`)
    REFERENCES `veterinaria_db`.`usuario` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
