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
            ${safeHTML(data.content.text)}
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

  const safeHTML = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const renderTweets = ($tweets) => {
    $('.tweets-container').empty();
    $tweets.sort((a, b) => b.created_at - a.created_at);
    for (const key in $tweets) {
      let tweet = createTweetElement($tweets[key]);
      $('.tweets-container').append(tweet);
    }
  };

  const hiddenErrors = () => {
    $('#error-too-long').hide()
    $('#error-no-message').hide()
  }
  hiddenErrors()

  $('#tweet-form').submit(function(event) {
    event.preventDefault();

    const data = $(this).serialize(); //helper function turns foreign data into a specific format
    const tweet = $('textarea#tweet-text').val()

    hiddenErrors();
    if (tweet.length > 140) {
      $('#error-too-long').fadeIn()
      return;
    };

    if (!tweet) {
      $('#error-no-message').fadeIn()
      return;
    };

    $.ajax({
      method: 'POST',
      data,
      url: '/tweets',
      success: function () {
        loadtweets();
      },
      error: function () {
      }
    });

    this.reset();
    $(".counter").text(140);
    loadtweets();
  });

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




