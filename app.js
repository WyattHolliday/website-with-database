const express = require('express');
const exphbs = require('express-handlebars');
const { engine } = exphbs;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
const PORT = 3332;

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');


var db = require('./database/db-connector')

app.get('/Index', function(req,res){
    res.render('Index')
})



app.get('/Movies', function(req, res) {
    let query1;

    if (req.query.movie_title === undefined)
    {
        query1 = "SELECT * FROM Movies;";
    }
    else
    {
        query1 = `SELECT * FROM Movies WHERE movie_name LIKE "${req.query.movie_title}%"`;
    }

    db.pool.query(query1, function(error, rows, fields){
        let Movies = rows;
        return res.render('Movies', {data: Movies});
    })
});

app.post('/add-movie-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let movie = parseInt(data['input-movie']);
    if (isNaN(movie)) {
        movie = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Movies (movie_name, rating, genre, minute, additional_cost) VALUES ('${data['input-movie_name']}', ${data['input-rating']}, '${data['input-genre']}', '${data['input-minute']}', '${data['input-additional_cost']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/Movies');
        }
    })
})

app.delete('/delete-movie-ajax/', function(req,res,next){
    let data = req.body;
    let movie_id = parseInt(data.movie_id);
    let deleteIntersection1 = `DELETE FROM Movies_Streaming_Services WHERE movie_id = ?`;
    let deleteIntersection2 = `DELETE FROM Movies_Actors WHERE movie_id = ?`;
    let deleteM1 = `DELETE FROM Awards WHERE movie_id = ?`; // Awards must have a movie
    let deleteMovie = `DELETE FROM Movies WHERE movie_id = ?`;
                // Run the  query
    db.pool.query(deleteM1, [movie_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteIntersection1, [movie_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(deleteIntersection2, [movie_id], function(error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                        db.pool.query(deleteMovie, [movie_id], function(error, rows, fields) {
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                res.sendStatus(204);
                            }
                        })}
                    })
                }
            })}
        }
    )}
);
    

  app.put('/put-movie-ajax', function(req,res,next){
    let data = req.body;
    
    let movie_id = parseInt(data.movie_id);
    let movie_name = data.movie_name;
    let rating = parseInt(data.rating);
    let genre = data.genre;
    let minute = parseInt(data.minute);
    let additional_cost = parseInt(data.additional_cost);
    if (isNaN(additional_cost)) {
        additional_cost = 'NULL'
    }

    let queryUpdateMovie_id = `UPDATE Movies SET movie_name = ?, rating = ?, genre = ?, minute = ?, additional_cost = ? WHERE Movies.movie_id = ?`;
          // Run the 1st query
        db.pool.query(queryUpdateMovie_id, [movie_name, rating, genre, minute, additional_cost, movie_id], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                res.send(rows);
            }
  })});



app.get('/Movie_Streaming_Services', function(req, res) {
    const queryMSS = "SELECT * FROM Movies_Streaming_Services;";
    const queryM = "SELECT * FROM Movies;";
    const querySS = "SELECT * FROM Streaming_Services;";

    db.pool.query(queryMSS, function(error, rows, fields){
        let Movies_Streaming_Services = rows;
        db.pool.query(queryM, function(error, rows, fields){
            let Movies = rows;
            let moviemap = {}
            Movies.map(movie => {
                let id = parseInt(movie.movie_id, 10);
                moviemap[id] = movie["movie_name"];
            })
            // console.log("moviemap", moviemap)
            Movies_Streaming_Services = Movies_Streaming_Services.map(movies_streaming_services => {
                return Object.assign(movies_streaming_services, {movie_id: moviemap[movies_streaming_services.movie_id]})
            })
            db.pool.query(querySS, function(error, rows, fields){
                let Streaming_Services = rows;
                let servicemap = {}
                Streaming_Services.map(service => {
                    let id = parseInt(service.service_id, 10);
                    servicemap[id] = service["service"];
                })
                // console.log("servicemap", servicemap)
                Movies_Streaming_Services = Movies_Streaming_Services.map(movies_streaming_services => {
                    return Object.assign(movies_streaming_services, {service_id: servicemap[movies_streaming_services.service_id]})
                })
                // console.log("Movies", Movies, "Streaming_Services", Streaming_Services,)
                return res.render('Movie_Streaming_Services', {
                    data: Movies_Streaming_Services,
                    Movie: Movies,
                    Streaming_Services: Streaming_Services
                });
            })
        })
    })
});

