function deleteMoviesActors(movies_actors_id) {
    let link = '/delete-movies-actors-ajax/';
    let data = {
        movies_actors_id: movies_actors_id
    };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-movies-actors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(movies_actors_id);
            location.reload()

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload()

    
  }
  
  function deleteRow(movies_actors_id){
      let table = document.getElementById("movie-actors-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == movies_actors_id) {
              table.deleteRow(i);
              break;
         }
      }
  }