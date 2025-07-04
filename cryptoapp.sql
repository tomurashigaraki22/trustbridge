-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 04, 2025 at 11:12 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4
USE `defaultdb`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cryptoapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `crypto_wallets`
--

CREATE TABLE `crypto_wallets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cryptocurrency` varchar(50) NOT NULL,
  `wallet_address` text NOT NULL,
  `shortcode` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crypto_wallets`
--

INSERT INTO `crypto_wallets` (`id`, `cryptocurrency`, `wallet_address`, `shortcode`) VALUES
(14, 'Bitcoin', 'random_bitcoin_address', 'btc_balance'),
(15, 'Tether', 'random_tether_address', 'usdt_balance'),
(16, 'Cardano', 'random_cardano_address', 'ada_balance'),
(17, 'Binance Coin', 'random_binance_address', 'bnb_balance'),
(18, 'Dogecoin', 'random_doge_address', 'doge_balance'),
(19, 'Ethereum', 'random_ethereum_address', 'eth_balance'),
(20, 'Polygon', 'random_polygon_address', 'matic_balance'),
(21, 'Solana', 'random_solana_address', 'sol_balance'),
(22, 'USD Coin', 'random_usdc_address', 'usdc_balance'),
(23, 'Ripple', 'random_xrp_address', 'xrp_balance');

-- --------------------------------------------------------

--
-- Table structure for table `deposits`
--

CREATE TABLE `deposits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cryptocurrency` varchar(50) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `wallet_address` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deposits`
--

INSERT INTO `deposits` (`id`, `user_id`, `cryptocurrency`, `amount`, `wallet_address`, `status`, `created_at`) VALUES
(1, 8, 'btc', 1000.00, 'random_bitcoin_address', 2, '2024-06-02 22:01:02');

-- --------------------------------------------------------

--
-- Table structure for table `investment`
--

CREATE TABLE `investment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cryptocurrency` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kyc`
--

CREATE TABLE `kyc` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `id_proof` varchar(255) NOT NULL,
  `address_proof` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kyc`
--

INSERT INTO `kyc` (`id`, `first_name`, `last_name`, `dob`, `address`, `phone_number`, `email`, `id_proof`, `address_proof`, `status`, `created_at`, `user_id`) VALUES
(1, 'Robinson', 'Honour', '2020-02-01', 'uniport', '09173169949', 'test@gmail.com', '../uploads/(Preview) Propel Agency UI Kit v1.0 - Digital agency website ui kit (Community).pdf', '../uploads/(Preview) Propel Agency UI Kit v1.0 - Digital agency website ui kit (Community).pdf', 2, '2025-01-07 05:53:12', 21),
(2, 'Robinson', 'Honour', '2020-02-01', 'uniport', '09173169949', 'test@gmail.com', '../uploads/(Preview) Propel Agency UI Kit v1.0 - Digital agency website ui kit (Community).pdf', '../uploads/(Preview) Propel Agency UI Kit v1.0 - Digital agency website ui kit (Community).pdf', 2, '2025-01-07 05:53:22', 21);


--
-- Table structure for table `loan`
--

CREATE TABLE `loan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cryptocurrency` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `p2p_transfers`
--

CREATE TABLE `p2p_transfers` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `amount` decimal(16,8) NOT NULL,
  `fee` decimal(16,8) NOT NULL,
  `net_amount` decimal(16,8) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 = Successful, 0 = Failed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `p2p_transfers`
--