app.post('/add-movie_streaming_service-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Movies_Streaming_Services (movie_id, service_id) VALUES ('${data.input_movie}', '${data.input_service}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/Movie_Streaming_Services');
        }
    })
})

app.delete('/delete-movie-streaming-service-ajax', function(req,res,next){
    let data = req.body;
    let movies_streaming_services_id = parseInt(data.movies_streaming_services_id);
    let deleteMovieStreamingService = `DELETE FROM Movies_Streaming_Services WHERE movies_streaming_services_id = ?`;
                // Run the  query
    db.pool.query(deleteMovieStreamingService, [movies_streaming_services_id], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
        
  })});

app.put('/put-movie-streaming-service-ajax', function(req,res,next){
    let data = req.body;
    
    let movie_id = parseInt(data.movie_id);
    let service_id = parseInt(data.service_id);
    let movie_streaming_service_id = parseInt(data.movie_streaming_service_id);

    let queryUpdateMovieStreamingService_id = `UPDATE Movies_Streaming_Services SET movie_id = ?, service_id = ? WHERE Movies_Streaming_Services.movies_streaming_services_id = ?`;
          // Run the 1st query
        db.pool.query(queryUpdateMovieStreamingService_id, [movie_id, service_id, movie_streaming_service_id], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                console.log("sending rows", rows)
                res.send(rows);
            }
  })});

app.get('/Awards', function(req, res)
    {  
        // Declare Query 1
        let query1;

        if (req.query.award_title === undefined)
        {
            query1 = "SELECT * FROM Awards;";
        }

        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM Awards WHERE award_title LIKE "${req.query.award_title}%"`
        }


        // Query 2 is the same in both cases
        let query2 = "SELECT * FROM Actors;";
        
        let query3 = "SELECT * FROM Movies;";

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the people
            let Awards = rows;
            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
                
                // Save the planets
                let Actors = rows;

                let actormap = {}
                    Actors.map(actor => {
                        let id = parseInt(actor.actor_id, 10);
                        actormap[id] = actor["actor_fname"] + " " + actor["actor_lname"];
                    })

                // Overwrite the ID with the name of the planet in the people object
                Awards = Awards.map(award => {
                    return Object.assign(award, {actor_id: actormap[award.actor_id]})
                })
                
                db.pool.query(query3, (error, rows, fields) => {
                    let Movies = rows

                    let moviemap = {}
                    Movies.map(movie => {
                        let id = parseInt(movie.movie_id, 10);

                        moviemap[id] = movie["movie_name"];
                    })

                    // Overwrite the ID with the name of the planet in the people object
                    Awards = Awards.map(award => {
                        return Object.assign(award, {movie_id: moviemap[award.movie_id]})
                    })

                    return res.render('Awards', {data: Awards, Actors: Actors, Movies: Movies});
                })
            })
        })
    }
    );   

// app.js

app.post('/add-award-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let actor = parseInt(data['ïnput-actor']);
    if (isNaN(actor)) {
        actor = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Awards (award_title, movie_id, actor_id, year_won) VALUES ('${data['input-award_title']}', ${data['input-movie']}, ${data['input-actor']}, '${data['input-year_won']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/Awards');
        }
    })
})

app.delete('/delete-award-ajax/', function(req,res,next){
    let data = req.body;
    let award_id = parseInt(data.award_id);
    let deleteAwards = `DELETE FROM Awards WHERE award_id = ?`;
                // Run the  query
    db.pool.query(deleteAwards, [award_id], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
        
  })});

  app.put('/put-award-ajax', function(req,res,next){
    let data = req.body;
  
    let movie_id = parseInt(data.movie_id);
    let award_id = parseInt(data.award_id);
    let actor_id = parseInt(data.actor_id);
    let award_title = data.award_title;
    let year_won = parseInt(data.year_won);

    let queryUpdateMovie_id = `UPDATE Awards SET movie_id = ?, actor_id = ?, award_title = ?, Year_won = ? WHERE Awards.award_id = ?`;
    let selectMovie_id = `SELECT * FROM Movies WHERE movie_id = ?`
          // Run the 1st query
          db.pool.query(queryUpdateMovie_id, [movie_id, actor_id, award_title, year_won, award_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectMovie_id, [movie_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

  app.post('/add-award-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let actor_id = parseInt(data.actor_id);
    if (isNaN(actor_id))
    {
        actor_id = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Awards (award_title, movie_id, actor_id, year_won) VALUES ('${data.award_title}', '${data.movie}', ${actor_id}, ${data.year_won})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Awards;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//THIS SECTION FOR ACTORS

app.get('/Actors', function(req, res) {
    let query1 
    
    if (req.query.lname === undefined)
    {
        query1 = "SELECT * FROM Actors;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Actors WHERE actor_lname LIKE "${req.query.lname}%"`
    }// Define our query

    // Run the 1st query
    // db.pool.query(query1, function(error, rows, fields){
        
    //     // Save the people
    //     let Actors = rows;

    //     return res.render('index', {data: Actors});
    // })

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('Actors', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })  

});

