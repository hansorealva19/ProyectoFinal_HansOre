-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: veterinaria_db
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `estado` enum('activo','comprado','cancelado') NOT NULL DEFAULT 'activo',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fk_carrito_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (1,7,'comprado','2025-06-12 22:03:30','2025-06-12 23:22:29'),(2,1,'comprado','2025-06-12 22:23:17','2025-06-12 22:43:20'),(3,1,'comprado','2025-06-12 22:43:20','2025-06-12 22:53:38'),(4,1,'comprado','2025-06-12 22:53:38','2025-06-12 22:54:14'),(5,1,'comprado','2025-06-12 22:54:15','2025-06-12 22:54:48'),(6,1,'comprado','2025-06-12 22:54:48','2025-06-12 23:02:05'),(7,1,'comprado','2025-06-12 23:02:05','2025-06-12 23:02:49'),(8,1,'comprado','2025-06-12 23:02:49','2025-06-12 23:05:22'),(9,1,'comprado','2025-06-12 23:05:22','2025-06-12 23:08:33'),(10,1,'comprado','2025-06-12 23:08:33','2025-06-12 23:10:26'),(11,1,'comprado','2025-06-12 23:10:26','2025-06-12 23:17:42'),(12,1,'comprado','2025-06-12 23:17:42','2025-06-12 23:46:45'),(13,7,'comprado','2025-06-12 23:22:29','2025-06-12 23:31:06'),(14,7,'comprado','2025-06-12 23:31:06','2025-06-12 23:32:35'),(15,7,'comprado','2025-06-12 23:32:35','2025-06-12 23:33:24'),(16,7,'comprado','2025-06-12 23:33:24','2025-06-13 18:48:39'),(17,2,'comprado','2025-06-12 23:37:23','2025-06-12 23:37:37'),(18,2,'comprado','2025-06-12 23:37:37','2025-06-12 23:37:58'),(19,2,'comprado','2025-06-12 23:37:58','2025-06-15 20:44:06'),(20,1,'comprado','2025-06-12 23:46:46','2025-06-12 23:48:48'),(21,1,'activo','2025-06-12 23:48:48','2025-06-12 23:48:48'),(22,7,'comprado','2025-06-13 18:48:39','2025-06-13 18:59:31'),(23,7,'comprado','2025-06-13 18:59:31','2025-06-13 19:05:03'),(24,7,'comprado','2025-06-13 19:05:03','2025-06-15 17:44:26'),(25,7,'activo','2025-06-15 17:44:26','2025-06-15 17:44:26'),(26,13,'comprado','2025-06-15 19:52:51','2025-06-15 19:54:02'),(27,13,'comprado','2025-06-15 19:54:02','2025-06-15 20:11:25'),(28,13,'activo','2025-06-15 20:11:25','2025-06-15 20:11:25'),(29,2,'comprado','2025-06-15 20:44:06','2025-06-15 20:45:52'),(30,2,'comprado','2025-06-15 20:45:52','2025-06-15 20:46:40'),(31,2,'comprado','2025-06-15 20:46:40','2025-06-15 20:47:49'),(32,2,'comprado','2025-06-15 20:47:49','2025-06-15 20:49:49'),(33,2,'comprado','2025-06-15 20:49:49','2025-06-15 21:01:34'),(34,2,'comprado','2025-06-15 21:01:34','2025-06-16 00:02:39'),(35,12,'comprado','2025-06-15 21:08:44','2025-06-15 21:10:13'),(36,12,'comprado','2025-06-15 21:10:13','2025-06-15 21:31:13'),(37,12,'comprado','2025-06-15 21:31:13','2025-06-15 21:32:07'),(38,12,'comprado','2025-06-15 21:32:07','2025-06-15 21:34:40'),(39,12,'comprado','2025-06-15 21:34:40','2025-06-15 21:37:31'),(40,12,'comprado','2025-06-15 21:37:31','2025-06-15 21:39:52'),(41,12,'comprado','2025-06-15 21:39:52','2025-06-15 21:40:31'),(42,12,'comprado','2025-06-15 21:44:33','2025-06-15 21:45:39'),(43,12,'comprado','2025-06-15 21:45:39','2025-06-15 21:50:41'),(44,12,'comprado','2025-06-15 21:50:41','2025-06-15 21:51:11'),(45,12,'activo','2025-06-15 21:51:11','2025-06-15 21:51:11'),(46,14,'comprado','2025-06-15 21:59:03','2025-06-15 22:00:11'),(47,14,'comprado','2025-06-15 22:00:11','2025-06-15 22:00:49'),(48,14,'comprado','2025-06-15 22:00:49','2025-06-15 22:02:30'),(49,14,'activo','2025-06-15 22:02:30','2025-06-15 22:02:30'),(50,6,'comprado','2025-06-15 22:46:27','2025-06-15 22:47:31'),(51,6,'activo','2025-06-15 22:47:31','2025-06-15 22:47:31'),(52,2,'activo','2025-06-16 00:02:39','2025-06-16 00:02:39');
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito_item`
--

DROP TABLE IF EXISTS `carrito_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carrito_id` int NOT NULL,
  `tipo` enum('suscripcion','vacuna') NOT NULL,
  `suscripcion_id` int DEFAULT NULL,
  `vacuna_catalogo_id` int DEFAULT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `precio_unitario` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `mascota_id` int DEFAULT NULL,
  `tipo_suscripcion_id` int DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carrito_id` (`carrito_id`),
  KEY `suscripcion_id` (`suscripcion_id`),
  KEY `vacuna_catalogo_id` (`vacuna_catalogo_id`),
  CONSTRAINT `fk_carrito_item_carrito` FOREIGN KEY (`carrito_id`) REFERENCES `carrito` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_carrito_item_suscripcion` FOREIGN KEY (`suscripcion_id`) REFERENCES `suscripcion` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_carrito_item_vacuna_catalogo` FOREIGN KEY (`vacuna_catalogo_id`) REFERENCES `vacuna_catalogo` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_item`
--

LOCK TABLES `carrito_item` WRITE;
/*!40000 ALTER TABLE `carrito_item` DISABLE KEYS */;
INSERT INTO `carrito_item` VALUES (11,2,'vacuna',NULL,1,1,30.00,30.00,5,NULL,NULL),(12,3,'vacuna',NULL,3,1,45.00,45.00,5,NULL,NULL),(13,4,'vacuna',NULL,4,1,25.00,25.00,5,NULL,NULL),(14,5,'vacuna',NULL,6,1,25.00,25.00,1,NULL,NULL),(15,6,'vacuna',NULL,5,1,25.00,25.00,1,NULL,'2026-06-12'),(16,7,'vacuna',NULL,8,1,40.00,40.00,5,NULL,'2027-06-12'),(17,8,'suscripcion',NULL,NULL,1,150.00,150.00,5,3,NULL),(18,9,'suscripcion',NULL,NULL,1,90.00,90.00,5,2,NULL),(19,10,'suscripcion',NULL,NULL,1,50.00,50.00,5,1,NULL),(20,11,'suscripcion',NULL,NULL,1,150.00,150.00,5,3,NULL),(21,1,'suscripcion',NULL,NULL,2,150.00,300.00,3,3,NULL),(22,13,'suscripcion',NULL,NULL,1,50.00,50.00,3,1,NULL),(23,14,'suscripcion',NULL,NULL,1,150.00,150.00,3,3,NULL),(24,15,'suscripcion',NULL,NULL,1,50.00,50.00,3,1,NULL),(25,17,'suscripcion',NULL,NULL,1,150.00,150.00,2,3,NULL),(26,18,'suscripcion',NULL,NULL,1,50.00,50.00,2,1,NULL),(27,12,'suscripcion',NULL,NULL,1,50.00,50.00,5,1,NULL),(28,20,'vacuna',NULL,10,1,60.00,60.00,5,NULL,'2026-06-12'),(29,16,'vacuna',NULL,2,1,50.00,50.00,6,NULL,'2026-06-13'),(30,16,'suscripcion',NULL,NULL,1,150.00,150.00,6,3,NULL),(31,16,'vacuna',NULL,19,1,30.00,30.00,3,NULL,'2025-06-13'),(35,22,'vacuna',NULL,4,1,25.00,25.00,6,NULL,'2026-06-13'),(36,22,'vacuna',NULL,12,1,28.00,28.00,3,NULL,'2025-09-13'),(37,23,'vacuna',NULL,25,1,26.00,26.00,6,NULL,'2026-06-13'),(38,23,'vacuna',NULL,34,1,50.00,50.00,6,NULL,'2025-09-13'),(39,24,'vacuna',NULL,1,1,30.00,30.00,6,NULL,'2026-06-13'),(40,24,'vacuna',NULL,11,1,22.00,22.00,3,NULL,'2027-06-12'),(42,24,'suscripcion',NULL,NULL,4,150.00,600.00,3,3,NULL),(43,24,'vacuna',NULL,8,1,40.00,40.00,6,NULL,'2030-06-15'),(44,24,'vacuna',NULL,17,1,32.00,32.00,3,NULL,'2028-06-15'),(50,26,'suscripcion',NULL,NULL,1,50.00,50.00,7,1,NULL),(54,27,'vacuna',NULL,1,1,30.00,30.00,7,NULL,'2026-06-15'),(55,27,'vacuna',NULL,2,1,50.00,50.00,7,NULL,'2026-06-15'),(56,27,'vacuna',NULL,11,1,22.00,22.00,7,NULL,'2027-06-15'),(63,19,'vacuna',NULL,1,1,30.00,30.00,2,NULL,NULL),(64,29,'vacuna',NULL,3,1,45.00,45.00,2,NULL,NULL),(65,30,'vacuna',NULL,4,1,25.00,25.00,2,NULL,NULL),(66,31,'vacuna',NULL,4,1,25.00,25.00,2,NULL,NULL),(67,32,'vacuna',NULL,5,1,25.00,25.00,2,NULL,NULL),(68,33,'vacuna',NULL,6,1,25.00,25.00,2,NULL,'2026-06-15'),(69,33,'vacuna',NULL,4,1,25.00,25.00,2,NULL,'2026-06-15'),(70,35,'vacuna',NULL,108,1,35.00,35.00,8,NULL,'2025-09-15'),(71,36,'suscripcion',NULL,NULL,1,150.00,150.00,8,3,NULL),(72,37,'suscripcion',NULL,NULL,1,150.00,150.00,8,3,NULL),(73,38,'suscripcion',NULL,NULL,1,150.00,150.00,8,3,NULL),(74,39,'suscripcion',NULL,NULL,1,150.00,150.00,8,3,NULL),(75,40,'suscripcion',NULL,NULL,1,150.00,150.00,8,3,NULL),(76,41,'suscripcion',NULL,NULL,1,150.00,150.00,8,3,NULL),(77,42,'suscripcion',NULL,NULL,2,150.00,300.00,9,3,NULL),(78,43,'vacuna',NULL,2,1,50.00,50.00,8,NULL,'2026-06-15'),(79,44,'vacuna',NULL,3,1,45.00,45.00,9,NULL,'2026-06-15'),(80,46,'suscripcion',NULL,NULL,2,50.00,100.00,10,1,NULL),(81,46,'vacuna',NULL,1,1,30.00,30.00,10,NULL,'2026-06-15'),(82,46,'vacuna',NULL,3,1,45.00,45.00,10,NULL,'2026-06-15'),(83,46,'vacuna',NULL,8,1,40.00,40.00,10,NULL,'2026-06-15'),(84,47,'vacuna',NULL,15,1,28.00,28.00,10,NULL,'2026-06-15'),(85,48,'vacuna',NULL,29,1,31.00,31.00,10,NULL,'2026-06-15'),(95,50,'vacuna',NULL,1,1,30.00,30.00,11,NULL,'2026-06-15'),(96,50,'vacuna',NULL,2,1,50.00,50.00,11,NULL,'2025-09-15'),(97,50,'vacuna',NULL,6,1,25.00,25.00,11,NULL,'2027-06-15'),(98,50,'suscripcion',NULL,NULL,2,50.00,100.00,11,1,NULL),(99,34,'vacuna',NULL,38,1,40.00,40.00,4,NULL,'2026-06-16');
/*!40000 ALTER TABLE `carrito_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consulta_veterinaria`
--

DROP TABLE IF EXISTS `consulta_veterinaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consulta_veterinaria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mascota_id` int NOT NULL,
  `veterinario_id` int NOT NULL,
  `fecha` datetime NOT NULL,
  `sintomas` text,
  `diagnostico` text,
  `tratamiento` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `mascota_id` (`mascota_id`),
  KEY `veterinario_id` (`veterinario_id`),
  CONSTRAINT `consulta_veterinaria_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascota` (`id`) ON DELETE CASCADE,
  CONSTRAINT `consulta_veterinaria_ibfk_2` FOREIGN KEY (`veterinario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consulta_veterinaria`
--

LOCK TABLES `consulta_veterinaria` WRITE;
/*!40000 ALTER TABLE `consulta_veterinaria` DISABLE KEYS */;
INSERT INTO `consulta_veterinaria` VALUES (7,1,5,'2024-12-15 10:30:00','Cojea de la pata trasera','Esguince leve','Reposo y antiinflamatorio','2025-06-09 14:37:06'),(8,1,5,'2025-01-10 09:00:00','Tos persistente','Gripe canina','Antibióticos por 5 días','2025-06-09 14:37:06'),(9,2,5,'2025-03-01 14:00:00','No come','Estrés','Cambio de dieta y control','2025-06-09 14:37:06'),(10,4,7,'2025-06-09 00:00:00','Vomito','Infeccion','Inyecciones para vomito','2025-06-09 17:00:39'),(11,2,7,'2025-06-09 00:00:00','Diarrea','Infeccion','Inyecciones para diarrea','2025-06-09 17:12:16'),(12,3,7,'2025-06-13 00:00:00','Vomito','Infeccion','Inyecciones para vomito','2025-06-13 17:54:24'),(13,5,7,'2025-06-15 00:00:00','Cansancio','No duerme','Dormir','2025-06-15 18:13:10'),(14,3,7,'2025-06-15 00:00:00','Fiebre','Infeccion','Inyecciones para la fiebre.\nElectrolitos.','2025-06-15 19:10:11'),(15,6,7,'2025-06-15 00:00:00','Fiebre','Infeccion','Reposo.','2025-06-15 19:10:59'),(16,8,7,'2025-06-16 00:00:00','Fiebre','Infeccion','Pastillas para la infeccion, vitaminas, electrolitos, inyecciones.','2025-06-15 21:07:29'),(17,9,7,'2025-06-17 00:00:00','Cansancio','Infeccion','Pastillas e inyecciones.','2025-06-15 21:52:13'),(18,10,7,'2025-06-15 00:00:00','Vomito','Infeccion','Inyecciones, pastillas.','2025-06-15 21:58:14'),(19,11,7,'2025-06-15 00:00:00','Fiebre','Infeccion','Pastillas e inyecciones.','2025-06-15 22:46:16');
/*!40000 ALTER TABLE `consulta_veterinaria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascota`
--

DROP TABLE IF EXISTS `mascota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascota` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `raza` varchar(100) DEFAULT NULL,
  `especie` varchar(100) DEFAULT NULL,
  `duenio_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `foto_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `duenio_id` (`duenio_id`),
  CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`duenio_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascota`
--

LOCK TABLES `mascota` WRITE;
/*!40000 ALTER TABLE `mascota` DISABLE KEYS */;
INSERT INTO `mascota` VALUES (1,'Firulais','2020-01-15','Labrador','Perro',1,'2025-06-09 14:36:15','2025-06-09 14:36:15',NULL),(2,'Michi','2021-03-20','Siames','Gato',2,'2025-06-09 14:36:15','2025-06-09 14:36:15',NULL),(3,'Hans','2018-12-19','Labrador','Perro',7,'2025-06-09 15:33:38','2025-06-09 15:33:38',NULL),(4,'Firulais','2017-12-12','Schnauzser','Perro',2,'2025-06-09 16:35:57','2025-06-15 17:29:25','https://res.cloudinary.com/dqixr8zcs/image/upload/v1750026572/ucejikiydip1frepbh3u.jpg'),(5,'FuchiFuchi','2025-06-09','Pitbull','Perro',1,'2025-06-09 18:49:46','2025-06-09 18:49:46',NULL),(6,'Russo','2023-05-10','Chitzu','Perro',7,'2025-06-13 17:52:57','2025-06-13 17:52:57',NULL),(7,'Pastrulo','2023-11-08','Bulldog','Perro',13,'2025-06-15 19:52:35','2025-06-15 19:52:35',NULL),(8,'Roky','2024-02-14','Pekines','Perro',12,'2025-06-15 21:06:46','2025-06-15 21:06:58','https://res.cloudinary.com/dqixr8zcs/image/upload/v1750039624/nvwolrugvaznzigqrfzm.jpg'),(9,'Panchito','2023-02-19','Angola','Gato',12,'2025-06-15 21:45:18','2025-06-15 21:45:18',NULL),(10,'Valentin','2016-10-14','Cruzado','Gato',14,'2025-06-15 21:57:13','2025-06-15 21:57:13',NULL),(11,'Goku','2020-12-12','Schnauzser','Perro',6,'2025-06-15 22:45:51','2025-06-15 22:45:51',NULL);
/*!40000 ALTER TABLE `mascota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carrito_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `metodo` varchar(50) NOT NULL,
  `estado` enum('exitoso','fallido') NOT NULL DEFAULT 'exitoso',
  PRIMARY KEY (`id`),
  KEY `carrito_id` (`carrito_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fk_pago_carrito` FOREIGN KEY (`carrito_id`) REFERENCES `carrito` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pago_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,2,1,30.00,'2025-06-12 22:43:20','simulado','exitoso'),(2,3,1,45.00,'2025-06-12 22:53:38','simulado','exitoso'),(3,4,1,25.00,'2025-06-12 22:54:14','simulado','exitoso'),(4,5,1,25.00,'2025-06-12 22:54:48','simulado','exitoso'),(5,6,1,25.00,'2025-06-12 23:02:05','simulado','exitoso'),(6,7,1,40.00,'2025-06-12 23:02:49','simulado','exitoso'),(7,8,1,150.00,'2025-06-12 23:05:22','simulado','exitoso'),(8,9,1,90.00,'2025-06-12 23:08:33','simulado','exitoso'),(9,10,1,50.00,'2025-06-12 23:10:26','simulado','exitoso'),(10,11,1,150.00,'2025-06-12 23:17:42','simulado','exitoso'),(11,1,7,300.00,'2025-06-12 23:22:29','simulado','exitoso'),(12,13,7,50.00,'2025-06-12 23:31:06','simulado','exitoso'),(13,14,7,150.00,'2025-06-12 23:32:35','simulado','exitoso'),(14,15,7,50.00,'2025-06-12 23:33:24','simulado','exitoso'),(15,17,2,150.00,'2025-06-12 23:37:37','simulado','exitoso'),(16,18,2,50.00,'2025-06-12 23:37:58','simulado','exitoso'),(17,12,1,50.00,'2025-06-12 23:46:45','simulado','exitoso'),(18,20,1,60.00,'2025-06-12 23:48:48','simulado','exitoso'),(19,16,7,230.00,'2025-06-13 18:48:39','simulado','exitoso'),(20,22,7,53.00,'2025-06-13 18:59:31','simulado','exitoso'),(21,23,7,76.00,'2025-06-13 19:05:03','simulado','exitoso'),(22,24,7,724.00,'2025-06-15 17:44:26','simulado','exitoso'),(23,26,13,50.00,'2025-06-15 19:54:02','simulado','exitoso'),(24,27,13,102.00,'2025-06-15 20:11:25','simulado','exitoso'),(25,19,2,30.00,'2025-06-15 20:44:06','simulado','exitoso'),(26,29,2,45.00,'2025-06-15 20:45:52','simulado','exitoso'),(27,30,2,25.00,'2025-06-15 20:46:40','simulado','exitoso'),(28,31,2,25.00,'2025-06-15 20:47:49','simulado','exitoso'),(29,32,2,25.00,'2025-06-15 20:49:49','simulado','exitoso'),(30,33,2,50.00,'2025-06-15 21:01:34','simulado','exitoso'),(31,35,12,35.00,'2025-06-15 21:10:13','simulado','exitoso'),(32,36,12,150.00,'2025-06-15 21:31:13','simulado','exitoso'),(33,37,12,150.00,'2025-06-15 21:32:07','simulado','exitoso'),(34,38,12,150.00,'2025-06-15 21:34:40','simulado','exitoso'),(35,39,12,150.00,'2025-06-15 21:37:31','simulado','exitoso'),(36,40,12,150.00,'2025-06-15 21:39:52','simulado','exitoso'),(37,41,12,150.00,'2025-06-15 21:40:31','simulado','exitoso'),(38,42,12,300.00,'2025-06-15 21:45:39','simulado','exitoso'),(39,43,12,50.00,'2025-06-15 21:50:41','simulado','exitoso'),(40,44,12,45.00,'2025-06-15 21:51:11','simulado','exitoso'),(41,46,14,215.00,'2025-06-15 22:00:11','simulado','exitoso'),(42,47,14,28.00,'2025-06-15 22:00:49','simulado','exitoso'),(43,48,14,31.00,'2025-06-15 22:02:30','simulado','exitoso'),(44,50,6,205.00,'2025-06-15 22:47:31','simulado','exitoso'),(45,34,2,40.00,'2025-06-16 00:02:39','simulado','exitoso');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suscripcion`
--

DROP TABLE IF EXISTS `suscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suscripcion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mascota_id` int NOT NULL,
  `tipo_id` int NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `estado` enum('activa','inactiva','vencida') NOT NULL DEFAULT 'activa',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `mascota_id` (`mascota_id`),
  KEY `fk_suscripcion_tipo` (`tipo_id`),
  CONSTRAINT `fk_suscripcion_tipo` FOREIGN KEY (`tipo_id`) REFERENCES `tipo_suscripcion` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `suscripcion_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascota` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suscripcion`
