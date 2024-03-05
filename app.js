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

app.get('/', function(req, res)
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

                    return res.render('index', {data: Awards, Actors: Actors, Movies: Movies});
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
            res.redirect('/');
        }
    })
})

app.delete('/delete-award-ajax/', function(req,res,next){
    let data = req.body;
    let award_id = parseInt(data.award_id);
    let deleteAwards = `DELETE FROM Awards WHERE award_id = ?`;
    location.reload()
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
  

    let queryUpdateMovie_id = `UPDATE Awards SET movie_id = ? WHERE Awards.award_id = ?`;
    let selectMovie_id = `SELECT * FROM Movies WHERE movie_id = ?`
          // Run the 1st query
          db.pool.query(queryUpdateMovie_id, [movie_id, award_id], function(error, rows, fields){
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

app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});