app.delete('/delete-actor-ajax/', function(req,res,next){
    let data = req.body;
    let actor_id = parseInt(data.actor_id);
    let deleteActors = `DELETE FROM Actors WHERE actor_id = ?`;
    let deleteIntersection = `DELETE FROM Movies_Actors WHERE actor_id = ?`;
    let removeM1 = `UPDATE Awards SET actor_id = NULL WHERE actor_id = ?`;
                // Run the  query
    db.pool.query(removeM1, [actor_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteIntersection, [actor_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(deleteActors, [actor_id], function(error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
            })
        }
    })
  });

app.post('/add-actor-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO Actors (actor_fname, actor_lname) VALUES ('${data['input-fname']}', '${data['input-lname']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/Actors');
        }
    })
})

app.put('/put-actor-ajax', function(req,res,next){
    let data = req.body;
  
    let actor_id = parseInt(data.actor_id);
    let fname_id = data.fname_id;
    let lname_id = data.lname_id;
  

    let queryUpdateActor_id = `UPDATE Actors SET actor_fname = ?, actor_lname = ? WHERE Actors.actor_id = ?`;
    let selectActor_id = `SELECT * FROM Actors WHERE actor_id = ?`
          // Run the 1st query
          db.pool.query(queryUpdateActor_id, [fname_id, lname_id, actor_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectActor_id, [fname_id, lname_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

app.get('/Movies_Actors', function(req, res) {
    query1 = "SELECT * FROM Movies_Actors;";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('Movies_Actors', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })  

});



  app.get('/Streaming_Services', function(req, res)
  {  

    let query1;

    if (req.query.streaming_service === undefined)
    {
        query1 = "SELECT * FROM Streaming_Services;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Streaming_Services WHERE service LIKE "${req.query.streaming_service}%"`
    }


      db.pool.query(query1, function(error, rows, fields){    // Execute the query

          res.render('Streaming_Services', {data: rows});                  // Render the index.hbs file, and also send the renderer
      })                                                      // an object where 'data' is equal to the 'rows' we
  }); 

  app.post('/add-streaming_service-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO Streaming_Services (service, cost) VALUES ('${data['input-service']}', ${data['input-cost']})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/Streaming_Services');
        }
    })
})

app.delete('/delete-service-ajax/', function(req,res,next){
    let data = req.body;
    let service_id = parseInt(data.service_id);
    let deleteService = `DELETE FROM Streaming_Services WHERE service_id = ?`;
    let deleteIntersection = `DELETE FROM Movies_Streaming_Services WHERE service_id = ?`

    db.pool.query(deleteIntersection, [service_id], function(error,rows,fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

        else {
            db.pool.query(deleteService, [service_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
                
            })

        }
    })
    
});

app.put('/put-service-ajax', function(req,res,next){
    let data = req.body;
  
    let service_id = parseInt(data.service_id);
    let service_name_id = data.service_name_id;
    let cost_id = parseInt(data.cost_id);
    

    let queryUpdateService_id = `UPDATE Streaming_Services SET service = ?, cost = ? WHERE Streaming_Services.service_id = ?`;
    let selectService_id = `SELECT * FROM Streaming_Services WHERE service_id = ?`
          // Run the 1st query
        

            db.pool.query(queryUpdateService_id, [service_name_id, cost_id, service_id], function(error, rows, fields){
                if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectService_id, [service_name_id, cost_id], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
  })});


app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});