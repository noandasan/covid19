-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2020 at 03:40 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `covid19`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblcontrolassignments`
--

CREATE TABLE `tblcontrolassignments` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `control_id` int(11) NOT NULL,
  `status` int(1) DEFAULT 0,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblcontrolassignments`
--

INSERT INTO `tblcontrolassignments` (`id`, `role_id`, `module_id`, `control_id`, `status`, `created`) VALUES
(51, 1, 5, 2, 0, '2020-02-22 17:13:51'),
(52, 1, 5, 3, 0, '2020-02-22 17:13:51'),
(53, 1, 5, 4, 0, '2020-02-22 17:13:51'),
(54, 1, 5, 5, 0, '2020-02-22 17:13:51'),
(55, 1, 3, 7, 0, '2020-02-22 17:13:51');

-- --------------------------------------------------------

--
-- Table structure for table `tblcontrols`
--

CREATE TABLE `tblcontrols` (
  `control_id` int(11) NOT NULL,
  `controlname` varchar(50) NOT NULL,
  `module_id` int(11) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblcontrols`
--

INSERT INTO `tblcontrols` (`control_id`, `controlname`, `module_id`, `created`) VALUES
(2, 'New', 5, '2020-02-07 02:00:00'),
(3, 'Edit', 5, '2020-02-07 02:00:00'),
(4, 'Search', 5, '2020-02-07 02:00:00'),
(5, 'Delete', 5, '2020-02-07 02:00:00'),
(7, 'New', 3, '2020-02-07 02:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblcountries`
--

CREATE TABLE `tblcountries` (
  `country_id` int(11) NOT NULL,
  `country` varchar(255) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblcountries`
--

INSERT INTO `tblcountries` (`country_id`, `country`, `created`) VALUES
(1, 'Lebanon', '2020-03-10 04:49:12'),
(2, 'Philipines', '2020-03-10 04:49:48'),
(3, 'Egypt', '2020-03-10 04:50:31'),
(4, 'Sirya', '2020-03-10 05:11:08'),
(5, 'Brunei', '2020-03-10 05:11:49'),
(6, 'Bangladesh', '2020-03-10 05:12:27'),
(7, 'China', '2020-03-10 05:17:24'),
(8, 'Srilanka', '2020-03-10 05:19:01'),
(9, 'Nepal', '2020-03-10 05:19:05'),
(10, 'India', '2020-03-10 07:48:41'),
(11, 'Saudi Arabia', '2020-03-10 08:07:37'),
(12, 'Pakistan', '2020-03-18 19:48:17');

-- --------------------------------------------------------

--
-- Table structure for table `tbllocations`
--

CREATE TABLE `tbllocations` (
  `location_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbllocations`
--

INSERT INTO `tbllocations` (`location_id`, `location`, `latitude`, `longitude`, `created`) VALUES
(10, 'Khobar', '26.1870700', '50.1075310', '2020-03-17 12:47:35'),
(11, 'Al Jubail', '26.9716430', '49.5769590', '2020-03-17 13:01:10'),
(18, 'Boriydah', '25.9375670', '45.7333440', '2020-03-17 13:11:05'),
(22, 'Jeddah', '21.5003080', '39.1972120', '2020-03-20 16:29:25'),
(23, 'Tabuk', '28.3862090', '36.5631710', '2020-03-20 16:34:38'),
(24, 'Hail', '27.7712280', '41.7405620', '2020-03-20 17:41:01'),
(25, 'Taif', '21.2724939', '40.4247260', '2020-03-20 19:50:06'),
(26, 'Hufuf', '25.3673674', '49.5873236', '2020-03-20 19:53:37');

-- --------------------------------------------------------

--
-- Table structure for table `tblmodules`
--

CREATE TABLE `tblmodules` (
  `module_id` int(11) NOT NULL,
  `modulename` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `parent` int(10) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `position` int(5) NOT NULL,
  `assignable` int(1) NOT NULL DEFAULT 0,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblmodules`
--

INSERT INTO `tblmodules` (`module_id`, `modulename`, `path`, `parent`, `icon`, `position`, `assignable`, `created`) VALUES
(1, 'Administrator', '', 0, 'fas fa-users-cog', 2, 1, '2019-12-28 00:00:00'),
(2, 'Master Record', '', 0, 'far fa-list-alt', 3, 0, '2019-12-28 00:00:00'),
(3, 'Users', '/admin/members', 1, 'fas fa-user-friends', 0, 0, '2020-01-15 00:00:00'),
(4, 'Countries', '/master/countries', 2, 'fas fa-globe-europe', 1, 0, '2020-01-15 00:00:00'),
(5, 'Roles', '/admin/roles', 1, 'fas fa-user-tag', 0, 0, '2020-01-15 00:00:00'),
(7, 'Dashboard', '/dashboard', 0, 'fas fa-columns', 1, 0, '0000-00-00 00:00:00'),
(8, 'Profile', '/profile', 1000, '', 1000, 0, '2020-01-10 00:00:00'),
(9, 'Locations', '/master/locations', 2, 'fas fa-map-marker-alt', 2, 0, '2020-01-15 00:00:00'),
(10, 'Persons', '/master/persons', 2, 'fas fa-map-marker-alt', 3, 0, '2020-01-15 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblpersons`
--

CREATE TABLE `tblpersons` (
  `person_id` varchar(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `age` int(3) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblpersons`
--

INSERT INTO `tblpersons` (`person_id`, `name`, `location_id`, `country_id`, `status`, `age`, `created`) VALUES
('11', '222', 11, 7, 'Confirmed Case', 3, '2020-03-20 13:56:35'),
('113', '222', 11, 7, 'Confirmed Case', 3, '2020-03-20 13:56:44'),
('1133', '222', 11, 7, 'Confirmed Case', 3, '2020-03-20 13:56:50'),
('11333', '222', 18, 7, 'Confirmed Case', 3, '2020-03-20 13:57:00'),
('22', '222', 11, 7, 'Confirmed Case', 3, '2020-03-20 15:41:38'),
('222', '222', 11, 7, 'Confirmed Case', 3, '2020-03-20 15:41:44'),
('2223', '222', 10, 7, 'Fatal Case', 3, '2020-03-20 15:41:49'),
('3344', 'fdsfsd', 22, 6, 'Confirmed Case', 11, '2020-03-20 16:29:55'),
('5', '3232', 23, 3, 'Fatal Case', 22, '2020-03-20 16:35:07'),
('508', 'jhkjhkj', 24, 3, 'Confirmed Case', 99, '2020-03-20 17:41:51'),
('55', 'Donato Cabral', 11, 2, 'Recovered Case', 6, '2020-03-18 19:13:23'),
('66336', 'fdsfsd', 22, 6, 'Confirmed Case', 11, '2020-03-20 16:30:46'),
('66336333', 'fdsfsd', 22, 6, 'Confirmed Case', 11, '2020-03-20 16:30:51'),
('6666', 'fdsfsd', 22, 6, 'Confirmed Case', 11, '2020-03-20 16:30:43'),
('6777', '3232', 23, 3, 'Fatal Case', 22, '2020-03-20 16:35:00'),
('765', 'jhkjhkj', 24, 3, 'Confirmed Case', 99, '2020-03-20 17:41:43'),
('7776', '3232', 23, 3, 'Fatal Case', 22, '2020-03-20 16:34:55'),
('87686', 'fdsfsd', 22, 12, 'Confirmed Case', 11, '2020-03-20 16:29:46'),
('8909', 'jhkjhkj', 24, 3, 'Confirmed Case', 99, '2020-03-20 17:41:28'),
('8909889', 'jhkjhkj', 24, 3, 'Confirmed Case', 99, '2020-03-20 17:41:37'),
('987765443', 'Bansyong', 26, 10, 'Confirmed Case', 56, '2020-03-20 19:54:21');

-- --------------------------------------------------------

--
-- Table structure for table `tblroleassignments`
--

CREATE TABLE `tblroleassignments` (
  `id` int(20) NOT NULL,
  `role_id` int(20) NOT NULL,
  `module_id` int(20) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblroleassignments`
--

INSERT INTO `tblroleassignments` (`id`, `role_id`, `module_id`, `created`) VALUES
(1, 1, 1, '2019-12-01 00:00:00'),
(2, 1, 2, '2019-12-01 00:00:00'),
(4, 1, 3, '2020-01-01 00:00:00'),
(5, 1, 4, '2020-01-01 00:00:00'),
(6, 1, 5, '2020-01-01 00:00:00'),
(7, 1, 7, '2020-01-07 00:00:00'),
(8, 1, 8, '2020-01-10 00:00:00'),
(18, 1, 9, '2020-01-01 00:00:00'),
(19, 1, 10, '2020-01-01 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblroles`
--

CREATE TABLE `tblroles` (
  `role_id` int(11) NOT NULL,
  `rolename` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblroles`
--

INSERT INTO `tblroles` (`role_id`, `rolename`, `status`, `created`) VALUES
(1, 'nexson', 1, '2019-12-01 00:00:00'),
(225, 'Roselily', 1, '2020-02-22 19:09:58'),
(226, 'mercy', 1, '2020-02-23 19:29:57');

-- --------------------------------------------------------

--
-- Table structure for table `tblusers`
--

CREATE TABLE `tblusers` (
  `id` int(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `profile` varchar(255) NOT NULL,
  `created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblusers`
--

INSERT INTO `tblusers` (`id`, `name`, `email`, `password`, `role_id`, `status`, `profile`, `created`) VALUES
(13, 'nexson', 'n_oandasan@yahoo.com', '$2a$10$/aRDOQ5Fctxuc8DJkTfFY.tIhTTV1UZ0rX3CJW5kPAvgUYkFDiEdK', 1, 1, '', '2019-12-28'),
(103, 'Roselily', 'n_oandasan1@yahoo.com', '$2a$10$f956RixgmgmBSVEmMJqLPePRE1vyHveQeR8UmS0NF3LWiwl05/1Xy', 225, 1, '103-1583750555852.jpg', '2020-03-09'),
(104, 'fds111', 'rere@gmail.com', '$2a$10$AYdFKSfMIQJcaylFbrkpOOyYDDu194Ksf4I7em34LSd0LEd0egU3a', 225, 1, '104-1583750685059.jpg', '2020-03-09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblcontrolassignments`
--
ALTER TABLE `tblcontrolassignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `control_id` (`control_id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `tblcontrols`
--
ALTER TABLE `tblcontrols`
  ADD PRIMARY KEY (`control_id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `control_id` (`control_id`);

--
-- Indexes for table `tblcountries`
--
ALTER TABLE `tblcountries`
  ADD PRIMARY KEY (`country_id`),
  ADD KEY `id` (`country_id`);

--
-- Indexes for table `tbllocations`
--
ALTER TABLE `tbllocations`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `tblmodules`
--
ALTER TABLE `tblmodules`
  ADD PRIMARY KEY (`module_id`),
  ADD KEY `id` (`module_id`);

--
-- Indexes for table `tblpersons`
--
ALTER TABLE `tblpersons`
  ADD PRIMARY KEY (`person_id`),
  ADD KEY `infected_id` (`person_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `tblroleassignments`
--
ALTER TABLE `tblroleassignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `tblroles`
--
ALTER TABLE `tblroles`
  ADD PRIMARY KEY (`role_id`),
  ADD KEY `id` (`role_id`);

--
-- Indexes for table `tblusers`
--
ALTER TABLE `tblusers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblcontrolassignments`
--
ALTER TABLE `tblcontrolassignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=375;

--
-- AUTO_INCREMENT for table `tblcontrols`
--
ALTER TABLE `tblcontrols`
  MODIFY `control_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tblcountries`
--
ALTER TABLE `tblcountries`
  MODIFY `country_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbllocations`
--
ALTER TABLE `tbllocations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tblmodules`
--
ALTER TABLE `tblmodules`
  MODIFY `module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tblroleassignments`
--
ALTER TABLE `tblroleassignments`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tblroles`
--
ALTER TABLE `tblroles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=227;

--
-- AUTO_INCREMENT for table `tblusers`
--
ALTER TABLE `tblusers`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblcontrolassignments`
--
ALTER TABLE `tblcontrolassignments`
  ADD CONSTRAINT `tblcontrolassignments_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `tblroles` (`role_id`),
  ADD CONSTRAINT `tblcontrolassignments_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `tblmodules` (`module_id`),
  ADD CONSTRAINT `tblcontrolassignments_ibfk_3` FOREIGN KEY (`control_id`) REFERENCES `tblcontrols` (`control_id`);

--
-- Constraints for table `tblcontrols`
--
ALTER TABLE `tblcontrols`
  ADD CONSTRAINT `tblcontrols_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `tblmodules` (`module_id`);

--
-- Constraints for table `tblpersons`
--
ALTER TABLE `tblpersons`
  ADD CONSTRAINT `tblpersons_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `tblcountries` (`country_id`),
  ADD CONSTRAINT `tblpersons_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `tbllocations` (`location_id`);

--
-- Constraints for table `tblroleassignments`
--
ALTER TABLE `tblroleassignments`
  ADD CONSTRAINT `tblroleassignments_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `tblmodules` (`module_id`),
  ADD CONSTRAINT `tblroleassignments_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `tblroles` (`role_id`);

--
-- Constraints for table `tblusers`
--
ALTER TABLE `tblusers`
  ADD CONSTRAINT `tblusers_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `tblroles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
