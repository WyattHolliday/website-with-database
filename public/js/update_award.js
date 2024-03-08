
// Get the objects we need to modify
let updateAwardForm = document.getElementById('update-award-form-ajax');

// Modify the objects we need
updateAwardForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_award_id = document.getElementById("mySelect");
    let input_movie_id = document.getElementById("input-movie_id-update");
    let input_actor_id = document.getElementById("input-actor_id-update");
    let input_award_title = document.getElementById("input-award_title-update");
    let input_year_won = document.getElementById("input-year_won-update");

    // Get the values from the form fields
    let award_id_Value = input_award_id.value;
    let movie_id_Value = input_movie_id.value;
    let actor_id_Value = input_actor_id.value;
    let award_title_Value = input_award_title.value;
    let year_won_Value = input_year_won.value;


    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(movie_id_Value)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        award_id: award_id_Value,
        movie_id: movie_id_Value,
        actor_id: actor_id_Value,
        award_title: award_title_Value,
        year_won: year_won_Value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-award-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, award_title_Value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    // location.reload()

})


function updateRow(data, award_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("award-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == award_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].award_title; 
       }
    }

}
