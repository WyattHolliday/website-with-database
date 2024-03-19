-- phpMyAdmin SQL Dump
-- version 5.2.1-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 08, 2024 at 04:47 PM
-- Server version: 10.6.16-MariaDB-log
-- PHP Version: 8.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_chenjinp`
--

-- --------------------------------------------------------

--
-- Table structure for table `Actors`
--

CREATE TABLE `Actors` (
  `actor_id` int(11) NOT NULL,
  `actor_fname` varchar(255) NOT NULL,
  `actor_lname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Actors`
--

INSERT INTO `Actors` (`actor_id`, `actor_fname`, `actor_lname`) VALUES
(1, 'Vin', 'Diesel'),
(2, 'Brad', 'Pitt'),
(3, 'Al', 'Pacino');

-- --------------------------------------------------------

--
-- Table structure for table `Awards`
--

CREATE TABLE `Awards` (
  `award_id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `award_title` varchar(255) NOT NULL,
  `Year_won` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Awards`
--

INSERT INTO `Awards` (`award_id`, `movie_id`, `actor_id`, `award_title`, `Year_won`) VALUES
(1, 1, 1, 'Best Actor', 2019),
(2, 2, NULL, 'Best Picture', 2019),
(3, 1, NULL, 'Best Sound', 2020);

-- --------------------------------------------------------

--
-- Table structure for table `Movies`
--

CREATE TABLE `Movies` (
  `movie_id` int(11) NOT NULL,
  `movie_name` varchar(255) DEFAULT NULL,
  `rating` int(5) DEFAULT NULL,
  `genre` varchar(255) NOT NULL,
  `minute` int(4) NOT NULL,
  `additional_cost` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Movies`
--

INSERT INTO `Movies` (`movie_id`, `movie_name`, `rating`, `genre`, `minute`, `additional_cost`) VALUES
(1, 'Fast And Furious', 4, 'Action', 125, NULL),
(2, 'Fight Club', 5, 'Psychological', 122, NULL),
(3, 'The Godfather', 4, 'Crime', 180, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Movies_Actors`
--

CREATE TABLE `Movies_Actors` (
  `movies_actors_id` int(11) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `movie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Movies_Actors`
--

INSERT INTO `Movies_Actors` (`movies_actors_id`, `actor_id`, `movie_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Movies_Streaming_Services`
--

CREATE TABLE `Movies_Streaming_Services` (
  `movies_streaming_services_id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Movies_Streaming_Services`
--

INSERT INTO `Movies_Streaming_Services` (`movies_streaming_services_id`, `movie_id`, `service_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 3, 3),
(5, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Streaming_Services`
--

CREATE TABLE `Streaming_Services` (
  `service_id` int(11) NOT NULL,
  `service` varchar(255) NOT NULL,
  `cost` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Streaming_Services`
--

INSERT INTO `Streaming_Services` (`service_id`, `service`, `cost`) VALUES
(1, 'Flixnet', 5),
(2, 'Stream+', 6),
(3, 'PearTV', 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Actors`
--
ALTER TABLE `Actors`
  ADD PRIMARY KEY (`actor_id`);

--
-- Indexes for table `Awards`
--
ALTER TABLE `Awards`
  ADD PRIMARY KEY (`award_id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `actor_id` (`actor_id`);

--
-- Indexes for table `Movies`
--
ALTER TABLE `Movies`
  ADD PRIMARY KEY (`movie_id`);

--
-- Indexes for table `Movies_Actors`
--
ALTER TABLE `Movies_Actors`
  ADD PRIMARY KEY (`movies_actors_id`),
  ADD KEY `actor_id` (`actor_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `Movies_Streaming_Services`
--
ALTER TABLE `Movies_Streaming_Services`
  ADD PRIMARY KEY (`movies_streaming_services_id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `Streaming_Services`
--
ALTER TABLE `Streaming_Services`
  ADD PRIMARY KEY (`service_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Actors`
--
ALTER TABLE `Actors`
  MODIFY `actor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Awards`
--
ALTER TABLE `Awards`
  MODIFY `award_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Movies`
--
ALTER TABLE `Movies`
  MODIFY `movie_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Movies_Actors`
--
ALTER TABLE `Movies_Actors`
  MODIFY `movies_actors_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Movies_Streaming_Services`
--
ALTER TABLE `Movies_Streaming_Services`
  MODIFY `movies_streaming_services_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Streaming_Services`
--
ALTER TABLE `Streaming_Services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Awards`
--
ALTER TABLE `Awards`
  ADD CONSTRAINT `fk_awards_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `Movies` (`movie_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_awards_actor_id` FOREIGN KEY (`actor_id`) REFERENCES `Actors` (`actor_id`) ON DELETE CASCADE;

--
-- Constraints for table `Movies_Actors`
--
ALTER TABLE `Movies_Actors`
  ADD CONSTRAINT `fk_movies_actors_actor_id` FOREIGN KEY (`actor_id`) REFERENCES `Actors` (`actor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_movies_actors_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `Movies` (`movie_id`) ON DELETE CASCADE;

--
-- Constraints for table `Movies_Streaming_Services`
--
ALTER TABLE `Movies_Streaming_Services`
  ADD CONSTRAINT `fk_movies_services_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `Movies` (`movie_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_movies_services_service_id` FOREIGN KEY (`service_id`) REFERENCES `Streaming_Services` (`service_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
