
// Get the objects we need to modify
let updateMovieForm = document.getElementById('update-movie-form-ajax');

// Modify the objects we need
updateMovieForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_movie_id = document.getElementById("mySelect");
    let input_movie_name = document.getElementById("update-input-movie_name")
    let input_rating = document.getElementById("update-input-rating")
    let input_genre = document.getElementById("update-input-genre")
    let input_minute = document.getElementById("update-input-minute")
    let input_additional_cost = document.getElementById("update-input-additional_cost")
    
    // Get the values from the form fields
    let movie_id_Value = input_movie_id.value;
    let movie_name_Value = input_movie_name.value
    let rating_Value = input_rating.value
    let genre_Value = input_genre.value
    let minute_Value = input_minute.value
    let additional_cost_Value = input_additional_cost.value


    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(movie_id_Value)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        movie_id: movie_id_Value,
        movie_name: movie_name_Value,
        rating: rating_Value,
        genre: genre_Value,
        minute: minute_Value,
        additional_cost: additional_cost_Value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-movie-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, movie_id_Value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    // location.reload()

})


function updateRow(data, movie_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("movie-table");
    console.log("table", table, movie_id)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == movie_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].movie_title; 
       }
    }

}
