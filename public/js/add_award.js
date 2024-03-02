// Get the objects we need to modify
let addPersonForm = document.getElementById('add-award-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_award_title = document.getElementById("input-award_title");
    let input_movie_id = document.getElementById("input-movie_id");
    let input_actor_id = document.getElementById("input-actor_id");
    let input_year_won = document.getElementById("input-year_won");

    // Get the values from the form fields
    let award_title_Value = input_award_title.value;
    let movie_id_Value = input_movie_id.value;
    let actor_id_Value = input_actor_id.value;
    let year_won_Value = input_year_won.value;

    // Put our data we want to send in a javascript object
    let data = {
        fname: award_title_Value,
        lname: movie_id_Value,
        actor_id: actor_id_Value,
        year_won: year_won_Value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-award-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_award_title.value = '';
            input_movie_id.value = '';
            input_actor_id.value = '';
            input_Age.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("award-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let award_id_Cell = document.createElement("TD");
    let award_title_Cell = document.createElement("TD");
    let movie_id_Cell = document.createElement("TD");
    let actor_id_Cell = document.createElement("TD");
    let year_won_Cell = document.createElement("TD");

    // Fill the cells with correct data
    award_id_Cell.innerText = newRow.award_id;
    award_title_Cell.innerText = newRow.award_title;
    movie_id_Cell.innerText = newRow.movie_id;
    actor_id_Cell.innerText = newRow.actor_id;
    year_won_Cell.innerText = newRow.year_won;

    // Add the cells to the row 
    row.appendChild(award_id_Cell);
    row.appendChild(award_title_Cell);
    row.appendChild(movie_id_Cell);
    row.appendChild(actor_id_Cell);
    row.appendChild(year_won_Cell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}

// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("award-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let award_id_Cell = document.createElement("TD");
    let award_title_Cell = document.createElement("TD");
    let movie_id_Cell = document.createElement("TD");
    let actor_id_Cell = document.createElement("TD");
    let year_won_Cell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    award_id_Cell.innerText = newRow.award_id;
    award_title_Cell.innerText = newRow.award_title;
    movie_id_Cell.innerText = newRow.movie_id;
    actor_id_Cell.innerText = newRow.actor_id;
    year_won_Cell.innerText = newRow.year_won;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.award_id);
    };


    // Add the cells to the row
    row.appendChild(award_id_Cell);
    row.appendChild(award_title_Cell);
    row.appendChild(movie_id_Cell);
    row.appendChild(actor_id_Cell);
    row.appendChild(year_won_Cell);
    row.appendChild(delete_Cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.award_id);

    // Add the row to the table
    currentTable.appendChild(row);
}