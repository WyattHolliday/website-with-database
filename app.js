const express = require('express');
const exphbs = require('express-handlebars');
const { engine } = exphbs;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
const PORT = 3331;

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

                // Overwrite the homeworld ID with the name of the planet in the people object
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

                    // Overwrite the homeworld ID with the name of the planet in the people object
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

app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});