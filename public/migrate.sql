-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 15, 2025 at 06:56 AM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u134244294_bittradingnft`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_info`
--

CREATE TABLE `account_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `priority` enum('urgent','normal') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_notices`
--

CREATE TABLE `account_notices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('security','transaction','kyc','system','promotion') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_notices`
--

INSERT INTO `account_notices` (`id`, `user_id`, `type`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.216', 1, '2025-04-12 10:51:33'),
(2, 3, 'security', 'New Login Detected', 'A new login was detected from 181.215.176.34', 1, '2025-04-12 11:25:57'),
(3, 53, 'security', 'New Login Detected', 'A new login was detected from 105.113.40.39', 1, '2025-04-12 11:31:00'),
(4, 53, 'transaction', 'Bonus Received', 'You received a bonus of $5000', 1, '2025-04-12 11:35:52'),
(5, 3, 'security', 'New Login Detected', 'A new login was detected from 181.215.176.34', 1, '2025-04-12 11:59:53'),
(6, 3, 'security', 'New Login Detected', 'A new login was detected from 181.215.176.34', 1, '2025-04-12 12:02:12'),
(7, 48, 'transaction', 'Bonus Received', 'You received a bonus of $0', 0, '2025-04-12 12:18:30'),
(8, 53, 'transaction', 'Bonus Received', 'You received a bonus of $300', 1, '2025-04-12 12:21:18'),
(9, 53, 'security', 'New Login Detected', 'A new login was detected from 105.113.40.39', 1, '2025-04-12 15:19:27'),
(10, 2, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.216', 1, '2025-04-12 16:33:39'),
(11, 2, 'transaction', 'Transaction Successful', 'Claimed Profit of $1410.7947810952235 from Gold Plan investment', 1, '2025-04-12 16:34:08'),
(12, 53, 'security', 'New Login Detected', 'A new login was detected from 105.113.10.178', 1, '2025-04-13 11:03:33'),
(13, 53, 'security', 'New Login Detected', 'A new login was detected from 105.113.10.178', 1, '2025-04-13 11:03:37'),
(14, 2, 'security', 'New Login Detected', 'A new login was detected from ::1', 0, '2025-04-13 14:56:22'),
(15, 3, 'security', 'New Login Detected', 'A new login was detected from ::1', 0, '2025-04-13 15:04:27'),
(16, 2, 'transaction', 'Bonus Received', 'You received a bonus of $5000', 0, '2025-04-13 15:05:09'),
(17, 53, 'transaction', 'Bonus Received', 'You received a bonus of $3000', 1, '2025-04-13 16:11:48'),
(18, 2, 'security', 'New Login Detected', 'A new login was detected from 102.90.101.53', 0, '2025-04-13 16:26:06'),
(19, 2, 'transaction', 'Investment Started', 'Successfully invested 10000 BTC (10000 USD) in Gold Plan', 0, '2025-04-13 16:28:30'),
(20, 53, 'transaction', 'Bonus Received', 'You received a bonus of $3000', 1, '2025-04-13 16:28:41'),
(21, 2, 'transaction', 'Investment Started', 'Successfully invested 10000 BTC (10000 USD) in Gold Plan', 0, '2025-04-13 16:34:50'),
(22, 2, 'transaction', 'Investment Started', 'Successfully invested 10000 BTC (10000 USD) in Premium Plan ', 0, '2025-04-13 16:35:37'),
(23, 48, 'security', 'New Login Detected', 'A new login was detected from 102.90.101.53', 0, '2025-04-13 16:40:13'),
(24, 48, 'transaction', 'Transaction Successful', 'Claimed Profit of $127541.10643492657 from Premium Plan  investment', 0, '2025-04-13 16:40:30'),
(25, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.101.53', 0, '2025-04-13 16:42:05'),
(26, 53, 'transaction', 'Bonus Received', 'You received a bonus of $1000', 1, '2025-04-13 16:45:09'),
(27, 53, 'transaction', 'Bonus Received', 'You received a bonus of $700', 1, '2025-04-13 16:56:06'),
(28, 53, 'transaction', 'Investment Started', 'Successfully invested 31500 BTC (31500 USD) in Gold Plan', 1, '2025-04-13 16:59:52');

-- --------------------------------------------------------

--
-- Table structure for table `api_keys`
--

CREATE TABLE `api_keys` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `key_name` varchar(100) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `api_secret` varchar(255) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `last_used` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crypto_holdings`
--

CREATE TABLE `crypto_holdings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `crypto_id` varchar(50) NOT NULL,
  `amount` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crypto_holdings`
--

INSERT INTO `crypto_holdings` (`id`, `user_id`, `crypto_id`, `amount`, `created_at`, `updated_at`) VALUES
(6, 2, 'bitcoin', 34586.00000050, '2025-03-07 18:00:10', '2025-03-07 18:31:07'),
(7, 2, 'tether', 189.00000000, '2025-03-07 18:19:37', '2025-03-07 19:17:45'),
(8, 2, 'ethereum', 26563.00000000, '2025-03-07 18:21:43', '2025-03-07 18:26:30');

-- --------------------------------------------------------

--
-- Table structure for table `investment_packages`
--

CREATE TABLE `investment_packages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `min_roi` decimal(5,2) NOT NULL,
  `max_roi` decimal(5,2) NOT NULL,
  `risk_level` enum('Low','Medium','Moderate','High') NOT NULL,
  `features` longtext DEFAULT NULL,
  `min_amount_usd` decimal(18,2) NOT NULL,
  `max_amount_usd` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `investment_packages`
--

INSERT INTO `investment_packages` (`id`, `name`, `description`, `duration_days`, `min_roi`, `max_roi`, `risk_level`, `features`, `min_amount_usd`, `max_amount_usd`, `is_active`, `created_at`) VALUES
(4, 'Gold Plan', 'High-yield investment for Gold Star 🌟 ', 186, 20.00, 50.00, 'Medium', '[\"Priority customer support\",\"Dedicated account manager\",\"Quarterly financial reports\",\"Early payout option\",\"Support\"]', 10000.00, 1000000.00, 1, '2025-02-10 05:37:46'),
(5, 'Premium Plan ', 'A Better Future 📉', 28, 10.00, 15.00, 'Moderate', '[\"Monthly performance reports\", \"Risk assessment analysis\", \"Email support\"]', 5000.00, 100000.00, 1, '2025-02-10 05:37:46'),
(6, 'Lite Plan ', 'A Secure Investment For The Future 📊', 50, 5.00, 8.00, 'Low', 'Basic support,Investment performance tracking,24 Hours Support', 1000.00, 20000.00, 1, '2025-02-10 05:37:46');

-- --------------------------------------------------------

--
-- Table structure for table `kyc_documents`
--

CREATE TABLE `kyc_documents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_type` enum('passport','national_id','drivers_license','proof_of_address') NOT NULL,
  `document_number` varchar(100) DEFAULT NULL,
  `document_url` varchar(255) DEFAULT NULL,
  `document_front_url` varchar(255) DEFAULT NULL,
  `document_back_url` varchar(255) DEFAULT NULL,
  `selfie_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','rejected') DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kyc_documents`
--

INSERT INTO `kyc_documents` (`id`, `user_id`, `document_type`, `document_number`, `document_url`, `document_front_url`, `document_back_url`, `selfie_url`, `status`, `rejection_reason`, `verified_by`, `verified_at`, `created_at`, `updated_at`) VALUES
(2, 3, 'national_id', 'qwwq', NULL, 'https://swissindextrade.pro/server/uploads/67cb53bb804ea_1741378491.png', 'https://swissindextrade.pro/server/uploads/67cb53bbf139c_1741378491.png', NULL, 'pending', NULL, NULL, NULL, '2025-03-07 20:14:51', '2025-03-07 20:14:51'),
(3, 3, 'passport', '222', NULL, 'https://swissindextrade.pro/server/uploads/67cb5408cb841_1741378568.jpeg', 'https://swissindextrade.pro/server/uploads/67cb54230aca4_1741378595.jpeg', NULL, 'pending', NULL, NULL, NULL, '2025-03-07 20:16:34', '2025-03-07 20:16:34'),
(4, 3, 'passport', '12323123', NULL, 'https://swissindextrade.pro/server/uploads/67cf04c4f397b_1741620420.png', 'https://swissindextrade.pro/server/uploads/67cf04c9276eb_1741620425.JPG', NULL, 'pending', NULL, NULL, NULL, '2025-03-10 15:27:04', '2025-03-10 15:27:04'),
(5, 3, 'passport', 'ueuirid', NULL, 'https://swissindextrade.pro/server/uploads/67cf091bd01ad_1741621531.jpg', 'https://swissindextrade.pro/server/uploads/67cf0926cd6c5_1741621542.jpeg', NULL, 'pending', NULL, NULL, NULL, '2025-03-10 15:45:42', '2025-03-10 15:45:42');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `email`, `otp`, `expires_at`, `used`, `created_at`) VALUES
(1, 3, 'codewithhonour@gmail.com', '702315', '2025-03-10 17:09:48', 1, '2025-02-10 12:14:00'),
(6, 2, 'investorhonour@gmail.com', '259189', '2025-02-10 22:54:16', 1, '2025-02-10 21:24:16');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `likes` int(11) DEFAULT 0,
  `comments` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_accounts`
--

CREATE TABLE `social_accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `username` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_accounts`
--

INSERT INTO `social_accounts` (`id`, `user_id`, `platform`, `username`, `status`, `created_at`, `updated_at`, `password`) VALUES
(2, 2, 'facebook', 'investorhonour@gmail.com', 'processing', '2025-03-07 20:04:31', '2025-03-07 20:04:31', NULL),
(3, 3, 'tiktok', 'sdf@gmail.com', 'processing', '2025-03-07 20:12:09', '2025-03-07 20:12:09', '44');

-- --------------------------------------------------------

--
-- Table structure for table `spot_transactions`
--

CREATE TABLE `spot_transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `crypto_id` varchar(50) NOT NULL,
  `type` enum('buy','sell') NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `price` decimal(18,2) NOT NULL,
  `value` decimal(18,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spot_transactions`
--

INSERT INTO `spot_transactions` (`id`, `user_id`, `crypto_id`, `type`, `amount`, `price`, `value`, `created_at`) VALUES
(2, 2, 'bitcoin', 'buy', 1.00000000, 88494.00, 88494.00, '2025-03-07 17:59:21'),
(3, 2, 'bitcoin', 'buy', 1.00000000, 88494.00, 88494.00, '2025-03-07 18:00:10'),
(4, 2, 'bitcoin', 'buy', 10.00000000, 87553.00, 875530.00, '2025-03-07 18:02:21'),
(5, 2, 'bitcoin', 'buy', 10.00000000, 87553.00, 875530.00, '2025-03-07 18:02:31'),
(6, 2, 'bitcoin', 'buy', 0.00000050, 87979.00, 0.04, '2025-03-07 18:07:41'),
(7, 2, 'tether', 'buy', 1233.00000000, 1.00, 1232.80, '2025-03-07 18:19:37'),
(8, 2, 'ethereum', 'buy', 33.00000000, 2173.13, 71713.29, '2025-03-07 18:21:43'),
(9, 2, 'ethereum', 'buy', 44.00000000, 2173.66, 95641.04, '2025-03-07 18:22:31'),
(10, 2, 'ethereum', 'buy', 44.00000000, 2173.66, 95641.04, '2025-03-07 18:22:54'),
(11, 2, 'ethereum', 'buy', 22.00000000, 2174.05, 47829.10, '2025-03-07 18:23:04'),
(12, 2, 'ethereum', 'buy', 33.00000000, 2174.05, 71743.65, '2025-03-07 18:23:31'),
(13, 2, 'ethereum', 'buy', 222.00000000, 2174.05, 482639.10, '2025-03-07 18:23:43'),
(14, 2, 'ethereum', 'buy', 3.00000000, 2174.05, 6522.15, '2025-03-07 18:23:59'),
(15, 2, 'ethereum', 'buy', 10.00000000, 2169.02, 21690.20, '2025-03-07 18:24:16'),
(16, 2, 'ethereum', 'buy', 444.00000000, 2169.02, 963044.88, '2025-03-07 18:25:09'),
(17, 2, 'ethereum', 'buy', 44.00000000, 2169.02, 95436.88, '2025-03-07 18:25:15'),
(18, 2, 'ethereum', 'buy', 23332.00000000, 2169.02, 50607574.64, '2025-03-07 18:25:46'),
(19, 2, 'ethereum', 'buy', 2332.00000000, 2169.02, 5058154.64, '2025-03-07 18:26:30'),
(20, 2, 'bitcoin', 'buy', 333.00000000, 87856.00, 29256048.00, '2025-03-07 18:26:56'),
(21, 2, 'bitcoin', 'buy', 44.00000000, 87856.00, 3865664.00, '2025-03-07 18:27:23'),
(22, 2, 'bitcoin', 'buy', 444.00000000, 87856.00, 39008064.00, '2025-03-07 18:27:28'),
(23, 2, 'bitcoin', 'buy', 33.00000000, 87856.00, 2899248.00, '2025-03-07 18:27:47'),
(24, 2, 'bitcoin', 'buy', 33.00000000, 87856.00, 2899248.00, '2025-03-07 18:28:03'),
(25, 2, 'bitcoin', 'buy', 333.00000000, 87856.00, 29256048.00, '2025-03-07 18:28:09'),
(26, 2, 'bitcoin', 'buy', 33333.00000000, 87856.00, 2928504048.00, '2025-03-07 18:31:02'),
(27, 2, 'bitcoin', 'buy', 12.00000000, 87856.00, 1054272.00, '2025-03-07 18:31:07'),
(28, 2, 'tether', 'sell', 122.00000000, 1.00, 121.97, '2025-03-07 19:06:00'),
(29, 2, 'tether', 'buy', 100.00000000, 1.00, 99.97, '2025-03-07 19:07:23'),
(30, 2, 'tether', 'sell', 1000.00000000, 1.00, 999.74, '2025-03-07 19:07:28'),
(31, 2, 'tether', 'buy', 1.00000000, 1.00, 1.00, '2025-03-07 19:17:24'),
(32, 2, 'tether', 'sell', 23.00000000, 1.00, 22.99, '2025-03-07 19:17:45');

-- --------------------------------------------------------

--
-- Table structure for table `trades`
--

CREATE TABLE `trades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `crypto_id` varchar(50) NOT NULL,
  `amount` decimal(24,8) NOT NULL,
  `price` decimal(24,8) NOT NULL,
  `type` varchar(4) NOT NULL CHECK (`type` in ('buy','sell')),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trades`
--

INSERT INTO `trades` (`id`, `user_id`, `crypto_id`, `amount`, `price`, `type`, `created_at`) VALUES
(1, 2, 'bitcoin', 59.00000000, 1.00000000, 'sell', '2025-03-07 05:54:23'),
(2, 2, 'bitcoin', 555.00000000, 1.00000000, 'buy', '2025-03-07 05:54:28'),
(3, 2, 'bitcoin', 5555.00000000, 1.00000000, 'buy', '2025-03-07 05:54:36'),
(4, 2, 'bitcoin', 233.00000000, 1.00000000, 'buy', '2025-03-07 17:38:44'),
(5, 2, 'bitcoin', 233.00000000, 1.00000000, 'buy', '2025-03-07 17:40:19'),
(6, 2, 'bitcoin', 233.00000000, 1.00000000, 'buy', '2025-03-07 17:40:21'),
(7, 2, 'bitcoin', 3.00000000, 1.00000000, 'buy', '2025-03-07 17:40:36'),
(8, 2, 'bitcoin', 33.00000000, 1.00000000, 'buy', '2025-03-07 17:41:25'),
(9, 2, 'bitcoin', 33.00000000, 1.00000000, 'buy', '2025-03-07 17:41:28'),
(10, 2, 'bitcoin', 33.00000000, 1.00000000, 'buy', '2025-03-07 17:41:39');

-- --------------------------------------------------------

--
-- Table structure for table `trading_bots`
--

CREATE TABLE `trading_bots` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `min_roi` decimal(10,2) DEFAULT NULL,
  `max_roi` decimal(10,2) DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `price_amount` decimal(20,2) DEFAULT NULL,
  `price_currency` enum('BTC','ETH','USDT') DEFAULT NULL,
  `status` enum('active','disabled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `bot_image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trading_bots`
--

INSERT INTO `trading_bots` (`id`, `name`, `description`, `min_roi`, `max_roi`, `duration_days`, `price_amount`, `price_currency`, `status`, `created_at`, `bot_image`) VALUES
(1, 'BTC Momentum Bots', 'Advanced momentum-based trading bot for Bitcoin. Uses multiple technical indicators to identify optimal entry and exit points.', 15.00, 400.00, 3, 50.00, 'BTC', 'active', '2025-02-11 03:42:58', 'https://swissindextrade.pro/server/uploads/67eccd2a04ec5_1743572266.gz'),
(2, 'ETH Scalping Bot', 'High-frequency Ethereum trading bot designed for quick profits. Utilizes market inefficiencies for rapid trades.', 500.00, 750.00, 7, 100.00, 'ETH', 'active', '2025-02-11 03:42:58', NULL),
(3, 'USDT Multi-Coin Bot', 'Diversified trading bot that trades top cryptocurrencies. Manages risk through portfolio diversification.', 20.00, 1000.00, 14, 1000.00, 'USDT', 'active', '2025-02-11 03:42:58', NULL),
(4, 'Dean Lewis', 'Dean Lewis is a seasoned copy trading agent with a keen eye for market trends and a passion for helping investors maximize their profits. With years of experience in financial markets, he specializes in identifying successful traders and enabling clients to mirror their strategies effortlessly. Dean is known for his analytical approach, risk management expertise, and ability to tailor trading solutions to suit individual investor needs.', 50.00, 500.00, 30, 50.00, 'BTC', 'active', '2025-04-02 11:25:12', 'https://swissindextrade.pro/server/uploads/67ed1e98ca718_1743593112.gz');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('deposit','withdrawal','transfer','trade','p2p','swap','investment','bonus','others') NOT NULL,
  `currency` varchar(10) NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `fee` decimal(18,8) DEFAULT 0.00000000,
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `tx_hash` varchar(255) DEFAULT NULL,
  `from_address` varchar(255) DEFAULT NULL,
  `to_address` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `crypto_id` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `type`, `currency`, `amount`, `fee`, `status`, `tx_hash`, `from_address`, `to_address`, `description`, `created_at`, `updated_at`, `crypto_id`, `price`) VALUES
(1, 53, 'bonus', 'btc', 5000.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-12 11:35:52', '2025-04-12 11:35:52', NULL, NULL),
(2, 48, 'bonus', 'btc', 0.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-12 12:18:30', '2025-04-12 12:18:30', NULL, NULL),
(3, 53, 'bonus', 'btc', 300.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-12 12:21:18', '2025-04-12 12:21:18', NULL, NULL),
(4, 2, 'investment', 'BTC', 1410.79478110, 0.00000000, 'completed', NULL, NULL, NULL, 'Profit claimed from Gold Plan investment', '2025-04-12 16:34:08', '2025-04-12 16:34:08', NULL, NULL),
(5, 2, 'bonus', 'btc', 5000.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-13 15:05:08', '2025-04-13 15:05:08', NULL, NULL),
(6, 53, 'bonus', 'btc', 3000.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-13 16:11:48', '2025-04-13 16:11:48', NULL, NULL),
(7, 2, 'investment', 'BTC', 10000.00000000, 0.00050000, 'completed', NULL, NULL, '31', 'Successfully invested $ 10000 in BTC into Gold Plan', '2025-04-13 16:28:30', '2025-04-13 16:28:30', NULL, NULL),
(8, 2, 'transfer', 'BTC', 10000.00000000, 0.00050000, 'completed', NULL, NULL, '31', 'Successfully invested 10000 BTC (10000 USD) in Gold Plan', '2025-04-13 16:28:30', '2025-04-13 16:28:30', NULL, NULL),
(9, 53, 'bonus', 'btc', 3000.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-13 16:28:40', '2025-04-13 16:28:40', NULL, NULL),
(10, 2, 'investment', 'BTC', 10000.00000000, 0.00050000, 'completed', NULL, NULL, '32', 'Successfully invested $ 10000 in BTC into Gold Plan', '2025-04-13 16:34:50', '2025-04-13 16:34:50', NULL, NULL),
(11, 2, 'transfer', 'BTC', 10000.00000000, 0.00050000, 'completed', NULL, NULL, '32', 'Successfully invested 10000 BTC (10000 USD) in Gold Plan', '2025-04-13 16:34:50', '2025-04-13 16:34:50', NULL, NULL),
(12, 2, 'investment', 'BTC', 10000.00000000, 0.00050000, 'completed', NULL, NULL, '33', 'Successfully invested $ 10000 in BTC into Premium Plan ', '2025-04-13 16:35:36', '2025-04-13 16:35:36', NULL, NULL),
(13, 2, 'transfer', 'BTC', 10000.00000000, 0.00050000, 'completed', NULL, NULL, '33', 'Successfully invested 10000 BTC (10000 USD) in Premium Plan ', '2025-04-13 16:35:36', '2025-04-13 16:35:36', NULL, NULL),
(14, 48, 'investment', 'BTC', 127541.10643493, 0.00000000, 'completed', NULL, NULL, NULL, 'Profit claimed from Premium Plan  investment', '2025-04-13 16:40:30', '2025-04-13 16:40:30', NULL, NULL),
(15, 53, 'bonus', 'btc', 1000.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-13 16:45:09', '2025-04-13 16:45:09', NULL, NULL),
(16, 53, 'bonus', 'btc', 700.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-13 16:56:06', '2025-04-13 16:56:06', NULL, NULL),
(17, 53, 'investment', 'BTC', 31500.00000000, 0.00050000, 'completed', NULL, NULL, '34', 'Successfully invested $ 31500 in BTC into Gold Plan', '2025-04-13 16:59:52', '2025-04-13 16:59:52', NULL, NULL),
(18, 53, 'transfer', 'BTC', 31500.00000000, 0.00050000, 'completed', NULL, NULL, '34', 'Successfully invested 31500 BTC (31500 USD) in Gold Plan', '2025-04-13 16:59:52', '2025-04-13 16:59:52', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `status` enum('active','suspended','pending','blocked') DEFAULT 'pending',
  `kyc_status` enum('none','pending','verified','rejected') DEFAULT 'none',
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `last_login` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `login_ip` varchar(45) DEFAULT NULL,
  `btc_balance` decimal(18,2) DEFAULT 0.00,
  `eth_balance` decimal(18,2) DEFAULT 0.00,
  `usdt_balance` decimal(18,2) DEFAULT 0.00,
  `bnb_balance` decimal(18,2) DEFAULT 0.00,
  `xrp_balance` decimal(18,2) DEFAULT 0.00,
  `ada_balance` decimal(18,2) DEFAULT 0.00,
  `doge_balance` decimal(18,2) DEFAULT 0.00,
  `sol_balance` decimal(18,2) DEFAULT 0.00,
  `dot_balance` decimal(18,2) DEFAULT 0.00,
  `matic_balance` decimal(18,2) DEFAULT 0.00,
  `link_balance` decimal(18,2) DEFAULT 0.00,
  `uni_balance` decimal(18,2) DEFAULT 0.00,
  `avax_balance` decimal(18,2) DEFAULT 0.00,
  `ltc_balance` decimal(18,2) DEFAULT 0.00,
  `shib_balance` decimal(18,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profile_image` text DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `otp_status` varchar(10) DEFAULT 'pending' CHECK (`otp_status` in ('active','pending')),
  `otp_code` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `first_name`, `last_name`, `phone_number`, `country`, `status`, `kyc_status`, `two_factor_enabled`, `last_login`, `login_ip`, `btc_balance`, `eth_balance`, `usdt_balance`, `bnb_balance`, `xrp_balance`, `ada_balance`, `doge_balance`, `sol_balance`, `dot_balance`, `matic_balance`, `link_balance`, `uni_balance`, `avax_balance`, `ltc_balance`, `shib_balance`, `created_at`, `updated_at`, `profile_image`, `is_admin`, `otp_status`, `otp_code`) VALUES
(2, 'investorhonour@gmail.com', '$2a$10$UW7e512K1sFfFDBAe/nK8.jp8PNUqflHqTFJqePHuBAJ0XFXVb4NO', 'd74ez', 'Robinson', 'Honour', '9163169949', 'United Kingdom', 'active', 'verified', 0, '2025-04-13 16:35:36', '102.90.101.53', 80000.00, 33.00, 122081.15, 0.00, 0.00, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 900.00, 0.00, 0.00, '2025-02-09 04:24:14', '2025-04-13 16:35:36', NULL, 0, 'active', NULL),
(3, 'admin@gmail.com', '$2a$10$UW7e512K1sFfFDBAe/nK8.jp8PNUqflHqTFJqePHuBAJ0XFXVb4NO', 'g5lf9', 'Honour', 'Robbie', '', '', 'active', 'pending', 0, '2025-04-13 16:42:05', '102.90.101.53', 595.05, 22.00, 9667.00, 0.00, 0.00, 50.00, 950.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-02-10 00:01:57', '2025-04-13 16:42:05', NULL, 1, 'active', NULL),
(48, 'oscar_lara1986@yahoo.com', '$2y$10$DZpB5xBcHm5cXlC8Gi8MT.RozdW.cd49lohnYhJJoJku6X0v/fIuq', 'oscar_lara', 'Oscar', 'Lara', '3619200812', 'USA', 'active', '', 0, '2025-04-13 16:41:46', '102.90.101.53', 127541.11, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2024-04-24 17:41:10', '2025-04-13 16:41:46', NULL, 0, 'active', NULL),
(51, 'carlos@gmail.com', '$2y$10$tFcDla6P0gslDmB1fnyzgO3AzwiWjYP.GX7haFc9F/zkpf1MagN6m', 'robinson', 'Robinson', NULL, '123', 'Afghanistan', 'active', 'none', 0, '2025-04-12 10:57:58', NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2024-08-08 19:58:45', '2024-08-08 19:58:45', NULL, 0, 'active', '2980'),
(52, 'Johnsoncypher2524@gmail.com', '$2y$10$ZKP01Af2RyhfULNzrALsH.9GFjg4aS2brF/85GwMZ7Z7SYc.vIrF6', 'johnson', 'Johnson', NULL, '', 'United States', 'active', 'none', 0, '2025-04-12 10:57:58', NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2024-08-09 10:49:13', '2024-08-09 10:49:13', NULL, 0, 'active', '9158'),
(53, 'jamesthomas25242524@gmail.com', '$2y$10$MbRRR7QUaV1xDsmw6y3/..osVb1.1boW7o6f765Dx7aQQpxNlNmgi', 'james', 'James', NULL, '', 'United States', 'active', 'none', 0, '2025-04-13 16:59:52', '105.113.10.178', 500.00, 0.00, 94000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2024-08-09 12:25:19', '2025-04-13 16:59:52', NULL, 0, 'active', '6235'),
(54, 'ddoxA637@gmail.com', '$2y$10$qGkyJ.WhRnZP8SvXX1EIX.cKgEe7nRvpWSwGdCyeAwbFOCJgqLinK', 'keith', 'Keith', NULL, '', 'Afghanistan', 'active', '', 0, '2025-04-12 11:01:51', NULL, 0.00, 0.00, 30000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2024-08-10 21:24:03', '2025-04-12 11:01:51', NULL, 0, 'active', '4539'),
(86, 'darrowramos@gmail.com', '$2y$10$tRPl5YxZbRnK2e.kJI4mbOcUxtiRw.VEHY7PIRlPrh7PatGaU.8yy', 'raymond', 'Raymond', NULL, '', 'United States', 'active', '', 0, '2025-04-12 11:01:32', NULL, 0.00, 0.00, 12190.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-03-22 03:38:39', '2025-04-12 11:01:32', NULL, 0, 'active', '5850');

-- --------------------------------------------------------

--
-- Table structure for table `user_investments`
--

CREATE TABLE `user_investments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `amount_usd` decimal(18,2) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `start_date` datetime DEFAULT current_timestamp(),
  `end_date` datetime NOT NULL,
  `daily_roi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`daily_roi`)),
  `auto_compound` tinyint(1) DEFAULT 0,
  `status` enum('active','completed','cancelled') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_investments`
--

INSERT INTO `user_investments` (`id`, `user_id`, `package_id`, `amount_usd`, `currency`, `start_date`, `end_date`, `daily_roi`, `auto_compound`, `status`) VALUES
(18, 2, 4, 200.00, 'BTC', '2025-02-02 11:25:44', '2025-02-09 11:25:44', '[44.73,29.48,52.12,45.11,47.85,52.87,57.68]', 0, 'completed'),
(19, 6, 4, 50.00, 'ETH', '2025-02-11 09:32:29', '2025-02-18 09:32:29', '[69.04,54.76,61.66,69.92,45.51,60.11,69.77]', 0, 'active'),
(20, 3, 4, 10.00, 'BTC', '2025-02-17 01:08:02', '2025-02-24 01:08:02', '[32.34,41.76,63.51,47.15,59.75,38.51,50.23]', 0, 'completed'),
(29, 2, 4, 100.00, 'BTC', '2025-02-26 10:21:07', '2025-03-05 10:21:07', '[41.33,52.7,48.63,55.56,38.93,48.57,46.69]', 0, 'completed'),
(30, 2, 5, 6776.00, 'BTC', '2025-02-26 22:17:47', '2025-03-26 22:17:47', '[5.01,4.6,5.32,4.57,3.98,5.05,3.82,4.6,5.19,4.46,5.12,5.19,3.58,4.91,4.68,4.01,4.4,5.16,5.03,4.11,4.51,3.9,3.6,5.35,5.29,4.41,4.1,3.83]', 1, 'completed'),
(33, 48, 5, 55000.00, 'BTC', '2025-03-14 16:35:36', '2025-04-11 16:35:36', '[4.93,4.17,3.66,4.3,4.98,4.03,3.73,5.18,4.38,4.88,5.17,3.8,4.56,3.96,3.93,3.89,4.97,3.95,4.22,4.63,4.15,5,3.62,3.83,4.54,5.09,3.72,5.34]', 0, 'completed'),
(34, 53, 4, 31500.00, 'BTC', '2025-04-13 16:59:52', '2025-10-16 16:59:52', '[2.45,1.26,1.1,1.67,2.37,2.1,1.54,2.6,1.52,2.26,2.46,2.27,1.18,1.37,1.09,1.77,2.4,2.01,1.12,2.42,1.52,2.11,2.28,2.4,1.51,2.55,1.34,1.62,1.8,1.55,2.24,1.98,2.66,1.65,2.59,1.46,1.69,1.84,2.27,2.12,1.08,2.3,2.22,1.93,2.01,2.06,2.66,1.49,2.61,1.55,2.57,1.16,2.3,1.48,1.24,1.7,2.42,1.77,1.3,2.58,1.61,1.49,2.13,1.85,2.25,1.58,2.56,1.4,1.71,1.12,1.16,1.79,1.98,2.53,2.53,1.67,2.49,2.38,1.2,2.22,1.11,1.3,2.24,1.28,2.08,1.68,1.71,1.14,2.55,2.39,1.66,2.06,2.51,2.33,2.24,2.45,1.72,2.09,1.8,1.85,2.67,2.68,1.89,2.02,2.19,2.08,1.57,1.1,2.04,1.63,1.36,1.2,2.36,2.62,2.18,1.61,2.02,2.45,1.45,2.66,2.54,1.78,1.62,2.14,2.39,1.71,1.48,2.38,2.58,2.42,1.89,1.66,1.73,2,1.6,1.91,2.58,2.59,2.59,1.13,1.46,1.59,2.2,1.66,2.49,2.43,2.4,2.48,2.49,1.1,2.28,1.32,1.75,2.4,2.13,2.16,1.26,1.89,2.01,2.62,1.14,2.22,1.91,1.11,1.51,2.33,1.83,1.58,1.46,1.15,2.22,2.08,2.13,2.48,1.1,1.99,1.77,1.75,1.88,1.23,1.85,1.2,2.55,1.97,1.7,2.22]', 0, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user_trading_sessions`
--

CREATE TABLE `user_trading_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bot_id` int(11) NOT NULL,
  `initial_amount` decimal(20,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` enum('active','completed','failed') DEFAULT NULL,
  `trading_data_url` text DEFAULT NULL,
  `current_profit` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_trading_sessions`
--

INSERT INTO `user_trading_sessions` (`id`, `user_id`, `bot_id`, `initial_amount`, `currency`, `start_date`, `end_date`, `status`, `trading_data_url`, `current_profit`) VALUES
(23, 2, 1, 900.00, 'BTC', '2025-02-25 07:17:58', '2025-02-20 21:12:39', 'active', 'https://swissindextrade.pro/server/uploads/67b3a6476d873_1739826759.gz', 387.74),
(24, 2, 1, 100.00, 'BTC', '2025-02-25 06:53:02', '2025-02-28 06:53:02', 'active', 'https://swissindextrade.pro/server/uploads/67bd68ceaddf8_1740466382.gz', 0.00),
(25, 2, 2, 800.00, 'BTC', '2025-02-26 21:17:20', '2025-03-05 21:15:27', 'completed', 'https://swissindextrade.pro/server/uploads/67bf846f659fa_1740604527.gz', 726.63),
(26, 3, 2, 200.00, 'BTC', '2025-03-15 06:32:16', '2025-03-22 06:32:16', 'active', 'https://swissindextrade.pro/server/uploads/67d51ef0518df_1742020336.gz', 0.00),
(27, 3, 4, 333.00, 'USDT', '2025-04-02 11:28:58', '2025-05-02 11:28:58', 'active', 'https://swissindextrade.pro/server/uploads/67ed1f7b11192_1743593339.gz', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `wallet_addresses`
--

CREATE TABLE `wallet_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet_addresses`
--

INSERT INTO `wallet_addresses` (`id`, `user_id`, `currency`, `address`, `label`, `is_default`, `created_at`) VALUES
(1, 1, 'BTC', 'PLEASE CONTACT ADMIN FOR DEPOSIT WALLET', 'Bitcoin Wallet', 1, '2025-02-09 17:29:52'),
(2, 1, 'ETH', 'PLEASE CONTACT ADMIN FOR DEPOSIT WALLET', 'Ethereum Wallet', 1, '2025-02-09 17:29:52'),
(3, 1, 'USDT', 'PLEASE CONTACT ADMIN FOR DEPOSIT WALLET', 'USDT Wallet', 1, '2025-02-09 17:29:52'),
(4, 1, 'BNB', 'PLEASE CONTACT ADMIN FOR DEPOSIT WALLET', 'BNB Wallet', 1, '2025-02-09 17:29:52'),
(5, 1, 'XRP', ' ', 'XRP Wallet', 0, '2025-02-09 17:29:52'),
(6, 1, 'ADA', ' ', 'Cardano Wallet', 0, '2025-02-09 17:29:52'),
(7, 1, 'DOGE', ' ', 'Dogecoin Wallet', 0, '2025-02-09 17:29:52'),
(8, 1, 'SOL', ' ', 'Solana Wallet', 0, '2025-02-09 17:29:52'),
(9, 1, 'DOT', ' ', 'Polkadot Wallet', 0, '2025-02-09 17:29:52'),
(10, 1, 'MATIC', ' ', 'Polygon Wallet', 0, '2025-02-09 17:29:52'),
(11, 1, 'LINK', ' ', 'ChainLink Wallet', 0, '2025-02-09 17:29:52'),
(12, 1, 'UNI', ' ', 'Uniswap Wallet', 0, '2025-02-09 17:29:52'),
(13, 1, 'AVAX', ' ', 'Avalanche Wallet', 0, '2025-02-09 17:29:52'),
(14, 1, 'LTC', ' ', 'Litecoin Wallet', 0, '2025-02-09 17:29:52'),
(15, 1, 'SHIB', ' ', 'Shiba Inu Wallet', 0, '2025-02-09 17:29:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_info`
--
ALTER TABLE `account_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `account_notices`
--
ALTER TABLE `account_notices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `crypto_holdings`
--
ALTER TABLE `crypto_holdings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_crypto` (`user_id`,`crypto_id`);

--
-- Indexes for table `investment_packages`
--
ALTER TABLE `investment_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `verified_by` (`verified_by`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `social_accounts`
--
ALTER TABLE `social_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `spot_transactions`
--
ALTER TABLE `spot_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trades`
--
ALTER TABLE `trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_trades_user_id` (`user_id`),
  ADD KEY `idx_trades_crypto_id` (`crypto_id`);

--
-- Indexes for table `trading_bots`
--
ALTER TABLE `trading_bots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_investments`
--
ALTER TABLE `user_investments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `user_trading_sessions`
--
ALTER TABLE `user_trading_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `bot_id` (`bot_id`);

--
-- Indexes for table `wallet_addresses`
--
ALTER TABLE `wallet_addresses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_info`
--
ALTER TABLE `account_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `account_notices`
--
ALTER TABLE `account_notices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `api_keys`
--
ALTER TABLE `api_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crypto_holdings`
--
ALTER TABLE `crypto_holdings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `investment_packages`
--
ALTER TABLE `investment_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_accounts`
--
ALTER TABLE `social_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `spot_transactions`
--
ALTER TABLE `spot_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `trades`
--
ALTER TABLE `trades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `trading_bots`
--
ALTER TABLE `trading_bots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `user_investments`
--
ALTER TABLE `user_investments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `user_trading_sessions`
--
ALTER TABLE `user_trading_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `wallet_addresses`
--
ALTER TABLE `wallet_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_info`
--
ALTER TABLE `account_info`
  ADD CONSTRAINT `account_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
