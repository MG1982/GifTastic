$(document).ready(function() {
  $("#results-container").hide();

  // Checks to see if the array exists in localStorage and is an array currently.
  // If not, sets a local list variable to an empty array.
  // Otherwise favButtons is our current array.
  let searchButtonArray = JSON.parse(localStorage.getItem("favButtons"));
  if (!Array.isArray(searchButtonArray)) {
    searchButtonArray = [];
    $("#fav-area").hide();
    console.log(searchButtonArray);
  }
  //Function with AJAX that calls GIPHY with limit of 10 results
  function displayReactionGiffs() {
    let r = $(this).data("search");
    console.log(r);

    let queryURL =
      "https://api.giphy.com/v1/gifs/search?q=" +
      r +
      "&limit=10&api_key=SUmAnc4vc5YnS5r98zSfKyQZouYaiBxa";

    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      let results = response.data;
      console.log(results);
      for (let i = 0; i < results.length; i++) {
        let gifDiv = $("<div>");
        gifDiv.addClass("card text-light bg-dark text-center");
        let rating = results[i].rating.toUpperCase();
        let defaultAnimatedSrc = results[i].images.fixed_height.url;
        let staticSrc = results[i].images.fixed_height_still.url;
        let gifDisplay = $("<img>");
        let p = $("<p>").text("Rating: " + rating);

        gifDisplay.attr("src", staticSrc);
        gifDisplay.addClass("giff");
        gifDisplay.attr("data-state", "still");
        gifDisplay.attr("data-still", staticSrc);
        gifDisplay.attr("data-animate", defaultAnimatedSrc);
        gifDiv.append(gifDisplay);
        gifDiv.append(p);
        $("#giff-results").prepend(gifDiv);
        $("#results-container").show();
      }
    });
  }

  // Button click event adds new search button to array then re-renders buttons to html
  $("#add-button").on("click", function(event) {
    event.preventDefault();
    if ($("#new-button-input").val() == "") {
      alert("You can't add a blank button!");
    } else {
      $("#fav-area").show();
      let newSearch = $("#new-button-input")
        .val()
        .trim();
      searchButtonArray.push(newSearch);
      console.log(searchButtonArray);
      $("#new-button-input").val("");
      displayButtons();
      localStorage.setItem("favButtons", JSON.stringify(searchButtonArray));
    }
  });
  // Button click event clears users favourite buttons from local storage and array then re-renders buttons
  $("#clear-favs").on("click", function(event) {
    event.preventDefault();
    if (
      window.localStorage.length > 0 &&
      confirm("Are you sure you want to clear your favourite search buttons?")
    ) {
      $("#fav-area").hide();
      localStorage.clear();
      searchButtonArray = [];
      console.log(searchButtonArray);
      displayButtons();
    } else if (window.localStorage.length <= 0) {
      alert("There are no favourite buttons to clear");
    }
  });

  //Function loops through searchButtonArray to display buttons with array values in "button-display" section of html
  function displayButtons() {
    $("#button-display").empty();
    for (let i = 0; i < searchButtonArray.length; i++) {
      let a = $("<button>");
      a.addClass("btn btn-primary");
      a.attr("id", "displayed");
      a.attr("data-search", searchButtonArray[i]);
      a.text(searchButtonArray[i]);
      $("#button-display").append(a);
    }
  }

  displayButtons();
  noBlankButton();
  noClearButton();

  //Click event on button with id of "displayed" calls displayReactionGiffs function
  $(document).on("click", "#displayed", displayReactionGiffs);

  //Click event on gifs with class of ".giff" calls pausePlayGiffs function
  $(document).on("click", ".giff", pausePlayGiffs);

  //Function for gif pause/play
  function pausePlayGiffs() {
    let state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  }
  function noBlankButton() {
    $("#add-button").hover(function() {
      if ($("#new-button-input").val() == "") {
        $(this).css("cursor", "not-allowed");
      } else if ($("#new-button-input").val() !== "") {
        $(this).css("cursor", "pointer");
      }
    });
  }
  function noClearButton() {
    $("#clear-favs").hover(function() {
      if (window.localStorage.length <= 0) {
        $(this).css("cursor", "not-allowed");
      } else {
        $(this).css("cursor", "pointer");
      }
    });
  }
});
