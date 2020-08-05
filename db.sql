/*
SQLyog Professional v12.09 (64 bit)
MySQL - 5.7.29 : Database - descom_app
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`descom_app` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `descom_app`;

/*Table structure for table `activity_payload_mapping` */

CREATE TABLE `activity_payload_mapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(128) DEFAULT NULL,
  `payload_mapping` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `activity_payload_mapping` */

insert  into `activity_payload_mapping`(`id`,`activity_name`,`payload_mapping`) values (1,'email_activity','{\"item\":{\"b\":\"a\",\"d\":\"c\",\"f\":\"e\",\"n\":\"undefined\",\"p\":\"undefined\"},\"defaults\":{\"n\":false,\"p\":1}}');
insert  into `activity_payload_mapping`(`id`,`activity_name`,`payload_mapping`) values (2,'tcp_activity','{}');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