--

LOCK TABLES `suscripcion` WRITE;
/*!40000 ALTER TABLE `suscripcion` DISABLE KEYS */;
INSERT INTO `suscripcion` VALUES (1,1,1,'2025-01-01 00:00:00','2025-12-31 00:00:00','activa','2025-06-09 14:38:32'),(2,2,1,'2024-01-01 00:00:00','2026-06-09 00:00:00','inactiva','2025-06-09 14:38:32'),(3,4,3,'2025-06-09 00:00:00','2026-06-09 00:00:00','activa','2025-06-09 17:43:41'),(4,3,3,'2025-06-09 00:00:00','2026-06-09 00:00:00','inactiva','2025-06-09 18:14:36'),(5,5,1,'2024-06-08 00:00:00','2025-06-08 00:00:00','vencida','2025-06-09 18:50:05'),(6,5,3,'2025-06-12 23:05:22','2026-06-12 23:05:22','inactiva','2025-06-12 23:05:22'),(7,5,2,'2025-06-12 23:08:33','2026-06-12 23:08:33','inactiva','2025-06-12 23:08:33'),(8,5,1,'2025-06-12 23:10:26','2026-06-12 23:10:26','inactiva','2025-06-12 23:10:26'),(9,5,3,'2026-06-12 23:10:26','2027-06-12 23:10:26','inactiva','2025-06-12 23:17:42'),(10,3,3,'2026-06-09 00:00:00','2028-06-09 00:00:00','inactiva','2025-06-12 23:22:29'),(11,3,1,'2025-06-12 23:31:07','2026-06-12 23:31:07','inactiva','2025-06-12 23:31:06'),(12,3,3,'2025-06-12 23:32:36','2026-06-12 23:32:36','inactiva','2025-06-12 23:32:35'),(13,3,1,'2025-06-12 23:33:24','2026-06-12 23:33:24','inactiva','2025-06-12 23:33:24'),(14,2,3,'2025-06-12 23:37:38','2026-06-12 23:37:38','inactiva','2025-06-12 23:37:37'),(15,2,1,'2026-06-12 23:37:38','2027-06-12 23:37:38','activa','2025-06-12 23:37:58'),(16,5,1,'2025-06-12 23:46:46','2026-06-12 23:46:46','activa','2025-06-12 23:46:45'),(17,6,3,'2025-06-13 18:48:40','2026-06-13 18:48:40','activa','2025-06-13 18:48:39'),(18,3,3,'2024-08-15 17:44:26','2025-08-15 17:44:26','activa','2025-06-15 17:44:26'),(19,7,1,'2024-06-20 19:54:03','2025-06-20 19:54:03','activa','2025-06-15 19:54:02'),(20,8,3,'2024-08-21 21:40:31','2025-08-21 21:40:31','activa','2025-06-15 21:40:31'),(21,9,3,'2023-07-25 21:45:40','2025-07-25 21:45:40','activa','2025-06-15 21:45:39'),(22,10,1,'2025-06-15 22:00:12','2027-06-15 22:00:12','activa','2025-06-15 22:00:11'),(23,11,1,'2025-06-15 22:47:32','2027-06-15 22:47:32','activa','2025-06-15 22:47:31');
/*!40000 ALTER TABLE `suscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_suscripcion`
--

DROP TABLE IF EXISTS `tipo_suscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_suscripcion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_suscripcion`
--

LOCK TABLES `tipo_suscripcion` WRITE;
/*!40000 ALTER TABLE `tipo_suscripcion` DISABLE KEYS */;
INSERT INTO `tipo_suscripcion` VALUES (1,'Normal','Acceso básico a servicios veterinarios.',50.00),(2,'Plus','Incluye servicios adicionales y descuentos.',90.00),(3,'Premium','Cobertura total y atención preferencial.',150.00);
/*!40000 ALTER TABLE `tipo_suscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `correo` varchar(100) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `dni` varchar(20) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('dueño','veterinario') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `foto_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Juan','Pérez','1980-05-10','juanperez@mail.com','987654321','12345678','juanp','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','dueño','2025-06-09 14:34:35','2025-06-09 16:14:45',NULL),(2,'Ana','Lopez','1992-08-22','analopez@mail.com','912345678','23456789','analo','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','dueño','2025-06-09 14:34:35','2025-06-09 16:14:45',NULL),(5,'Laura','Martínez','1985-11-30','lauram@mail.com','923456789','34567890','lauram','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','veterinario','2025-06-09 14:34:59','2025-06-09 16:14:45',NULL),(6,'Hans','Ore','1997-12-19','hansorealva19@gmail.com','123456789','45678901','hansore','$2b$10$efqnIC5Dwpxp.DRL45UhTuX7liex3tG..MEXJ5TmnftRIxAGurcua','dueño','2025-06-09 15:31:04','2025-06-15 22:48:05','https://res.cloudinary.com/dqixr8zcs/image/upload/v1750045689/kotr6ecbwaljgvn3tzve.jpg'),(7,'Fiorella','Pachas','1997-06-13','fiorellapachas@gmail.com','123456788','56789011','fiorellapachas','$2b$10$v1MHE1HfB9X4xSp79TzoUubzb54M39WjbuN.hNA00qN7XdtcX39eS','veterinario','2025-06-09 15:31:26','2025-06-15 17:45:00','https://res.cloudinary.com/dqixr8zcs/image/upload/v1749859366/qq63z4puznef7mnnwgfb.jpg'),(8,'Adrian','Ore','2000-12-09','adrianore@gmail.com','987654321','12121212','adrianore','$2b$10$1u7IqbHywYMTdDVv/zNKJe6R9M1DiA9M3c7MRBWmDNxuYGDyObOd.','veterinario','2025-06-09 18:59:49','2025-06-13 18:18:47',NULL),(9,'carlos','ore','1990-12-12','carlosore@gmail.com','123456789','13131313','carlosore','$2b$10$zGsCyYdfv3sCwRRJaaFfkeG62Goppsm1iRe9RtjE3uVd/sx0SVw7a','veterinario','2025-06-09 19:03:14','2025-06-13 18:19:19',NULL),(11,'Hans Alonso','Ore Alva','1997-12-19','xarkangelx@hotmail.com','969694802','14141414','hansorealva19','$2b$10$xqA0p6eQKMxcHOj3FQ1lMuo84Eo1AbVWJanx9CqtlSO44RK0r189K','veterinario','2025-06-13 18:15:34','2025-06-13 18:19:11',NULL),(12,'Luis','Ore','1954-09-23','luisore@gmail.com','987654159','08860710','luisore','$2b$10$b0i/.W6oOjRjuEwdPvq/xONbrB1X/ppcWnytt8LtaG2uEJKt2KuBa','dueño','2025-06-13 18:22:20','2025-06-13 18:22:20',NULL),(13,'Maria','Alva','1964-03-03','mariaalva@hotmail.com','986632222','08882813','mariaalva','$2b$10$4QuVyxKxl9mhzQOQGPlSpuexWtiv/.LiQry9yPDhXY0oQVLr2P9Iu','veterinario','2025-06-13 18:26:18','2025-06-13 18:26:18',NULL),(14,'Wilmer','Pachas','1995-05-23','wilmer@example.com','951357462','35861512','wilmerpachas','$2b$10$HuDGeD/ocVJhZWf6ModS4eBC41QOM4rykupomnYlkdIYjRRouM0m6','dueño','2025-06-15 21:55:51','2025-06-15 21:55:51',NULL),(15,'Harella','Ore','1999-12-19','harella@example.com','951357421','12345600','harella','$2b$10$GNsRInosW1x.ZVxq/baf9uP6QrdXLsoNXlRt/svlkbeie0BeZByLS','veterinario','2025-06-15 23:39:40','2025-06-16 00:20:00','https://res.cloudinary.com/dqixr8zcs/image/upload/v1750051185/l85djuhevfyx9ou0cvwy.jpg');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacuna`
--

DROP TABLE IF EXISTS `vacuna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacuna` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mascota_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_aplicacion` date DEFAULT NULL,
  `proxima_dosis` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_vacuna_mascota` (`mascota_id`),
  CONSTRAINT `fk_vacuna_mascota` FOREIGN KEY (`mascota_id`) REFERENCES `mascota` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacuna`
--

LOCK TABLES `vacuna` WRITE;
/*!40000 ALTER TABLE `vacuna` DISABLE KEYS */;
/*!40000 ALTER TABLE `vacuna` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacuna_catalogo`
--

DROP TABLE IF EXISTS `vacuna_catalogo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacuna_catalogo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `fabricante` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `dosis` varchar(50) DEFAULT NULL,
  `especie_destino` varchar(50) DEFAULT NULL,
  `via_administracion` varchar(50) DEFAULT NULL,
  `edad_minima` int DEFAULT NULL,
  `periodicidad` varchar(50) DEFAULT NULL,
  `lote` varchar(50) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacuna_catalogo`
--

LOCK TABLES `vacuna_catalogo` WRITE;
/*!40000 ALTER TABLE `vacuna_catalogo` DISABLE KEYS */;
INSERT INTO `vacuna_catalogo` VALUES (1,'Rabia','Vacuna antirrábica','Zoetis',30.00,NULL,'canino/felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 22:46:35',100),(2,'Quíntuple','Moquillo, hepatitis, parvovirus, parainfluenza, leptospira','Zoetis',50.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 22:46:45',96),(3,'Triple felina','Panleucopenia, calicivirus, rinotraqueítis','Zoetis',45.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 20:45:51',99),(4,'Leptospira','Leptospirosis','Zoetis',25.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 21:01:30',96),(5,'Parvovirus','Parvovirosis canina','Zoetis',25.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 20:49:46',99),(6,'Coronavirus','Coronavirus canino','Zoetis',25.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 22:46:58',98),(7,'Bordetella','Tos de las perreras','Zoetis',35.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 20:02:41',100),(8,'Leucemia felina','Leucemia viral felina','Zoetis',40.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 17:24:47','2025-06-15 20:02:41',100),(9,'Tetravalente','Moquillo, hepatitis, parvovirus, parainfluenza','Boehringer',48.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(10,'Hexavalente','Moquillo, hepatitis, parvovirus, parainfluenza, leptospira, coronavirus','Boehringer',60.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(11,'Parainfluenza','Parainfluenza canina','Zoetis',22.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(12,'Hepatitis','Adenovirus tipo 1 y 2','Zoetis',28.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(13,'Moquillo','Moquillo canino','Boehringer',27.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(14,'Parvovirus felino','Parvovirosis felina','Virbac',30.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(15,'Calicivirus felino','Calicivirus felino','Virbac',28.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(16,'Rinotraqueítis felina','Rinotraqueítis viral felina','Virbac',28.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(17,'Panleucopenia felina','Panleucopenia infecciosa felina','Virbac',32.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(18,'Clamidiosis felina','Chlamydophila felis','Boehringer',35.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(19,'Giardia','Prevención de giardiasis','Zoetis',30.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(20,'Tos de las perreras oral','Bordetella oral','Virbac',38.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(21,'Leptospira interrogans','Leptospirosis interrogans','Boehringer',26.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(22,'Leptospira canicola','Leptospira canicola','Boehringer',26.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(23,'Leptospira icterohaemorrhagiae','Leptospira icterohaemorrhagiae','Boehringer',26.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(24,'Leptospira grippotyphosa','Leptospira grippotyphosa','Boehringer',26.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(25,'Leptospira pomona','Leptospira pomona','Boehringer',26.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(26,'Parainfluenza felina','Parainfluenza felina','Virbac',29.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 22:14:22',100),(27,'Rabia felina','Vacuna antirrábica felina','Virbac',32.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(28,'Calicivirus canino','Calicivirus canino','Boehringer',25.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(29,'Moquillo felino','Moquillo felino','Virbac',31.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(30,'Parvovirus oral','Parvovirus oral canino','Zoetis',27.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(31,'Parvovirus nasal','Parvovirus nasal canino','Zoetis',27.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(32,'Hepatitis felina','Hepatitis viral felina','Virbac',33.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(33,'Leucemia felina recombinante','Leucemia viral felina recombinante','Boehringer',45.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(34,'FIV','Inmunodeficiencia felina','Virbac',50.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(35,'PIF','Peritonitis infecciosa felina','Virbac',55.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(36,'Herpesvirus felino','Herpesvirus tipo 1 felino','Virbac',29.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(37,'Calicivirus recombinante','Calicivirus recombinante felino','Boehringer',32.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(38,'Triple canina','Moquillo, hepatitis, parvovirus','Zoetis',40.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-16 00:02:31',99),(39,'Cuádruple felina','Panleucopenia, calicivirus, rinotraqueítis, clamidiosis','Virbac',48.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(40,'Tos de las perreras nasal','Bordetella nasal','Boehringer',36.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(41,'Parainfluenza oral','Parainfluenza oral canina','Virbac',24.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(42,'Moquillo recombinante','Moquillo recombinante canino','Boehringer',35.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(43,'Parvovirus recombinante','Parvovirus recombinante canino','Boehringer',35.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(44,'Leptospira recombinante','Leptospira recombinante canina','Boehringer',30.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(45,'Rabia recombinante','Vacuna antirrábica recombinante','Virbac',38.00,NULL,'canino/felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(46,'Coronavirus felino','Coronavirus felino','Virbac',33.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(47,'Parvovirus felino recombinante','Parvovirus recombinante felino','Boehringer',34.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(48,'Clamidiosis canina','Chlamydophila canina','Boehringer',28.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(49,'Leptospira felina','Leptospira en felinos','Virbac',30.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(50,'Toxoplasmosis','Prevención de toxoplasmosis','Virbac',42.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(51,'Brucelosis canina','Prevención de brucelosis','Zoetis',37.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(52,'Brucelosis felina','Prevención de brucelosis felina','Virbac',37.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(53,'Dirofilaria','Prevención de dirofilariosis','Zoetis',44.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(54,'Dirofilaria felina','Prevención de dirofilariosis felina','Virbac',44.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(55,'Parvovirus felino oral','Parvovirus oral felino','Virbac',28.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(56,'Moquillo oral','Moquillo oral canino','Zoetis',29.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(57,'Moquillo nasal','Moquillo nasal canino','Zoetis',29.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(58,'Hepatitis oral','Hepatitis oral canina','Zoetis',28.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(59,'Hepatitis nasal','Hepatitis nasal canina','Zoetis',28.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(60,'Parainfluenza nasal','Parainfluenza nasal canina','Zoetis',23.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(61,'Parainfluenza recombinante','Parainfluenza recombinante canina','Boehringer',27.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(62,'Leptospira oral','Leptospira oral canina','Boehringer',27.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(63,'Leptospira nasal','Leptospira nasal canina','Boehringer',27.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(64,'Bordetella recombinante','Bordetella recombinante canina','Boehringer',39.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(65,'Bordetella felina','Bordetella en felinos','Virbac',39.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(66,'Parvovirus canino recombinante','Parvovirus recombinante canino','Boehringer',36.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(67,'Moquillo canino recombinante','Moquillo recombinante canino','Boehringer',36.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(68,'Hepatitis recombinante','Hepatitis recombinante canina','Boehringer',32.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(69,'Triple viral felina','Panleucopenia, calicivirus, rinotraqueítis','Virbac',46.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(70,'Cuádruple canina','Moquillo, hepatitis, parvovirus, parainfluenza','Zoetis',52.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(71,'Quíntuple felina','Panleucopenia, calicivirus, rinotraqueítis, clamidiosis, leucemia','Virbac',55.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(72,'Hexavalente felina','Panleucopenia, calicivirus, rinotraqueítis, clamidiosis, leucemia, rabia','Virbac',60.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(73,'Parvovirus canino oral recombinante','Parvovirus oral recombinante canino','Boehringer',37.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(74,'Moquillo canino oral recombinante','Moquillo oral recombinante canino','Boehringer',37.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(75,'Hepatitis canina oral recombinante','Hepatitis oral recombinante canina','Boehringer',33.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(76,'Parainfluenza canina oral recombinante','Parainfluenza oral recombinante canina','Boehringer',28.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(77,'Leptospira canina oral recombinante','Leptospira oral recombinante canina','Boehringer',29.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(78,'Bordetella canina oral recombinante','Bordetella oral recombinante canina','Boehringer',40.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(79,'Rabia oral','Vacuna antirrábica oral','Zoetis',34.00,NULL,'canino/felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(80,'Rabia nasal','Vacuna antirrábica nasal','Zoetis',34.00,NULL,'canino/felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(81,'Leucemia felina oral','Leucemia viral felina oral','Virbac',41.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(82,'Leucemia felina nasal','Leucemia viral felina nasal','Virbac',41.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(83,'FIV oral','Inmunodeficiencia felina oral','Virbac',52.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(84,'FIV nasal','Inmunodeficiencia felina nasal','Virbac',52.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(85,'PIF oral','Peritonitis infecciosa felina oral','Virbac',57.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(86,'PIF nasal','Peritonitis infecciosa felina nasal','Virbac',57.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(87,'Herpesvirus felino oral','Herpesvirus tipo 1 felino oral','Virbac',30.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(88,'Herpesvirus felino nasal','Herpesvirus tipo 1 felino nasal','Virbac',30.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(89,'Clamidiosis felina oral','Chlamydophila felis oral','Boehringer',36.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(90,'Clamidiosis felina nasal','Chlamydophila felis nasal','Boehringer',36.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(91,'Toxoplasmosis oral','Prevención de toxoplasmosis oral','Virbac',44.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(92,'Toxoplasmosis nasal','Prevención de toxoplasmosis nasal','Virbac',44.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(93,'Brucelosis canina oral','Prevención de brucelosis oral','Zoetis',39.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(94,'Brucelosis felina oral','Prevención de brucelosis felina oral','Virbac',39.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(95,'Dirofilaria oral','Prevención de dirofilariosis oral','Zoetis',46.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(96,'Dirofilaria felina oral','Prevención de dirofilariosis felina oral','Virbac',46.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(97,'Moquillo felino recombinante','Moquillo recombinante felino','Boehringer',33.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(98,'Parvovirus felino nasal','Parvovirus nasal felino','Virbac',29.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(99,'Leptospira felina oral','Leptospira oral felina','Virbac',32.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(100,'Leptospira felina nasal','Leptospira nasal felina','Virbac',32.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(101,'Coronavirus felino oral','Coronavirus oral felino','Virbac',35.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(102,'Coronavirus felino nasal','Coronavirus nasal felino','Virbac',35.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(103,'Parvovirus canino nasal','Parvovirus nasal canino','Zoetis',28.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(104,'Moquillo canino nasal','Moquillo nasal canino','Zoetis',28.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(105,'Hepatitis canina nasal','Hepatitis nasal canina','Zoetis',29.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(106,'Parainfluenza canina nasal','Parainfluenza nasal canina','Zoetis',24.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-09 18:47:05','2025-06-15 20:02:41',100),(107,'Rabivax-B','Vacuna antirrábica inactivada para perros.','Bharat Biotech',120.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-15 19:23:53','2025-06-15 20:02:41',100),(108,'Rabia II','Rabia II prueba','Barath Biotech',35.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-15 21:08:21','2025-06-15 23:09:41',9),(109,'Rabia III','Rabia III prueba','Bharat Biotech',40.00,NULL,'felino',NULL,NULL,NULL,NULL,NULL,'2025-06-15 21:58:50','2025-06-15 23:10:19',20),(110,'Rabia IV','Rabia IV prueba','Bharat Biotech',120.00,NULL,'canino',NULL,NULL,NULL,NULL,NULL,'2025-06-15 23:08:17','2025-06-15 23:08:17',10);
/*!40000 ALTER TABLE `vacuna_catalogo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacuna_mascota`
--

DROP TABLE IF EXISTS `vacuna_mascota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacuna_mascota` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mascota_id` int NOT NULL,
  `vacuna_id` int NOT NULL,
  `fecha_aplicacion` datetime NOT NULL,
  `fecha_vencimiento` datetime DEFAULT NULL,
  `veterinario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mascota_id` (`mascota_id`),
  KEY `veterinario_id` (`veterinario_id`),
  KEY `vacuna_mascota_ibfk_2` (`vacuna_id`),
  CONSTRAINT `vacuna_mascota_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascota` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vacuna_mascota_ibfk_2` FOREIGN KEY (`vacuna_id`) REFERENCES `vacuna_catalogo` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vacuna_mascota_ibfk_3` FOREIGN KEY (`veterinario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacuna_mascota`
--

LOCK TABLES `vacuna_mascota` WRITE;
/*!40000 ALTER TABLE `vacuna_mascota` DISABLE KEYS */;
INSERT INTO `vacuna_mascota` VALUES (1,1,1,'2025-06-09 00:00:00','2025-09-09 00:00:00',7),(2,4,7,'2025-06-09 00:00:00','2026-06-09 00:00:00',7),(3,3,5,'2025-06-09 00:00:00','2026-06-09 00:00:00',7),(4,1,13,'2025-06-12 00:00:00','2026-06-12 00:00:00',7),(5,5,1,'2025-06-12 22:43:20',NULL,7),(6,5,3,'2025-06-12 22:53:38',NULL,7),(7,5,4,'2025-06-12 22:54:15',NULL,7),(8,1,6,'2025-06-12 22:54:48',NULL,7),(9,1,5,'2025-06-12 23:02:05','2026-06-12 00:00:00',7),(10,5,8,'2025-06-12 23:02:49','2027-06-12 00:00:00',7),(11,5,10,'2025-06-12 23:48:48','2026-06-12 00:00:00',7),(12,6,2,'2025-06-13 18:48:39','2026-06-13 00:00:00',7),(13,3,19,'2025-06-13 18:48:39','2025-06-13 00:00:00',7),(14,6,4,'2025-06-13 18:59:31','2026-06-13 00:00:00',7),(15,3,12,'2025-06-13 18:59:31','2025-09-13 00:00:00',7),(16,6,25,'2025-06-13 19:05:03','2026-06-13 00:00:00',7),(17,6,34,'2025-06-13 19:05:03','2025-09-13 00:00:00',7),(18,6,1,'2025-06-15 17:44:26','2026-06-13 00:00:00',7),(19,3,11,'2025-06-15 17:44:26','2027-06-12 00:00:00',7),(20,6,8,'2025-06-15 17:44:26','2030-06-15 00:00:00',7),(21,3,17,'2025-06-15 17:44:26','2028-06-15 00:00:00',7),(22,7,1,'2025-06-15 20:11:25','2026-06-15 00:00:00',7),(23,7,2,'2025-06-15 20:11:25','2026-06-15 00:00:00',7),(24,7,11,'2025-06-15 20:11:25','2027-06-15 00:00:00',7),(25,2,1,'2025-06-15 20:44:06',NULL,7),(26,2,3,'2025-06-15 20:45:52',NULL,7),(27,2,4,'2025-06-15 20:46:40',NULL,7),(28,2,4,'2025-06-15 20:47:49',NULL,7),(29,2,5,'2025-06-15 20:49:49',NULL,7),(30,2,6,'2025-06-15 21:01:34','2026-06-15 00:00:00',7),(31,2,4,'2025-06-15 21:01:34','2026-06-15 00:00:00',7),(32,8,108,'2025-06-15 21:10:13','2025-09-15 00:00:00',7),(33,8,2,'2025-06-15 21:50:41','2026-06-15 00:00:00',7),(34,9,3,'2025-06-15 21:51:11','2026-06-15 00:00:00',7),(35,10,1,'2025-06-15 22:00:11','2026-06-15 00:00:00',7),(36,10,3,'2025-06-15 22:00:11','2026-06-15 00:00:00',7),(37,10,8,'2025-06-15 22:00:11','2026-06-15 00:00:00',7),(38,10,15,'2025-06-15 22:00:49','2026-06-15 00:00:00',7),(39,10,29,'2025-06-15 22:02:30','2026-06-15 00:00:00',7),(40,11,1,'2025-06-15 22:47:31','2026-06-15 00:00:00',7),(41,11,2,'2025-06-15 22:47:31','2025-09-15 00:00:00',7),(42,11,6,'2025-06-15 22:47:31','2027-06-15 00:00:00',7),(43,4,38,'2025-06-16 00:02:39','2026-06-16 00:00:00',15);
/*!40000 ALTER TABLE `vacuna_mascota` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16 12:27:30
