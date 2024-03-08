function deleteMovieStreamingService(movies_streaming_services_id) {
    let link = '/delete-movie-streaming-service-ajax/';
    let data = {
        movies_streaming_services_id: movies_streaming_services_id
    };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-movie-streaming-service-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(movies_streaming_services_id);
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
  
  function deleteRow(movies_streaming_services_id){
      let table = document.getElementById("movie-streaming-service-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == movies_streaming_services_id) {
              table.deleteRow(i);
              break;
         }
      }
  }