-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 15, 2025 at 10:39 PM
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
-- Database: `u134244294_tokentrader`
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

--
-- Dumping data for table `account_info`
--

INSERT INTO `account_info` (`id`, `user_id`, `priority`, `title`, `message`, `created_at`) VALUES
(6, 3, 'normal', 'wreff', 'sfwed', '2025-03-25 23:00:49');

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
(1, 2, 'security', 'New Login Detected', 'A new login was detected from ::ffff:192.168.1.198', 0, '2025-03-25 21:00:07'),
(2, 2, 'security', 'New Login Detected', 'A new login was detected from 105.116.12.194', 0, '2025-03-25 21:45:31'),
(3, 2, 'transaction', 'Transaction Successful', 'Claimed Profit of $1410.7947810952235 from Premium Package investment', 0, '2025-03-25 21:58:05'),
(4, 2, 'transaction', 'Transfer Initiated', 'Crypto Transfer to bta291nsaodia380qjadad - Amount: $1010.00 BTC', 0, '2025-03-25 21:59:18'),
(5, 40, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 1, '2025-03-25 22:16:45'),
(6, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.174', 1, '2025-03-25 22:42:03'),
(7, 40, 'transaction', 'Bonus Received', 'You received a bonus of $200', 1, '2025-03-25 22:45:11'),
(8, 40, 'transaction', 'Bonus Received', 'You received a bonus of $0', 1, '2025-03-25 22:45:11'),
(9, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.174', 1, '2025-03-25 22:48:17'),
(10, 3, '', 'wreff', 'sfwed', 1, '2025-03-25 23:00:49'),
(11, 40, 'security', 'New Login Detected', 'A new login was detected from 102.90.80.158', 1, '2025-03-25 23:14:54'),
(12, 2, 'security', 'New Login Detected', 'A new login was detected from 102.90.103.201', 0, '2025-03-25 23:18:20'),
(13, 3, 'security', 'New Login Detected', 'A new login was detected from 105.113.90.199', 1, '2025-03-26 00:03:09'),
(14, 40, 'security', 'New Login Detected', 'A new login was detected from 105.113.90.199', 1, '2025-03-26 02:27:22'),
(15, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.57', 1, '2025-03-27 13:21:40'),
(16, 41, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 0, '2025-03-31 15:16:47'),
(17, 41, 'transaction', 'Bonus Received', 'You received a bonus of $200', 0, '2025-03-31 15:24:58'),
(18, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.101.2', 1, '2025-04-05 12:17:47'),
(19, 42, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 0, '2025-04-07 10:30:15'),
(20, 40, 'security', 'New Login Detected', 'A new login was detected from 105.113.109.180', 1, '2025-04-07 18:06:05'),
(21, 3, 'security', 'New Login Detected', 'A new login was detected from 105.113.109.180', 1, '2025-04-07 18:06:23'),
(22, 42, 'transaction', 'Bonus Received', 'You received a bonus of $200', 0, '2025-04-07 18:07:16'),
(23, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.223', 1, '2025-04-08 19:35:43'),
(25, 44, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 1, '2025-04-08 19:57:04'),
(28, 45, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 0, '2025-04-09 00:42:51'),
(29, 46, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 0, '2025-04-09 20:21:01'),
(30, 46, 'transaction', 'Bonus Received', 'You received a bonus of $200', 0, '2025-04-10 04:53:20'),
(31, 47, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 1, '2025-04-10 17:31:10'),
(32, 48, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 1, '2025-04-11 19:56:49'),
(33, 48, 'transaction', 'Bonus Received', 'You received a bonus of $200', 1, '2025-04-11 20:21:07'),
(34, 48, 'transaction', 'Bonus Received', 'You received a bonus of $200', 1, '2025-04-11 20:21:08'),
(35, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.81.174', 1, '2025-04-11 20:23:25'),
(36, 40, 'security', 'New Login Detected', 'A new login was detected from 102.90.101.117', 1, '2025-04-11 21:08:22'),
(37, 40, 'transaction', 'Deposit Pending', 'Your BTC deposit is pending and awaiting confirmation', 1, '2025-04-11 21:25:37'),
(38, 40, 'security', 'New Login Detected', 'A new login was detected from 102.90.101.117', 1, '2025-04-11 21:28:47'),
(39, 49, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 1, '2025-04-11 21:40:18'),
(40, 40, 'security', 'New Login Detected', 'A new login was detected from 102.90.101.117', 1, '2025-04-11 22:12:19'),
(41, 40, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.138', 1, '2025-04-12 03:35:40'),
(42, 40, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.138', 1, '2025-04-12 04:16:46'),
(43, 2, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.216', 0, '2025-04-12 10:12:05'),
(44, 2, 'security', 'New Login Detected', 'A new login was detected from 102.90.82.216', 0, '2025-04-12 10:26:54'),
(45, 3, 'security', 'New Login Detected', 'A new login was detected from 102.90.79.72', 0, '2025-04-12 10:46:58'),
(46, 49, 'transaction', 'Deposit Pending', 'Your BTC deposit is pending and awaiting confirmation', 1, '2025-04-12 10:54:55'),
(47, 50, 'system', 'Welcome to CryptoApp', 'Thank you for joining!', 0, '2025-04-12 20:55:44');

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
(4, 'Premium Package', 'High-yield investment for premium clients', 7, 20.00, 50.00, 'High', '[\n    \"Real-time market analytics\",\n    \"Portfolio performance tracking\",\n    \"Risk assessment reports\",\n    \"24/7 Technical support\",\n    \"Custom trading alerts\",\n    \"Account balance monitoring\",\n    \"Transaction history analysis\"\n]', 1000.00, 100000.00, 1, '2025-02-10 05:37:46'),
(5, 'Gold Package', 'Balanced investment option for moderate risk takers', 28, 10.00, 15.00, 'Moderate', '[\"Monthly performance reports\", \"Risk assessment analysis\", \"Email support\"]', 500.00, 50000.00, 1, '2025-02-10 05:37:46'),
(6, 'Silver Package', 'Safe and steady growth with lower risk', 50, 5.00, 8.00, 'Low', '[\"Basic support\",\"Investment performance tracking\",\"Risk-free cancellation within 14 days\",\"24 Hours Support\"]', 200.00, 5000.00, 1, '2025-02-10 05:37:46');

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
(6, 2, 'investorhonour@gmail.com', '259189', '2025-02-10 22:54:16', 1, '2025-02-10 21:24:16'),
(8, 48, 'chelseadeseguirant630@gmail.com', '258452', '2025-04-13 01:53:01', 1, '2025-04-13 01:23:01');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trading_bots`
--

INSERT INTO `trading_bots` (`id`, `name`, `description`, `min_roi`, `max_roi`, `duration_days`, `price_amount`, `price_currency`, `status`, `created_at`) VALUES
(1, 'BTC Momentum Bot', 'Advanced momentum-based trading bot for Bitcoin. Uses multiple technical indicators to identify optimal entry and exit points.', 15.00, 400.00, 3, 50.00, 'BTC', 'active', '2025-02-11 03:42:58'),
(2, 'ETH Scalping Bot', 'High-frequency Ethereum trading bot designed for quick profits. Utilizes market inefficiencies for rapid trades.', 500.00, 750.00, 7, 100.00, 'ETH', 'active', '2025-02-11 03:42:58'),
(3, 'USDT Multi-Coin Bot', 'Diversified trading bot that trades top cryptocurrencies. Manages risk through portfolio diversification.', 20.00, 1000.00, 14, 1000.00, 'USDT', 'active', '2025-02-11 03:42:58');

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
(1, 2, 'deposit', 'BTC', 0.05000000, 0.00050000, 'completed', 'TXHASH001', 'BTCADDR001', 'BTCADDR002', 'Bitcoin deposit to wallet', '2025-01-15 11:00:00', '2025-01-15 11:00:00', NULL, NULL),
(2, 2, 'withdrawal', 'ETH', 2.00000000, 0.00500000, 'failed', 'TXHASH002', 'ETHADDR003', 'ETHADDR004', 'Failed Ethereum withdrawal', '2025-01-25 13:30:00', '2025-01-25 14:00:00', NULL, NULL),
(3, 2, 'transfer', 'USDT', 500.00000000, 1.00000000, 'completed', 'TXHASH003', 'USDTADDR01', 'USDTADDR02', 'USDT transfer between wallets', '2025-02-01 09:00:00', '2025-02-01 09:00:00', NULL, NULL),
(4, 2, 'trade', 'BNB', 1.25000000, 0.01000000, 'pending', 'TXHASH004', 'BNBADDR005', 'BNBADDR006', 'Binance Coin trade transaction', '2025-02-06 15:00:00', '2025-02-06 15:00:00', NULL, NULL),
(5, 2, 'p2p', 'DOGE', 10000.00000000, 10.00000000, 'cancelled', 'TXHASH005', 'DOGEADDR007', 'DOGEADDR008', 'Cancelled Dogecoin P2P transaction', '2025-01-20 08:45:00', '2025-01-20 09:00:00', NULL, NULL),
(6, 2, 'transfer', 'BTC', 12.00000000, 0.00050000, 'completed', NULL, NULL, 'xs', 'Sent 12 BTC to xs', '2025-02-09 16:26:49', '2025-02-09 16:26:49', NULL, NULL),
(7, 2, 'transfer', 'BTC', 1.00000000, 0.00050000, 'completed', NULL, NULL, 'honour', 'Sent 1 BTC to honour', '2025-02-09 16:59:20', '2025-02-09 16:59:20', NULL, NULL),
(8, 2, 'transfer', 'BTC', 10.00000000, 0.00050000, 'completed', NULL, NULL, 'as', 'Sent 10 BTC to as', '2025-02-09 17:01:13', '2025-02-09 17:01:13', NULL, NULL),
(9, 2, 'transfer', 'BTC', 0.00003109, 0.00050000, 'completed', NULL, NULL, 'asdasdsadasd', 'Sent 0.00003108617111171451 BTC to asdasdsadasd', '2025-02-09 17:03:45', '2025-02-09 17:03:45', NULL, NULL),
(10, 2, 'transfer', 'BTC', 0.00002072, 0.00050000, 'completed', NULL, NULL, 'adasdsadsad', 'Sent 0.00002072411407447634 BTC to adasdsadsad', '2025-02-09 17:04:06', '2025-02-09 17:04:06', NULL, NULL),
(11, 2, 'transfer', 'SOL', 0.04946142, 0.00050000, 'completed', NULL, NULL, 'asdasd', 'Sent 0.04946141627214272 SOL to asdasd', '2025-02-09 17:04:59', '2025-02-09 17:04:59', NULL, NULL),
(12, 2, 'transfer', 'BTC', 0.00126375, 0.00050000, 'completed', NULL, NULL, 'totalUsd', 'Sent 0.001263749228165333 BTC to totalUsd', '2025-02-09 17:05:23', '2025-02-09 17:05:23', NULL, NULL),
(13, 2, 'transfer', 'BTC', 0.00023817, 0.00050000, 'completed', NULL, NULL, 'asasd', 'Sent 0.00023816571280008313 BTC to asasd', '2025-02-09 17:06:57', '2025-02-09 17:06:57', NULL, NULL),
(14, 2, 'transfer', 'BTC', 101.00000000, 0.00050000, 'completed', NULL, NULL, 'honourfx', 'Sent 101.00 BTC to honourfx', '2025-02-09 17:07:29', '2025-02-09 17:07:29', NULL, NULL),
(15, 2, 'transfer', 'SOL', 11.00000000, 0.00050000, 'completed', NULL, NULL, 'honour', 'Sent 11.00 SOL to honour', '2025-02-09 17:07:46', '2025-02-09 17:07:46', NULL, NULL),
(16, 2, 'transfer', 'SOL', 102.00000000, 0.00050000, 'completed', NULL, NULL, 'sdfs', 'Sent 102.00 SOL to sdfs', '2025-02-09 17:08:42', '2025-02-09 17:08:42', NULL, NULL),
(17, 2, 'transfer', 'BTC', 965497788.77000000, 0.00050000, 'completed', NULL, NULL, 'a', 'Sent 965497788.77 BTC to a', '2025-02-09 17:11:13', '2025-02-09 17:11:13', NULL, NULL),
(18, 2, 'transfer', 'ADA', 235.00000000, 0.00050000, 'completed', NULL, NULL, 'honour', 'Sent 235.00 ADA to honour', '2025-02-09 17:13:06', '2025-02-09 17:13:06', NULL, NULL),
(19, 2, 'transfer', 'ADA', 14.94000000, 0.00050000, 'completed', NULL, NULL, 'assdasd', 'Sent 14.94 ADA to assdasd', '2025-02-09 17:13:44', '2025-02-09 17:13:44', NULL, NULL),
(20, 2, 'transfer', 'BTC', 13.00000000, 0.00050000, 'completed', NULL, NULL, 'btcaxs', 'Sent 13.00 BTC to btcaxs', '2025-02-09 17:16:31', '2025-02-09 17:16:31', NULL, NULL),
(22, 2, 'deposit', 'BTC', 0.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'BTC deposit to wallet', '2025-02-09 18:34:20', '2025-02-09 18:34:20', NULL, NULL),
(23, 2, 'deposit', 'BTC', 0.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'BTC deposit to wallet', '2025-02-09 18:38:59', '2025-02-09 18:38:59', NULL, NULL),
(24, 2, 'deposit', 'BTC', 0.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'BTC deposit to wallet', '2025-02-09 18:39:04', '2025-02-09 18:39:04', NULL, NULL),
(25, 2, 'deposit', 'BTC', 0.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'BTC deposit to wallet', '2025-02-09 18:40:03', '2025-02-09 18:40:03', NULL, NULL),
(28, 2, 'swap', 'BTC', -0.00012468, 0.00000455, 'completed', NULL, NULL, NULL, 'Swapped 0.00012468 BTC to 0.00454387 ETH (12 USD)', '2025-02-09 19:18:37', '2025-02-09 19:18:37', NULL, NULL),
(29, 2, 'swap', 'ETH', 0.00454387, 0.00000000, 'completed', NULL, NULL, NULL, 'Received 0.00454387 ETH from swap of 0.00012468 BTC (12 USD)', '2025-02-09 19:18:37', '2025-02-09 19:18:37', NULL, NULL),
(30, 2, 'swap', 'BTC', -0.00103949, 0.00003795, 'completed', NULL, NULL, NULL, 'Swapped 0.00103949 BTC to 0.03790712 ETH (100 USD)', '2025-02-09 19:22:26', '2025-02-09 19:22:26', NULL, NULL),
(31, 2, 'swap', 'ETH', 0.03790712, 0.00000000, 'completed', NULL, NULL, NULL, 'Received 0.03790712 ETH from swap of 0.00103949 BTC (100 USD)', '2025-02-09 19:22:26', '2025-02-09 19:22:26', NULL, NULL),
(32, 2, 'swap', 'ETH', -0.01898712, 0.04992958, 'completed', NULL, NULL, NULL, 'Swapped 0.01898712 ETH to 49.87965253 USDT (50 USD)', '2025-02-09 19:22:45', '2025-02-09 19:22:45', NULL, NULL),
(33, 2, 'swap', 'USDT', 49.87965253, 0.00000000, 'completed', NULL, NULL, NULL, 'Received 49.87965253 USDT from swap of 0.01898712 ETH (50 USD)', '2025-02-09 19:22:45', '2025-02-09 19:22:45', NULL, NULL),
(34, 2, 'swap', 'USDT', -29.95825439, 0.11968550, 'completed', NULL, NULL, NULL, 'Swapped 29.95825439 USDT to 119.56581448 DOGE (30 USD)', '2025-02-09 19:24:23', '2025-02-09 19:24:23', NULL, NULL),
(35, 2, 'swap', 'DOGE', 119.56581448, 0.00000000, 'completed', NULL, NULL, NULL, 'Received 119.56581448 DOGE from swap of 29.95825439 USDT (30 USD)', '2025-02-09 19:24:23', '2025-02-09 19:24:23', NULL, NULL),
(36, 2, 'swap', 'BTC', 150.00000000, 0.00005702, 'completed', NULL, NULL, NULL, 'Swapped 0.00156067 BTC to 0.05696674 ETH (150 USD)', '2025-02-09 19:27:07', '2025-02-09 19:27:07', NULL, NULL),
(37, 2, 'swap', 'USDT', 12.00000000, 0.01200000, 'completed', NULL, NULL, NULL, 'Swapped 11.98418370 USDT to 0.00455910 ETH (12 USD)', '2025-02-09 19:40:58', '2025-02-09 19:40:58', NULL, NULL),
(38, 2, 'p2p', 'BTC', 5.00000000, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 0.00005168146424022452 BTC to g5lf9', '2025-02-10 00:09:36', '2025-02-10 00:09:36', NULL, NULL),
(39, 3, 'p2p', 'BTC', 5.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 0.00005168146424022452 BTC from d74ez', '2025-02-10 00:09:36', '2025-02-10 00:09:36', NULL, NULL),
(40, 2, 'p2p', 'BTC', 80.00000000, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 0.0008254075225075128 BTC to g5lf9', '2025-02-10 00:11:39', '2025-02-10 00:11:39', NULL, NULL),
(41, 3, 'p2p', 'BTC', 80.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 0.0008254075225075128 BTC from d74ez', '2025-02-10 00:11:39', '2025-02-10 00:11:39', NULL, NULL),
(42, 2, 'p2p', 'BTC', 10.00000000, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 0.0001031759403134391 BTC to g5lf9', '2025-02-10 00:14:00', '2025-02-10 00:14:00', NULL, NULL),
(43, 3, 'p2p', 'BTC', 10.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 0.0001031759403134391 BTC from d74ez', '2025-02-10 00:14:00', '2025-02-10 00:14:00', NULL, NULL),
(44, 2, 'p2p', 'BTC', 969542.22985152, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 10 BTC to g5lf9', '2025-02-10 00:15:12', '2025-02-10 00:15:12', NULL, NULL),
(45, 3, 'p2p', 'BTC', 969542.22985152, 0.00000000, 'completed', NULL, '2', NULL, 'Received 10 BTC from d74ez', '2025-02-10 00:15:12', '2025-02-10 00:15:12', NULL, NULL),
(46, 2, 'p2p', 'BTC', 969583.65722537, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 10 BTC to g5lf9', '2025-02-10 00:17:21', '2025-02-10 00:17:21', NULL, NULL),
(47, 3, 'p2p', 'BTC', 969583.65722537, 0.00000000, 'completed', NULL, '2', NULL, 'Received 10 BTC from d74ez', '2025-02-10 00:17:21', '2025-02-10 00:17:21', NULL, NULL),
(48, 2, 'p2p', 'BTC', 10.00000000, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 0.00010309431195777874 BTC to g5lf9', '2025-02-10 00:20:39', '2025-02-10 00:20:39', NULL, NULL),
(49, 3, 'p2p', 'BTC', 10.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 0.00010309431195777874 BTC from d74ez', '2025-02-10 00:20:39', '2025-02-10 00:20:39', NULL, NULL),
(50, 2, 'p2p', 'DOGE', 12.00000000, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 12 DOGE to g5lf9', '2025-02-10 00:21:10', '2025-02-10 00:21:10', NULL, NULL),
(51, 3, 'p2p', 'DOGE', 12.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 12 DOGE from d74ez', '2025-02-10 00:21:10', '2025-02-10 00:21:10', NULL, NULL),
(52, 2, 'p2p', 'DOGE', 10.00000000, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 10 DOGE to g5lf9', '2025-02-10 00:21:32', '2025-02-10 00:21:32', NULL, NULL),
(53, 3, 'p2p', 'DOGE', 10.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 10 DOGE from d74ez', '2025-02-10 00:21:32', '2025-02-10 00:21:32', NULL, NULL),
(54, 2, 'p2p', 'ADA', 100.00000000, 0.00000000, 'completed', NULL, NULL, '3', 'Sent 144.58625292043007 ADA to g5lf9', '2025-02-10 00:25:01', '2025-02-10 00:25:01', NULL, NULL),
(55, 3, 'p2p', 'ADA', 100.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 144.58625292043007 ADA from d74ez', '2025-02-10 00:25:01', '2025-02-10 00:25:01', NULL, NULL),
(56, 2, 'transfer', 'BTC', 12.00000000, 0.00050000, 'completed', NULL, NULL, '2', 'Successfully invested null BTC (12 USD) in Premium Package', '2025-02-10 06:15:44', '2025-02-10 06:15:44', NULL, NULL),
(57, 2, 'transfer', 'BTC', 12.00000000, 0.00050000, 'completed', NULL, NULL, '2', 'Successfully invested null BTC (12 USD) in Premium Package', '2025-02-10 06:15:44', '2025-02-10 06:15:44', NULL, NULL),
(58, 2, 'transfer', 'ADA', 10.00000000, 0.00050000, 'completed', NULL, NULL, '3', 'Successfully invested null ADA (10 USD) in Premium Package', '2025-02-10 06:15:59', '2025-02-10 06:15:59', NULL, NULL),
(59, 2, 'transfer', 'ADA', 10.00000000, 0.00050000, 'completed', NULL, NULL, '3', 'Successfully invested null ADA (10 USD) in Premium Package', '2025-02-10 06:15:59', '2025-02-10 06:15:59', NULL, NULL),
(60, 2, 'transfer', 'DOGE', 10.00000000, 0.00050000, 'completed', NULL, NULL, '4', 'Successfully invested null DOGE (10 USD) in Premium Package', '2025-02-10 06:16:37', '2025-02-10 06:16:37', NULL, NULL),
(61, 2, 'transfer', 'DOGE', 10.00000000, 0.00050000, 'completed', NULL, NULL, '4', 'Successfully invested null DOGE (10 USD) in Premium Package', '2025-02-10 06:16:37', '2025-02-10 06:16:37', NULL, NULL),
(62, 2, 'transfer', 'SOL', 10.00000000, 0.00050000, 'completed', NULL, NULL, '5', 'Successfully invested null SOL (10 USD) in Premium Package', '2025-02-10 06:17:44', '2025-02-10 06:17:44', NULL, NULL),
(63, 2, 'transfer', 'SOL', 10.00000000, 0.00050000, 'completed', NULL, NULL, '5', 'Successfully invested null SOL (10 USD) in Premium Package', '2025-02-10 06:17:44', '2025-02-10 06:17:44', NULL, NULL),
(64, 2, 'transfer', 'BTC', 10.00000000, 0.00050000, 'completed', NULL, NULL, '6', 'Successfully invested 10 BTC (10 USD) in Premium Package', '2025-02-10 06:19:44', '2025-02-10 06:19:44', NULL, NULL),
(65, 2, 'transfer', 'BTC', 10.00000000, 0.00050000, 'completed', NULL, NULL, '6', 'Successfully invested 10 BTC (10 USD) in Premium Package', '2025-02-10 06:19:44', '2025-02-10 06:19:44', NULL, NULL),
(66, 2, 'transfer', 'BTC', 90.00000000, 0.00050000, 'completed', NULL, NULL, '7', 'Successfully invested 90 BTC (90 USD) in Premium Package', '2025-02-10 06:20:12', '2025-02-10 06:20:12', NULL, NULL),
(67, 2, 'transfer', 'BTC', 90.00000000, 0.00050000, 'completed', NULL, NULL, '7', 'Successfully invested 90 BTC (90 USD) in Premium Package', '2025-02-10 06:20:12', '2025-02-10 06:20:12', NULL, NULL),
(68, 2, 'investment', 'BTC', 50.00000000, 0.00050000, 'completed', NULL, NULL, '8', 'Successfully invested $ 50 in BTC into Premium Package', '2025-02-10 06:22:10', '2025-02-10 06:22:10', NULL, NULL),
(69, 2, 'transfer', 'BTC', 50.00000000, 0.00050000, 'completed', NULL, NULL, '8', 'Successfully invested 50 BTC (50 USD) in Premium Package', '2025-02-10 06:22:10', '2025-02-10 06:22:10', NULL, NULL),
(70, 2, 'investment', 'BTC', 10.00000000, 0.00050000, 'completed', NULL, NULL, '9', 'Successfully invested $ 10 in BTC into Premium Package', '2025-02-10 06:23:47', '2025-02-10 06:23:47', NULL, NULL),
(71, 2, 'transfer', 'BTC', 10.00000000, 0.00050000, 'completed', NULL, NULL, '9', 'Successfully invested 10 BTC (10 USD) in Premium Package', '2025-02-10 06:23:47', '2025-02-10 06:23:47', NULL, NULL),
(72, 2, 'investment', 'BTC', 111.00000000, 0.00050000, 'completed', NULL, NULL, '10', 'Successfully invested $ 111 in BTC into Premium Package', '2025-02-10 06:24:01', '2025-02-10 06:24:01', NULL, NULL),
(73, 2, 'transfer', 'BTC', 111.00000000, 0.00050000, 'completed', NULL, NULL, '10', 'Successfully invested 111 BTC (111 USD) in Premium Package', '2025-02-10 06:24:01', '2025-02-10 06:24:01', NULL, NULL),
(74, 2, 'investment', 'BTC', 12.00000000, 0.00050000, 'completed', NULL, NULL, '11', 'Successfully invested $ 12 in BTC into Premium Package', '2025-02-10 06:25:24', '2025-02-10 06:25:24', NULL, NULL),
(75, 2, 'transfer', 'BTC', 12.00000000, 0.00050000, 'completed', NULL, NULL, '11', 'Successfully invested 12 BTC (12 USD) in Premium Package', '2025-02-10 06:25:24', '2025-02-10 06:25:24', NULL, NULL),
(76, 2, 'investment', 'BTC', 12.00000000, 0.00050000, 'completed', NULL, NULL, '12', 'Successfully invested $ 12 in BTC into Premium Package', '2025-02-10 06:25:57', '2025-02-10 06:25:57', NULL, NULL),
(77, 2, 'transfer', 'BTC', 12.00000000, 0.00050000, 'completed', NULL, NULL, '12', 'Successfully invested 12 BTC (12 USD) in Premium Package', '2025-02-10 06:25:57', '2025-02-10 06:25:57', NULL, NULL),
(78, 2, 'investment', 'BTC', 23.00000000, 0.00050000, 'completed', NULL, NULL, '13', 'Successfully invested $ 23 in BTC into Premium Package', '2025-02-10 06:27:00', '2025-02-10 06:27:00', NULL, NULL),
(79, 2, 'transfer', 'BTC', 23.00000000, 0.00050000, 'completed', NULL, NULL, '13', 'Successfully invested 23 BTC (23 USD) in Premium Package', '2025-02-10 06:27:00', '2025-02-10 06:27:00', NULL, NULL),
(80, 2, 'investment', 'BTC', 15.00000000, 0.00050000, 'completed', NULL, NULL, '14', 'Successfully invested $ 15 in BTC into Premium Package', '2025-02-10 06:28:55', '2025-02-10 06:28:55', NULL, NULL),
(81, 2, 'transfer', 'BTC', 15.00000000, 0.00050000, 'completed', NULL, NULL, '14', 'Successfully invested 15 BTC (15 USD) in Premium Package', '2025-02-10 06:28:55', '2025-02-10 06:28:55', NULL, NULL),
(82, 2, 'investment', 'BTC', 20.00000000, 0.00050000, 'completed', NULL, NULL, '15', 'Successfully invested $ 20 in BTC into Premium Package', '2025-02-10 06:29:50', '2025-02-10 06:29:50', NULL, NULL),
(83, 2, 'transfer', 'BTC', 20.00000000, 0.00050000, 'completed', NULL, NULL, '15', 'Successfully invested 20 BTC (20 USD) in Premium Package', '2025-02-10 06:29:50', '2025-02-10 06:29:50', NULL, NULL),
(84, 2, 'investment', 'BTC', 50.00000000, 0.00050000, 'completed', NULL, NULL, '16', 'Successfully invested $ 50 in BTC into Premium Package', '2025-02-10 06:30:30', '2025-02-10 06:30:30', NULL, NULL),
(85, 2, 'transfer', 'BTC', 50.00000000, 0.00050000, 'completed', NULL, NULL, '16', 'Successfully invested 50 BTC (50 USD) in Premium Package', '2025-02-10 06:30:30', '2025-02-10 06:30:30', NULL, NULL),
(86, 2, 'investment', 'BTC', 50.00000000, 0.00050000, 'completed', NULL, NULL, '17', 'Successfully invested $ 50 in BTC into Premium Package', '2025-02-10 06:31:04', '2025-02-10 06:31:04', NULL, NULL),
(87, 2, 'transfer', 'BTC', 50.00000000, 0.00050000, 'completed', NULL, NULL, '17', 'Successfully invested 50 BTC (50 USD) in Premium Package', '2025-02-10 06:31:04', '2025-02-10 06:31:04', NULL, NULL),
(88, 2, 'investment', 'BTC', 200.00000000, 0.00050000, 'completed', NULL, NULL, '18', 'Successfully invested $ 200 in BTC into Premium Package', '2025-02-10 10:25:44', '2025-02-10 10:25:44', NULL, NULL),
(89, 2, 'transfer', 'BTC', 200.00000000, 0.00050000, 'completed', NULL, NULL, '18', 'Successfully invested 200 BTC (200 USD) in Premium Package', '2025-02-10 10:25:44', '2025-02-10 10:25:44', NULL, NULL),
(90, 2, 'investment', 'BTC', 2748.45913589, 0.00000000, 'completed', NULL, NULL, NULL, 'Profit claimed from undefined investment', '2025-02-10 11:07:46', '2025-02-10 11:07:46', NULL, NULL),
(91, 2, 'investment', 'BTC', 2748.45913589, 0.00000000, 'completed', NULL, NULL, NULL, 'Profit claimed from Premium Package investment', '2025-02-10 11:16:36', '2025-02-10 11:16:36', NULL, NULL),
(92, 2, 'p2p', 'ETH', 500.00000000, 0.00000000, 'completed', NULL, NULL, '6', 'Sent 0.18436369087190302 ETH to sbge4', '2025-02-11 08:31:27', '2025-02-11 08:31:27', NULL, NULL),
(93, 6, 'p2p', 'ETH', 500.00000000, 0.00000000, 'completed', NULL, '2', NULL, 'Received 0.18436369087190302 ETH from d74ez', '2025-02-11 08:31:27', '2025-02-11 08:31:27', NULL, NULL),
(94, 6, 'transfer', 'ETH', 51.00000000, 0.00050000, 'completed', NULL, NULL, 'Jskskeeooekemee', 'Sent $ 51.00 in ETH to Jskskeeooekemee', '2025-02-11 08:32:05', '2025-02-11 08:32:05', NULL, NULL),
(95, 6, 'investment', 'ETH', 50.00000000, 0.00050000, 'completed', NULL, NULL, '19', 'Successfully invested $ 50 in ETH into Premium Package', '2025-02-11 08:32:29', '2025-02-11 08:32:29', NULL, NULL),
(96, 6, 'transfer', 'ETH', 50.00000000, 0.00050000, 'completed', NULL, NULL, '19', 'Successfully invested 50 ETH (50 USD) in Premium Package', '2025-02-11 08:32:29', '2025-02-11 08:32:29', NULL, NULL),
(97, 6, 'swap', 'ETH', 50.00000000, 0.05000000, 'completed', NULL, NULL, NULL, 'Swapped 0.01841788 ETH to 49.97164634 USDT (50 USD)', '2025-02-11 08:38:41', '2025-02-11 22:54:27', NULL, NULL),
(98, 2, 'swap', 'BTC', 5000.00000000, 5.00000000, 'completed', NULL, NULL, NULL, 'Swapped 0.05171824 BTC to 1.87958033 ETH (5000 USD)', '2025-02-12 19:12:43', '2025-02-12 19:12:43', NULL, NULL),
(99, 3, 'investment', 'BTC', 10.00000000, 0.00050000, 'completed', NULL, NULL, '20', 'Successfully invested $ 10 in BTC into Premium Package', '2025-02-17 00:08:02', '2025-02-17 00:08:02', NULL, NULL),
(100, 3, 'transfer', 'BTC', 10.00000000, 0.00050000, 'completed', NULL, NULL, '20', 'Successfully invested 10 BTC (10 USD) in Premium Package', '2025-02-17 00:08:02', '2025-02-17 00:08:02', NULL, NULL),
(101, 3, 'swap', 'BTC', 1.00000000, 0.00100000, 'completed', NULL, NULL, NULL, 'Swapped 0.00001041 BTC to 0.00037256 ETH (1 USD)', '2025-02-17 08:02:22', '2025-02-17 08:02:22', NULL, NULL),
(102, 3, 'swap', 'DOGE', 14.00000000, 0.01400000, 'completed', NULL, NULL, NULL, 'Swapped 14.00000000 DOGE to 0.00522134 ETH (14 USD)', '2025-02-17 08:06:19', '2025-02-17 08:06:19', NULL, NULL),
(103, 3, 'swap', 'DOGE', 50.00000000, 0.05000000, 'completed', NULL, NULL, NULL, 'Swapped 50.00000000 DOGE to 49.95000000 ETH (50 USD)', '2025-02-17 08:07:30', '2025-02-17 08:07:30', NULL, NULL),
(104, 3, 'swap', 'DOGE', 8000.00000000, 8.00000000, 'completed', NULL, NULL, NULL, 'Swapped 8000.00000000 DOGE to 7992.00000000 ETH (8000 USD)', '2025-02-17 08:07:54', '2025-02-17 08:07:54', NULL, NULL),
(105, 2, 'transfer', 'BTC', 51.00000000, 0.00050000, 'pending', NULL, NULL, 'gohnour', 'Sent $ 51.00 in BTC to gohnour', '2025-02-21 09:38:09', '2025-02-21 09:38:09', NULL, NULL),
(106, 2, 'transfer', 'BTC', 501.00000000, 0.00050000, 'pending', NULL, NULL, 'sfdfs', 'Sent $ 501.00 in BTC to sfdfs', '2025-02-21 09:38:26', '2025-02-21 09:38:26', NULL, NULL),
(107, 2, 'transfer', 'BTC', 501.00000000, 0.00050000, 'pending', NULL, NULL, 'dsfsdfsfsd', 'Sent $ 501.00 in BTC to dsfsdfsfsd', '2025-02-21 09:45:12', '2025-02-21 09:45:12', NULL, NULL),
(108, 2, 'transfer', 'BTC', 501.00000000, 0.00050000, 'pending', NULL, NULL, 'sdfsdfsf', 'Sent $ 501.00 in BTC to sdfsdfsf', '2025-02-21 09:45:36', '2025-02-21 09:45:36', NULL, NULL),
(109, 2, 'transfer', 'BTC', 501.00000000, 0.00050000, 'pending', NULL, NULL, 'honours', 'Sent $ 501.00 in BTC to honours', '2025-02-21 09:51:04', '2025-02-21 09:51:04', NULL, NULL),
(110, 2, 'transfer', 'BTC', 501.00000000, 0.00050000, 'pending', NULL, NULL, 's', 'Sent $ 501.00 in BTC to s', '2025-02-21 09:52:47', '2025-02-21 09:52:47', NULL, NULL),
(111, 3, 'deposit', 'BTC', 0.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhhono', 'BTC deposit to wallet', '2025-02-21 10:03:51', '2025-02-21 10:03:51', NULL, NULL),
(112, 3, 'deposit', 'BTC', 500.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhhono', 'BTC deposit to wallet', '2025-02-21 10:06:38', '2025-02-21 10:06:38', NULL, NULL),
(113, 3, 'deposit', 'BTC', 1200.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhhono', 'BTC deposit to wallet', '2025-02-21 10:06:59', '2025-03-26 00:04:18', NULL, NULL),
(114, 3, 'transfer', 'BTC', 501.00000000, 0.00050000, 'completed', NULL, NULL, 'sdfsdf', 'Sent $ 501.00 in BTC to sdfsdf', '2025-02-21 10:21:08', '2025-03-22 08:17:58', NULL, NULL),
(115, 3, 'transfer', 'BTC', 45.00000000, 0.00050000, 'completed', NULL, NULL, 'dfsdf', 'Sent $ 45.00 in BTC to dfsdf', '2025-02-21 10:21:38', '2025-03-22 08:14:10', NULL, NULL),
(116, 2, 'investment', 'BTC', 100.00000000, 0.00050000, 'completed', NULL, NULL, '29', 'Successfully invested $ 100 in BTC into Premium Package', '2025-02-26 09:21:07', '2025-02-26 09:21:07', NULL, NULL),
(117, 2, 'transfer', 'BTC', 100.00000000, 0.00050000, 'completed', NULL, NULL, '29', 'Successfully invested 100 BTC (100 USD) in Premium Package', '2025-02-26 09:21:07', '2025-02-26 09:21:07', NULL, NULL),
(118, 2, 'investment', 'BTC', 2748.45913589, 0.00000000, 'completed', NULL, NULL, NULL, 'Profit claimed from Premium Package investment', '2025-02-26 21:14:31', '2025-02-26 21:14:31', NULL, NULL),
(119, 2, 'deposit', 'USDT', 800.00000000, 0.00000000, 'pending', NULL, NULL, 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', 'USDT deposit to wallet', '2025-02-26 21:16:50', '2025-02-26 21:16:50', NULL, NULL),
(120, 2, 'investment', 'BTC', 6776.00000000, 0.00050000, 'completed', NULL, NULL, '30', 'Successfully invested $ 6776 in BTC into Gold Package', '2025-02-26 21:17:47', '2025-02-26 21:17:47', NULL, NULL),
(121, 2, 'transfer', 'BTC', 6776.00000000, 0.00050000, 'completed', NULL, NULL, '30', 'Successfully invested 6776 BTC (6776 USD) in Gold Package', '2025-02-26 21:17:47', '2025-02-26 21:17:47', NULL, NULL),
(122, 2, 'trade', 'tether', 0.99974000, 0.00000000, 'completed', NULL, NULL, NULL, 'Buy Order Executed', '2025-03-07 19:17:24', '2025-03-07 19:17:24', NULL, NULL),
(123, 2, 'trade', 'tether', -22.99402000, 0.00000000, 'completed', NULL, NULL, NULL, 'Sell Order Executed', '2025-03-07 19:17:45', '2025-03-07 19:17:45', NULL, NULL),
(124, 3, 'investment', 'BTC', 140.04726482, 0.00000000, 'completed', NULL, NULL, NULL, 'Profit claimed from Premium Package investment', '2025-03-10 15:21:15', '2025-03-10 15:21:15', NULL, NULL),
(126, 2, 'transfer', 'BTC', 2.00000000, 0.00050000, 'completed', NULL, NULL, 'Bank Name: Opay, Routing Number: 2002, Account Number: 9163169949, Account Name: Robinson Honour, Swift Code: 90393', 'Sent $ 2.00 in BTC to Bank Name: Opay, Routing Number: 2002, Account Number: 9163169949, Account Name: Robinson Honour, Swift Code: 90393', '2025-03-22 05:20:29', '2025-03-22 05:34:33', NULL, NULL),
(127, 2, 'transfer', 'BTC', 2.00000000, 0.00050000, 'cancelled', NULL, NULL, 'Bank Name: Opay, Routing Number: 2002, Account Number: 9163169949, Account Name: Robinson Honour, Swift Code: 90393', 'Sent $ 2.00 in BTC to Bank Name: Opay, Routing Number: 2002, Account Number: 9163169949, Account Name: Robinson Honour, Swift Code: 90393', '2025-03-22 05:21:16', '2025-03-22 05:31:49', NULL, NULL),
(128, 2, 'deposit', 'BTC', 5000.00000000, 0.00000000, 'pending', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhhono', 'BTC deposit to wallet', '2025-03-25 15:37:37', '2025-03-27 07:37:40', NULL, NULL),
(129, 2, 'deposit', 'BNB', 100.00000000, 0.00000000, 'completed', NULL, NULL, 'bnb1csgevcg3cq3f20zxpgwxxk3lp9uyl4eq2vnqmq', 'BNB deposit to wallet', '2025-03-25 17:51:11', '2025-03-27 07:37:29', NULL, NULL),
(130, 2, 'deposit', 'BTC', 50.00000000, 0.00000000, 'completed', NULL, NULL, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhhono', 'BTC deposit to wallet', '2025-03-25 17:54:13', '2025-03-25 19:17:58', NULL, NULL),
(131, 2, 'withdrawal', 'BTC', 505.00000000, 0.00050000, 'pending', NULL, NULL, 'Providus - RObinson Honour', 'Bank Transfer - Providus - Acc: 091631683', '2025-03-25 19:07:21', '2025-03-25 19:07:21', NULL, NULL),
(132, 2, 'withdrawal', 'BTC', 50.50000000, 0.00050000, 'pending', NULL, NULL, 'investorhonour@gmail.com', 'PayPal Transfer to investorhonour@gmail.com', '2025-03-25 19:07:55', '2025-03-25 19:07:55', NULL, NULL),
(135, 2, 'bonus', 'btc', 500.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-03-25 19:39:42', '2025-03-25 19:39:42', NULL, NULL),
(136, 2, 'transfer', 'USDT', 101.00000000, 0.00050000, 'pending', NULL, NULL, 'fgobfusofknsdf', 'Crypto Transfer to fgobfusofknsdf', '2025-03-25 19:48:21', '2025-03-25 19:48:21', NULL, NULL),
(137, 3, 'bonus', 'btc', 10000.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-03-25 19:54:31', '2025-03-25 19:54:31', NULL, NULL),
(138, 2, 'investment', 'BTC', 1410.79478110, 0.00000000, 'completed', NULL, NULL, NULL, 'Profit claimed from Premium Package investment', '2025-03-25 21:58:05', '2025-03-25 21:58:05', NULL, NULL),
(139, 2, 'transfer', 'BTC', 1010.00000000, 0.00050000, 'pending', NULL, NULL, 'bta291nsaodia380qjadad', 'Crypto Transfer to bta291nsaodia380qjadad', '2025-03-25 21:59:18', '2025-03-25 21:59:18', NULL, NULL),
(140, 40, 'bonus', 'btc', 200.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-03-25 22:45:11', '2025-03-25 22:45:11', NULL, NULL),
(141, 40, 'bonus', 'btc', 0.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-03-25 22:45:11', '2025-03-25 22:45:11', NULL, NULL),
(142, 41, 'bonus', 'btc', 200.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-03-31 15:24:58', '2025-03-31 15:24:58', NULL, NULL),
(143, 42, 'bonus', 'btc', 200.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-07 18:07:16', '2025-04-07 18:07:16', NULL, NULL),
(144, 46, 'bonus', 'btc', 200.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-10 04:53:20', '2025-04-10 04:53:20', NULL, NULL),
(145, 48, 'bonus', 'btc', 200.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-11 20:21:07', '2025-04-11 20:21:07', NULL, NULL),
(146, 48, 'bonus', 'btc', 200.00000000, 0.00000000, 'completed', NULL, NULL, NULL, 'Admin Bonus', '2025-04-11 20:21:08', '2025-04-11 20:21:08', NULL, NULL),
(147, 40, 'deposit', 'BTC', 200.00000000, 0.00000000, 'completed', NULL, NULL, '14KbLfn31io1ThtGsYTnfjuq6RJregqb4J', 'BTC deposit to wallet', '2025-04-11 21:25:37', '2025-04-11 21:26:41', NULL, NULL),
(148, 49, 'deposit', 'BTC', 5000.00000000, 0.00000000, 'pending', NULL, NULL, '14KbLfn31io1ThtGsYTnfjuq6RJregqb4J', 'BTC deposit to wallet', '2025-04-12 10:54:55', '2025-04-12 10:54:55', NULL, NULL);

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
(2, 'investorhonour@gmail.com', '$2a$10$UW7e512K1sFfFDBAe/nK8.jp8PNUqflHqTFJqePHuBAJ0XFXVb4NO', 'd74ez', 'Carl', 'Honour', '9163169949', 'United Kingdom', 'active', 'verified', 0, '2025-04-12 10:26:54', '102.90.82.216', 658.36, 33.00, 117081.15, 0.00, 0.00, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 900.00, 0.00, 0.00, '2025-02-09 04:24:14', '2025-04-12 10:26:54', NULL, 0, 'active', NULL),
(3, 'iamvictor2nice@gmail.com', '$2a$10$UW7e512K1sFfFDBAe/nK8.jp8PNUqflHqTFJqePHuBAJ0XFXVb4NO', 'g5lf9', 'Honour', 'Robbie', '', '', 'active', 'pending', 0, '2025-04-12 10:46:58', '102.90.79.72', 595.05, 22.00, 10000.00, 0.00, 0.00, 50.00, 950.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-02-10 00:01:57', '2025-04-12 10:46:58', NULL, 1, 'active', NULL),
(40, 'victorodogu5@gmail.com', '$2a$10$RwSYzmcb9tS1zSqN8FVCvuN67dh0/m8ZN4gRTq0EOGJcan.RsSRQG', 'akvqe', 'Jodie ', 'Sweetin', '08160580299', 'Nigeria', 'active', 'none', 0, '2025-04-12 04:16:46', '102.90.82.138', 5400.00, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-03-25 22:16:45', '2025-04-12 04:16:46', NULL, 0, 'active', NULL),
(41, 'maureli98@yahoo.com', '$2a$10$/dTf2wfOSz58KT.7ULFPaeIsm5c/xBqCQ0LacgdrlmuEPbyRdYMdC', 'o7rkj', 'Michael', 'Aureli', '5862229782', 'United States', 'active', 'none', 0, '2025-03-31 15:24:58', '76.139.155.49', 0.00, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-03-31 15:16:47', '2025-03-31 15:24:58', NULL, 0, 'active', NULL),
(42, 'yhbkscieew@cmhvzylmfc.com', '$2a$10$Y36J7PRTW4dfeFlBbJEFPeUzE1AeDyITgKPplMhhBlGg5S0s1xmbu', 'm11cv', 'SAMEER', 'VFBGBG', '09898787656', 'India', 'active', 'none', 0, '2025-04-07 18:07:16', '223.185.26.192', 0.00, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-07 10:30:15', '2025-04-07 18:07:16', NULL, 0, 'active', NULL),
(44, 'birdiequeen22@gmail.com', '$2a$10$K7g1ThAoE4klgtvOADPlnu8XmS5ZubKP9bFTicT96756SuvQL1K/6', 'cey2a', 'Grace ', 'Charis ', '0916898941', 'United States', 'active', 'none', 0, '2025-04-08 19:57:35', '102.90.82.135', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-08 19:57:04', '2025-04-08 19:57:35', NULL, 0, 'active', NULL),
(45, 'ah0522575@gmail.com', '$2a$10$lFvopcxnFuRt76Ywami0cescX3GAzoHMoTPBKT27lQhgZ.IvBKhQq', 'zvv56', 'Ahmed ', 'Hassan ', '09032230211', 'Russian Federation', 'active', 'none', 0, '2025-04-09 00:51:04', '102.90.81.7', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-09 00:42:51', '2025-04-09 00:51:04', NULL, 0, 'active', NULL),
(46, 'rogergarciahernandez2@gmail.com', '$2a$10$QlNXqtMisoiXnax1mmlgpuR98lFfELMpcJimEavHN41AaOy682HBW', '0pxox', 'Yudileidis ', 'Martines Suarez ', '50241901', 'Cuba', 'active', 'none', 0, '2025-04-10 04:53:20', '152.206.186.218', 0.00, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-09 20:21:01', '2025-04-10 04:53:20', NULL, 0, 'pending', '762865'),
(47, 'abrahamkolawole222@gmail.com', '$2a$10$Y2CL8zDNSr3sEL0/pLkhjuTm2XZtzmK6G6VDMYUbA3rSLZqFLyFM.', 'haqwt', 'Edwin', 'Rich ', '09135868248', 'Nigeria', 'active', 'none', 0, '2025-04-10 17:31:35', '102.89.44.53', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-10 17:31:10', '2025-04-10 17:31:35', NULL, 0, 'active', NULL),
(48, 'chelseadeseguirant630@gmail.com', '$2a$10$ycWeIQ8PoppWaGXO39rmneyFZIGC2g4IR6gkAjDCEK5Vj8yUee3wi', 'j5dfb', 'Chelsea ', 'DeSeguirant ', '3608541739', 'United States', 'active', 'none', 0, '2025-04-13 01:25:10', '172.56.105.154', 0.00, 0.00, 400.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-11 19:56:49', '2025-04-13 01:25:10', NULL, 0, 'active', NULL),
(49, 'precious.temple@icloud.com', '$2a$10$xJjspjjFUHsb1BLpIcECzOVrMglH4vNnUIqoPXn4k6JbjMjewPsfi', 'qs6b8', 'Temple', 'Precious', '0813247116', 'Nigeria', 'active', 'none', 0, '2025-04-11 21:41:02', '102.90.101.117', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-11 21:40:18', '2025-04-11 21:41:02', NULL, 0, 'active', NULL),
(50, 'Hamdanmaltiti@gmail.com', '$2a$10$1P915ptrz5M8TjlH0GbRC.qOFfXwkBCXYnPctmRPFuDlOlzAq87D2', 'a2r30', 'Hamdan', 'Maltiti', '0551236246', 'Ghana', 'active', 'none', 0, '2025-04-12 20:57:50', '154.161.167.239', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-04-12 20:55:44', '2025-04-12 20:57:50', NULL, 0, 'active', NULL);

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
(30, 2, 5, 6776.00, 'BTC', '2025-02-26 22:17:47', '2025-03-26 22:17:47', '[5.01,4.6,5.32,4.57,3.98,5.05,3.82,4.6,5.19,4.46,5.12,5.19,3.58,4.91,4.68,4.01,4.4,5.16,5.03,4.11,4.51,3.9,3.6,5.35,5.29,4.41,4.1,3.83]', 1, 'active');

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
(26, 3, 2, 200.00, 'BTC', '2025-03-15 06:32:16', '2025-03-22 06:32:16', 'active', 'https://swissindextrade.pro/server/uploads/67d51ef0518df_1742020336.gz', 0.00);

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
(1, 1, 'BTC', '14KbLfn31io1ThtGsYTnfjuq6RJregqb4J', 'Bitcoin Wallet', 0, '2025-02-09 17:29:52'),
(2, 1, 'ETH', '0x06bd3c254981b213af25e848bd9cbcee437f91a3', 'Ethereum Wallet', 0, '2025-02-09 17:29:52'),
(3, 1, 'USDT', 'TF5CCnBAZfj7d6Mw4EBLpqy6YJGwftXAbs', 'USDT Wallet', 1, '2025-02-09 17:29:52'),
(4, 1, 'BNB', '0x06bd3c254981b213af25e848bd9cbcee437f91a3', 'BNB Wallet', 0, '2025-02-09 17:29:52'),
(5, 1, 'XRP', 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh', 'XRP Wallet', 0, '2025-02-09 17:29:52'),
(6, 1, 'ADA', 'addr1q9w5dpp4x0q5gw4h3j4a9n2tjthq08kx2x2kdqdwmjd02zz6slkjf', 'Cardano Wallet', 0, '2025-02-09 17:29:52'),
(7, 1, 'DOGE', 'DQXzogkjJABFHu5YJhbF9bzRjWSEHHhk57', 'Dogecoin Wallet', 0, '2025-02-09 17:29:52'),
(8, 1, 'SOL', 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH', 'Solana Wallet', 0, '2025-02-09 17:29:52'),
(9, 1, 'DOT', '15f6sh9cyuk4jwmeUy6dqR4ucwnn25Y8cVvxudcyk68QYVD4', 'Polkadot Wallet', 0, '2025-02-09 17:29:52'),
(10, 1, 'MATIC', '0x272c14Ac9F3dAE8FA8a0F9648305D398E6E68BcD', 'Polygon Wallet', 0, '2025-02-09 17:29:52'),
(11, 1, 'LINK', '0xa709DBB1418bC9f28Dc9A5A99550D7821A2d3D47', 'ChainLink Wallet', 0, '2025-02-09 17:29:52'),
(12, 1, 'UNI', '0xB16Cf27FFafcF89E82e8d14bc71C14475e86C76f', 'Uniswap Wallet', 0, '2025-02-09 17:29:52'),
(13, 1, 'AVAX', 'X-avax1w0dvx3nqe69xtggldseufzhkfz2w89v8l2ht5k', 'Avalanche Wallet', 0, '2025-02-09 17:29:52'),
(14, 1, 'LTC', 'ltc1qhpm8n8t9hwcnyj9m3eksl2mucyw9cspjhfw3uq', 'Litecoin Wallet', 0, '2025-02-09 17:29:52'),
(15, 1, 'SHIB', '0x1ecb2D3C56a65996c30E9Df0d3dd0CfA1c9d3907', 'Shiba Inu Wallet', 0, '2025-02-09 17:29:52');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `account_notices`
--
ALTER TABLE `account_notices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `user_investments`
--
ALTER TABLE `user_investments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user_trading_sessions`
--
ALTER TABLE `user_trading_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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
