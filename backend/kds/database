/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: kds
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES
(1,NULL,'Burgerek'),
(2,NULL,'Szendvicsek & Chopped Cheese'),
(3,NULL,'Tálak & Boxok'),
(4,NULL,'Köretek & Snackek'),
(5,NULL,'Desszert'),
(6,NULL,'Italok & Kávék');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `item_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `item_status` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_order_id` bigint(20) DEFAULT NULL,
  `product_product_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `FK5rg4979tfgc0krehhy6eh2e8f` (`product_product_id`),
  KEY `FKdf4sdmwfnxquyj8hcfrlu9a24` (`order_order_id`),
  CONSTRAINT `FK5rg4979tfgc0krehhy6eh2e8f` FOREIGN KEY (`product_product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKdf4sdmwfnxquyj8hcfrlu9a24` FOREIGN KEY (`order_order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `full_price` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `table_numb` int(11) DEFAULT NULL,
  `time_stamp` datetime(6) DEFAULT NULL,
  `user_user_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FKcooejujh32cpgw33d02snbufy` (`user_user_id`),
  KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`),
  CONSTRAINT `FKcooejujh32cpgw33d02snbufy` FOREIGN KEY (`user_user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `available` bit(1) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `category_category_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FKle1pobdrc8a2uw97gukfmvan4` (`category_category_id`),
  CONSTRAINT `FKle1pobdrc8a2uw97gukfmvan4` FOREIGN KEY (`category_category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES
(2,'','Briós buci, 1x75g Angus marhahúspogácsa, cheddar sajt, karamellizált hagyma, ketchup, mustár, paradicsom, saláta, savanyú uborka','Domi\'s Junior Burger',2150,1),
(3,'','180g kebab hús, trappista sajt, uborkás tartármártás, lilahagyma, lilakáposzta, savanyú uborka, saláta, paradicsom','Döner Szendvics',3150,2),
(4,'','Briós buci, enyhén pikáns csirkemell darabok ropogós kukoricapehely bundában, majonéz, savanyú uborka, paradicsom, saláta','Crunchy Chicken Burger',2200,1),
(5,'','Briós buci, Angus marhahúspogácsa, cheddar sajt, karamellizált hagyma, Mr. Mon\'s házi szósz, burgonyachips, saláta, savanyú uborka','Mr. Mon\'s Burger',2750,1),
(9,'','200g Kentucky csirkemell csíkok, cheddar sajtszósz, édes-chilis szósz, lilahagyma, savanyú uborka, saláta, paradicsom','Kentucky Szendvics',3150,2),
(10,'','Briós buci, Angus marhahúspogácsa, cheddar sajt, karamellizált hagyma, ketchup, mustár, saláta, savanyú uborka','Classic Burger',2750,1),
(11,'','Briós buci, Angus marhahúspogácsa, 2x dupla cheddar sajt, karamellizált hagyma, Mr. Mon\'s házi szósz, cheddar szósz, saláta, savanyú uborka','Double Cheese Burger',2850,1),
(12,'','Briós buci, Angus marhahúspogácsa, cheddar sajt, bacon, karamellizált hagyma, Mr. Mon\'s házi szósz, BBQ szósz, saláta, savanyú uborka','BBQ Burger',2850,1),
(13,'','Briós buci, Angus marhahúspogácsa, cheddar sajt, bacon, karamellizált hagyma, burgonyachips, szarvasgombás majonéz, saláta, savanyú uborka','Szarvasgombás Burger',2950,1),
(14,'','Briós buci, 1x75g Angus marhahúspogácsa, bacon, rántott cheddar sajt, áfonya lekvár, fokhagymás szósz, karamellizált hagyma, paradicsom, saláta, savanyú uborka, cheddar sajt','Fried Cheddar Cheese Burger',3050,1),
(15,'','Briós buci, Angus marhahúspogácsa, parmezán sajt, mézes-mustáros szósz, chipotle szósz, savanyú uborka, paradicsom, saláta, jalapeno','Hhm.... Burger',3050,1),
(16,'','150g Angus darált marhahús, 3x cheddar sajt, karamellizált hagyma és kápia paprika, lilahagyma, ketchup, majonéz, cheddar sajtszósz, savanyú uborka, saláta, paradicsom','Classic Chopped Cheese',3000,2),
(17,'','150g Angus darált marhahús, 3x cheddar sajt, karamellizált hagyma és kápia paprika, lilahagyma, baconös majonéz, cheddar sajtszósz, bacon, savanyú uborka, saláta, paradicsom','Bacon-Mayo Chopped Cheese',3150,2),
(18,'','150g Angus darált marhahús, 3x cheddar sajt, karamellizált hagyma és kápia paprika, lilahagyma, szarvasgombás majonéz, cheddar sajtszósz, bacon, savanyú uborka, saláta, paradicsom','Szarvasgombás Chopped Cheese',3150,2),
(19,'','150g Angus darált marhahús, 3x cheddar sajt, karamellizált hagyma és kápia paprika, lilahagyma, baconös majonéz, cheddar sajtszósz, hagymakarikák, savanyú uborka, saláta, paradicsom','Hagymakarikás Chopped Cheese',3150,2),
(20,'','150g Angus darált marhahús, 3x cheddar sajt, karamellizált hagyma és kápia paprika, lilahagyma, mexikói szósz (nem csípős), cheddar sajtszósz, kukorica, savanyú uborka, saláta, paradicsom','Mexikói Chopped Cheese',3150,2),
(21,'','Kentucky csirkemell csíkok, cheddar szósz, házi édes-chilis szósz, sült burgonya, újhagyma, saláta','Mr. Mon\'s Kentucky Chicken Fries',3100,3),
(22,'','Sült burgonya, cheddar szósz, Mr. Mon\'s házi szósz, karamellizált hagyma','Mr. Mon\'s Cheese Fries',1900,3),
(23,'','Sült burgonya, cheddar szósz, Mr. Mon\'s házi szósz, csirkeszárnyak, szezámmag, karamellizált hagyma','Wings Tál (Buffalo, BBQ vagy Mangó)',2400,3),
(24,'','Választható szósszal','Mr. Mon\'s Nuggets',950,3),
(25,'','','Sült burgonya',750,4),
(26,'','','Hagymakarikák (8db)',950,4),
(27,'','','Cheddaros Jalapeno sajt golyók (4db)',1690,4),
(28,'','','Bundázott sajtgolyók (8db)',1490,4),
(29,'','','Chili Cheddar sajtgolyó (8db)',1690,4),
(30,'','','Rántott Trappista sajtkorong (6db)',1850,4),
(31,'','','Coleslaw saláta',550,4),
(32,'','Választható karamella, csoki vagy epres öntettel','Churros (fahéjas-cukros)',950,5),
(33,'','(Coca Cola, Zero, Sprite, Fanta, Lipton)','Üdítők (330ml)',400,6),
(34,'','','Hell Energiaital (250ml)',350,6),
(35,'','(Savas/Mentes)','Ásványvíz (500ml)',250,6),
(36,'','','Sörök (0,5L)',500,6),
(37,'','','Espresso',300,6);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(1,'Admin','$2a$10$dj631gwlfw8m8RdqVtU.8OYOLZPZPVRpMVql7/Nfco9piP9E.uqNW','ADMIN','admin');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-26 21:33:44
