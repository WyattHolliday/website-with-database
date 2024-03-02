function deletePerson(award_id) {
    let link = '/delete-award-ajax/';
    let data = {
      id: award_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(award_id);
      }
    });
  }
  
  function deleteRow(award_id){
      let table = document.getElementById("award-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == award_id) {
              table.deleteRow(i);
              break;
         }
      }
  }