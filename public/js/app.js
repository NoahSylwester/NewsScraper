$('#scrape-button').on('click', function(event) {
  event.preventDefault();
  $('.modal-body').html('<h2>Scraping some monstrous news for you...</h2>');
  $.ajax({
      method: "GET",
      url: "/scrape",
    }).then(function(res) {
      console.log(res);
      $('.modal-body').html('<h2>Scraping complete!</h2>');
      setTimeout(function() {
        location.reload();
      }, 2000)
  });
});

// Whenever someone clicks a p tag
$('.comments-toggler').on("click", function () {
  // Empty the notes from the note section
  console.log($(`#comment-count-${$(this).data('id')}`).text());
  if ($(this).data('loaded') === false && $(`#comment-count-${$(this).data('id')}`).text() !== '0') {
    $(this).data('loaded', "true");
    // Save the id from the p tag
    let thisId = $(this).data("id");

    let commentsId = `#comments-${thisId}`;
    $(commentsId).empty();

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // If there's a note in the article
        if (data.articles.notes) {
          data.articles.notes.forEach((element) => {
            // Place the title of the note in the title input
            $(commentsId).append(`<div class="comment"><h5 class="alias-container"><span class="alias">${element.alias}</span> <span class="comment-date">(${element.date_created})</span>:</h5><p class="comment-body">${element.body}</p></div>`);
          });
        }
      });
  }
});

$('.add-note').on('click', function(event) {
  event.preventDefault();
  $('#save-button').attr('data-id', $(this).data('id'));
})

// When you click the savenote button
$(document).on("click", "#save-button", function() {
  if ($("#aliasInput").val() !== "" && $("#commentInput").val() !== "") {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).data("id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      alias: $("#aliasInput").val(),
      // Value taken from note textarea
      body: $("#commentInput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      let commentsId = `#comments-${thisId}`;
      let commentCountId = `#comment-count-${thisId}`;
      $(commentsId).data('loaded', "true");
      $(commentsId).empty();

      // Now make an ajax call for the Article
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        // With that done, add the note information to the page
        .then(function (data) {
          console.log(data);
          $(commentCountId).text(data.articles.notes.length);
          // If there's a note in the article
          if (data.articles.notes) {
            data.articles.notes.forEach((element) => {
              // Place the title of the note in the title input
              $(commentsId).append(`<div class="comment"><h5 class="alias-container"><span class="alias">${element.alias}</span> <span class="comment-date">(${element.date_created})</span>:</h5><p class="comment-body">${element.body}</p></div>`);
            });
          }
        });
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#commentInput").val("");
}
});
