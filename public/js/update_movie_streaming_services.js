
// Get the objects we need to modify
let updateMovieStreamingServiceForm = document.getElementById('update-movie-streaming-service-form-ajax');

// Modify the objects we need
updateMovieStreamingServiceForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_movie_streaming_service_id = document.getElementById("mySelect-update-movie-streaming-service");
    let input_movie_id = document.getElementById("mySelect-update-movie")
    let input_service_id = document.getElementById("mySelect-update-service")
    console.log("input_movie_streaming_service_id", input_movie_streaming_service_id.value, "input_movie_id", input_movie_id.value, "input_service_id", input_service_id.value)
    
    // Get the values from the form fields
    let movie_streaming_service_id_Value = input_movie_streaming_service_id.value;
    let movie_id_Value = input_movie_id.value
    let service_id_Value = input_service_id.value


    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(movie_streaming_service_id_Value) || isNaN(movie_id_Value) || isNaN(service_id_Value))
    {
        console.log("Invalid input")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        movie_streaming_service_id: movie_streaming_service_id_Value,
        movie_id: movie_id_Value,
        service_id: service_id_Value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-movie-streaming-service-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, movie_streaming_service_id_Value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload()

})


function updateRow(data, movie_streaming_service_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("movie-streaming-service-table");
    
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == movie_streaming_service_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].movie_name; 
       }
    }

}
