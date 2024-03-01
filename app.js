// app.js

/*
    SETUP
*/
const exphbs = require('express-handlebars');
const express = require('express');     // Import express-handlebars
const { engine } = exphbs;
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 3331;                 // Set a port number at the top so it's easy to change in the future

app.engine('.hbs', exphbs.engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

/*
    ROUTES
*/
// app.js 

app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
}); // Use 'hostname' to find localhost