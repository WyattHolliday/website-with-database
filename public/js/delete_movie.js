function deleteMovie(movie_id) {
    let link = '/delete-movie-ajax/';
    let data = {
      movie_id: movie_id
    };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-movie-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(movie_id);
            location.reload()

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    console.log(data)
    xhttp.send(JSON.stringify(data));
    location.reload()

    
  }
  
  function deleteRow(movie_id){
      let table = document.getElementById("movie-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == movie_id) {
              table.deleteRow(i);
              break;
         }
      }
  }