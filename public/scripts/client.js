/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  //TWEET TEMPLATE
  const createTweetElement = (data) => {
    const $tweet = `<article class="tweet">
          <div class="article-margin">
            <header class="tweet-header">
              <span><img class="avatar" src="${data.user.avatars}"> &nbsp;&nbsp; ${data.user.name}</span>
              <h3 class="username">${data.user.handle}</h3>
            </header>
  
            <section class="tweet-text">
            <p>${safeHTML(data.content.text)}</p>
            </section>
            <hr>
  
            <footer>
              <span>${timeago.format(data.created_at)}</span>
              <div class="icons">
                <i class="fa-solid fa-flag"></i>
                <i class="fa-solid fa-retweet"></i>
                <i class="fa-solid fa-heart"></i>
              </div>
            </footer>
          </div>
          </article>
          `;
    return $tweet;
  };
// HTML ENCYPTION
  const safeHTML = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

// RENDER
  const renderTweets = ($tweets) => {
    $('.tweets-container').empty();
    for (const key in $tweets) {
      let tweet = createTweetElement($tweets[key]);
      $('.tweets-container').append(tweet);
    }
  };

  // ERROR MESSAGE - hidden
  const hiddenErrors = () => {
  $('#too-long-error').hide()
  $('#no-message-error').hide()
  }
hiddenErrors()

  // SUBMIT - Stops page redirect and submits new tweets
  $('#tweet-form').submit(function(event) {
    event.preventDefault();

    const data = $(this).serialize(); //helper function turns foreign data into a specific format

    hiddenErrors()
    if ($('textarea#tweet-text').val().length > 140) {
      $('#too-long-error').show()
      return;
    }

    if (!$('textarea#tweet-text').val()) {
      $('#no-message-error').show()
      return;
    }

    $.ajax({
      method: 'POST',
      data,
      url: '/tweets',
      success: function() {
        loadtweets();
        alert('successfully submitted');
      },
      error: function() {
        alert('submittion unsuccessful');
      }
    });
    loadtweets();
  });

  // LOAD TWEET
  const loadtweets = () => {
    $.ajax({ method: 'GET', url: '/tweets' })
      .then((body) => {
        renderTweets(body);
      })
      .catch(err => {
        console.log('error', err);
      });
  };
  loadtweets();

});




