-- Table insert functions
INSERT INTO Streaming_Services (service, cost) VALUES (:serviceInput, :costInput);
INSERT INTO Movies (movie_name, rating, genre, minute) VALUES (:movie_name_Input, :rating_Input, genre_Input, :minute_Input);
INSERT INTO Actors (actor_fname, actor_lname) VALUES (:actor_fname_Input, :actor_lname_Input);
INSERT INTO Awards (movie_id, actor_id, award_title, year_won) VALUES (:movie_id_from_dropdown_Input, :actor_id_from_dropdown_Input, :award_title_Input, :year_won_Input); -- actor_id_from_dropdown_Input can be NULL
-- Intersection table insert functions
INSERT INTO Movies_Actors (actor_id, movie_id) VALUES (actor_id_from_dropdown_Input, movie_id_from_dropdown_Input);
INSERT INTO Movies_Streaming_Services (movie_id , service_id) VALUES (:movie_id_from_dropdown_Input, :service_id_from_dropdown_Input);

-- Select queries
SELECT Streaming_Services.service FROM Streaming_Services;
SELECT Movies.movie_name FROM Movies WHERE Movies.rating > 3;
SELECT CONCAT(Actors.actor_fname, " ", Actors.actor_lname) FROM Actors;
SELECT Awards.award_title, Awards.year_won FROM Awards ORDER BY Awards.year_won;

-- Delete functions
DELETE FROM Streaming_Services WHERE service_id = :service_id_Selected;
DELETE FROM Movies WHERE movie_id = :movie_id_Selected;
DELETE FROM Actors WHERE actor_id = :actor_id_Selected;
DELETE FROM Awards WHERE award_id = :award_id;
-- Intersection tables
DELETE FROM Movies_Actors WHERE award_id = :Selected_award_id AND actor_id = :Selected_actor_id;
DELETE FROM Movies_Streaming_Services WHERE movie_id = :Selected_movie_id AND service_id = :Selected_service_id;

-- Update functions
UPDATE Streaming_Services SET service = :new_service, cost = :new_cost WHERE service_id = :the_service_id;
UPDATE Movies SET movie_name = :new_movie_name , rating = :new_rating, genre = :new_genre, minute = new_minute WHERE movie_id = :the_movie_id;
UPDATE Actors SET actor_fname = :new_actor_fname, actor_lname = :new_actor_lname WHERE actor_id = :the_actor_id:
UPDATE Awards SET award_id = :dropdown_award_id, movie_id = :dropdown_actor_id, title = :new_title, year_won = :new_year_won WHERE Streaming_Services = :the_service_id; -- dropdown_actor_id can be NULL
-- Intersection tables
UPDATE Movies_Actors SET movie_id = :movie_id_Selected, actor_id = :actor_id_Selected WHERE movies_actors_id = :the_movies_actors_id;
UPDATE Movies_Streaming_Services SET movie_id = :movie_id_Selected, service_id = :service_id_Selected WHERE movies_streaming_services_id = :the_movies_streaming_services_id;