INSERT INTO `p2p_transfers` (`id`, `sender_id`, `recipient_id`, `currency`, `amount`, `fee`, `net_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 20, 17, 'BTC', 23.00000000, 0.11500000, 22.88500000, 1, '2024-12-11 14:37:16', '2024-12-11 14:37:16'),
(2, 20, 17, 'BTC', 23.00000000, 0.11500000, 22.88500000, 1, '2024-12-11 14:37:42', '2024-12-11 14:37:42'),
(3, 20, 17, 'USDT', 233.00000000, 1.16500000, 231.83500000, 1, '2024-12-11 14:39:21', '2024-12-11 14:39:21'),
(4, 20, 17, 'BTC', 1.00000000, 0.00500000, 0.99500000, 1, '2024-12-11 14:39:47', '2024-12-11 14:39:47'),
(5, 20, 17, 'BTC', 1.00000000, 0.00500000, 0.99500000, 1, '2024-12-11 14:40:06', '2024-12-11 14:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `sitename` text DEFAULT NULL,
  `minimumdeposit` text DEFAULT NULL,
  `currency` text DEFAULT NULL,
  `livechatlink` text DEFAULT NULL,
  `minimumwithdrawal` text DEFAULT NULL,
  `id` int(11) NOT NULL,
  `companyemail` text DEFAULT NULL,
  `companyphone` text DEFAULT NULL,
  `companyaddress` text DEFAULT NULL,
  `strictkyc` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`sitename`, `minimumdeposit`, `currency`, `livechatlink`, `minimumwithdrawal`, `id`, `companyemail`, `companyphone`, `companyaddress`, `strictkyc`) VALUES
('Swiss App', '100', '$', NULL, '200', 1, 'investorhonour@gmail.com', '+1234456789', 'Flat 9, Biri kama drive, Uniportaaa', 1);

-- --------------------------------------------------------

--
-- Table structure for table `stakes`
--

CREATE TABLE `stakes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cryptocurrency` varchar(10) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stakes`
--

INSERT INTO `stakes` (`id`, `user_id`, `cryptocurrency`, `amount`, `status`, `created_at`, `updated_at`, `duration`) VALUES
(1, 8, 'btc', 500.00, 2, '2024-06-02 22:01:22', '2024-06-02 22:01:22', 3),
(2, 8, 'btc', 5000.00, 2, '2024-06-02 22:01:46', '2024-06-02 22:01:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `swaps`
--

CREATE TABLE `swaps` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `from_currency` varchar(10) NOT NULL,
  `to_currency` varchar(10) NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `fee` decimal(18,8) NOT NULL,
  `net_amount` decimal(18,8) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 = Successful, 0 = Failed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `swaps`
--

INSERT INTO `swaps` (`id`, `user_id`, `from_currency`, `to_currency`, `amount`, `fee`, `net_amount`, `status`, `created_at`) VALUES
(1, 20, 'BTC', 'USDT', 13.00000000, 0.01300000, 12.98700000, 1, '2024-12-11 12:51:11'),
(2, 20, 'BTC', 'USDT', 13.00000000, 0.01300000, 12.98700000, 1, '2024-12-11 12:51:35'),
(3, 20, 'BTC', 'USDT', 122.00000000, 0.12200000, 121.87800000, 1, '2024-12-11 12:51:54'),
(4, 20, 'BTC', 'USDT', 122.00000000, 0.12200000, 121.87800000, 1, '2024-12-11 12:51:56'),
(5, 20, 'BTC', 'USDT', 122.00000000, 0.12200000, 121.87800000, 1, '2024-12-11 12:52:26'),
(6, 20, 'BTC', 'USDT', 12.00000000, 0.01200000, 11.98800000, 1, '2024-12-11 13:36:31'),
(7, 20, 'BTC', 'USDT', 12.00000000, 0.01200000, 11.98800000, 1, '2024-12-11 13:39:51'),
(8, 20, 'BTC', 'USDT', 500.00000000, 0.50000000, 499.50000000, 1, '2024-12-11 13:43:15'),
(9, 20, 'USDT', 'BTC', 5000.00000000, 5.00000000, 4995.00000000, 1, '2024-12-12 16:46:46');

-- --------------------------------------------------------

--
-- Table structure for table `transfers`
--

CREATE TABLE `transfers` (
  `id` int(11) NOT NULL,
  `cryptocurrency` varchar(50) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `gas_fee` varchar(255) NOT NULL DEFAULT '0',
  `wallet_address` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `userId` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transfers`
--

INSERT INTO `transfers` (`id`, `cryptocurrency`, `amount`, `gas_fee`, `wallet_address`, `status`, `userId`, `created_at`) VALUES
(1, 'btc', 500.00, '', 'bc1q7zu49u0898uy89xtmgujnk2jy0tm7dr53e4za7', 0, 8, '2024-06-02 20:36:29'),
(2, 'btc', 500.00, '', 'bc1q7zu49u0898uy89xtmgujnk2jy0tm7dr53e4za7', 1, 8, '2024-06-02 20:41:46'),
(3, 'btc', 12.00, '', 'bc1q7zu49u0898uy89xtmgujnk2jy0tm7dr53e4za7', 0, 8, '2024-06-02 20:42:43'),
(4, 'btc', 12.00, '', 'bc1q7zu49u0898uy89xtmgujnk2jy0tm7dr53e4za7', 0, 8, '2024-06-02 20:44:48'),
(5, 'btc', 12.00, '', 'bc1q7zu49u0898uy89xtmgujnk2jy0tm7dr53e4za7', 1, 20, '2024-06-02 20:46:04'),
(6, 'btc', 10000.00, '', 'bc1q7zu49u0898uy89xtmgujnk2jy0tm7dr53e4za7', 2, 8, '2024-06-02 21:49:06'),
(7, 'usdt', 500.00, '', 'Xbsiemsosy3b3bzkbHhbdu7', 2, 3, '2024-06-02 21:56:28'),
(8, 'usdt', 500.00, '', 'Xbsiemsosy3b3bzkbHhbdu7', 0, 3, '2024-06-02 21:56:30'),
(9, 'usdt', 11.00, '', '6YyJVkqWai8DCgHxvb6hnqz7tpNqHEwPJ8AwmfJ6rwAc', 1, 20, '2024-12-09 05:38:10'),
(10, 'USDT', 88.00, '0.440', '6YyJVkqWai8DCgHxvb6hnqz7tpNqHEwPJ8AwmfJ6rwAc', 2, 20, '2024-12-10 14:57:50'),
(11, 'USDT', 22.00, '0.110', '6YyJVkqWai8DCgHxvb6hnqz7tpNqHEwPJ8AwmfJ6rwAc', 2, 20, '2024-12-10 14:58:29'),
(12, 'USDT', 22.00, '0.110', '6YyJVkqWai8DCgHxvb6hnqz7tpNqHEwPJ8AwmfJ6rwAc', 2, 20, '2024-12-10 15:05:01'),
(13, 'BTC', 25.00, '0.125', 'Unclehonour', 2, 20, '2024-12-10 20:05:10'),
(14, 'USDT', 22.00, '0.110', '6YyJVkqWai8DCgHxvb6hnqz7tpNqHEwPJ8AwmfJ6rwAc', 2, 20, '2024-12-10 20:05:34'),
(15, 'USDT', 22.00, '0.110', 'Honour', 2, 20, '2024-12-10 20:22:14'),
(16, 'USDT', 55.00, '0.275', 'Honour', 2, 20, '2024-12-11 13:37:41'),
(17, 'BTC', 22.00, '0.110', '6YyJVkqWai8DCgHxvb6hnqz7tpNqHEwPJ8AwmfJ6rwAc', 2, 20, '2024-12-11 17:30:51'),
(18, 'BTC', 3500.00, '17.500', '13cQG2mN8QfqvqdSaDZAD5ymtoceLY1n3w', 2, 20, '2024-12-12 16:47:07'),
(19, 'btc', 12.00, '0', 'ed', 2, 21, '2025-01-07 22:01:53'),
(20, 'btc', 1233.00, '0', 'honour', 0, 21, '2025-01-07 22:06:21'),
(21, 'btc', 566.00, '0', 'gsf', 1, 21, '2025-01-07 22:09:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uid` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1,
  `btc_balance` decimal(11,2) DEFAULT 0.00,
  `eth_balance` decimal(11,2) DEFAULT 0.00,
  `usdt_balance` decimal(11,2) DEFAULT 0.00,
  `bnb_balance` decimal(11,2) DEFAULT 0.00,
  `usdc_balance` decimal(11,2) DEFAULT 0.00,
  `xrp_balance` decimal(11,2) DEFAULT 0.00,
  `ada_balance` decimal(11,2) DEFAULT 0.00,
  `doge_balance` decimal(11,2) DEFAULT 0.00,
  `matic_balance` decimal(11,2) DEFAULT 0.00,
  `sol_balance` decimal(11,2) DEFAULT 0.00,
  `2fa_secret` varchar(64) DEFAULT NULL,
  `account_pin` int(11) DEFAULT 1234,
  `kyc` int(11) NOT NULL DEFAULT 0,
  `admin` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uid`, `email`, `password`, `balance`, `created_date`, `status`, `btc_balance`, `eth_balance`, `usdt_balance`, `bnb_balance`, `usdc_balance`, `xrp_balance`, `ada_balance`, `doge_balance`, `matic_balance`, `sol_balance`, `2fa_secret`, `account_pin`, `kyc`, `admin`) VALUES
(12, 'c46863de', 'iamrobinsonhonour@gmail.com', '$2y$10$BK3WAkDFOeaytE2Xe1GLgO/9gNDj6FL93MtRtk5y.gPewAPqbh3ri', 0, '2024-12-07 12:37:16', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 1234, 0, 0),
(17, '67adcd2f', 'investorhonour@gmail.com', '$2y$10$MBfRDELVOlef2mwGMQgW8.MgXmCHgrqNvpUTt2HEZ0gOJFhU/0xMq', 0, '2024-12-07 13:15:22', 1, 47.78, 0.00, 231.84, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 9910, 0, 0),
(18, 'c4f78827', 'pxxlspace@gmail.com', '$2y$10$IixZ/5ZoJDPKOHJWb45V2.9TxC3ZtpQ0PeWMqRPJtvgdGKhBt0lm6', 0, '2024-12-08 20:48:19', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 1234, 0, 0),
(19, '381adf0d', 'honour@gmail.com', '$2y$10$Z3t8us3Fs5BxkJycFvJ49eUTI0nH/zGnUriIiDvq3TJc.3HUAtwee', 0, '2024-12-08 20:52:38', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 1234, 0, 0),
(20, 'a135a209', 'testuser@gmail.com', '$2y$10$SvFOpaunPWEe6XB26TiI5.KmGMF7i1ppGfQP17k9zLu/.7TnowDBO', 0, '2024-12-08 20:54:52', 1, 1496.39, 0.00, 95449.95, 60.00, 0.00, 0.00, 0.00, 90000.00, 0.00, 0.00, NULL, 1234, 2, 0),
(21, 'ed24c89e', 'test@gmail.com', '$2y$10$SvFOpaunPWEe6XB26TiI5.KmGMF7i1ppGfQP17k9zLu/.7TnowDBO', 0, '2024-12-08 21:26:20', 1, 54989.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 1234, 2, 1),
(22, 'c9b4e3ab', 'test3@gmail.com', '$2y$10$9qP1dnz2onkZwXsJ8ggrzOR5k/jFES6LJMEXTo6PdyCB2sV9HZkuu', 0, '2024-12-08 21:26:54', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 1234, 0, 0),
(23, '157edbe4', 'test23233@gmail.com', '$2y$10$mgwJCN7aCtR0d7B5Y8JyHerZigj2sP7HGvlRAqHbV2Opue2wBVLFe', 0, '2024-12-08 21:31:36', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 1234, 0, 0),
(24, '1119011d', 'david.marcus0003@gmail.com', '$2y$10$Wt7AK9jM/q2eNQu/3Pf4N.AEjRl4vO9lBDqpAALhKEyZvVGgi4DEi', 0, '2024-12-09 13:13:31', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 2580, 0, 0);


ALTER TABLE `crypto_wallets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;


ALTER TABLE `deposits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;


ALTER TABLE `investment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `kyc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE `loan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `p2p_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;


ALTER TABLE `stakes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `swaps`
--
ALTER TABLE `swaps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transfers`
--
ALTER TABLE `transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;



ALTER TABLE `users`
  ADD COLUMN `username` VARCHAR(50) UNIQUE;

USE `defaultdb`;
ALTER TABLE `users`
  ADD COLUMN `first_name` VARCHAR(50);

ALTER TABLE `users`
  ADD COLUMN `last_name` VARCHAR(50);

USE `defaultdb`;
ALTER TABLE `users`
  ADD COLUMN `phone_number` VARCHAR(20);

ALTER TABLE `users`
  ADD COLUMN `country` VARCHAR(100);

USE `defaultdb`;
ALTER TABLE `users`
  ADD COLUMN `status` ENUM('active', 'suspended', 'pending', 'blocked') DEFAULT 'pending';

ALTER TABLE `users`
  ADD COLUMN `kyc_status` ENUM('none', 'pending', 'verified', 'rejected') DEFAULT 'none';


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
