function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
  }
}
var myVar = setInterval(myTimer, 1000);

var counter = 1;

function myTimer() {
  if (counter == 1) {
    var banners = document.getElementById("banners");
    banners.src = "photo/main_photo/MainMovie.png";
    counter = 2;
  } else if (counter == 2) {
    document.getElementById("banners").src = "photo/main_photo/MainMovie.png";
    counter = 3;
  } else {
    if (counter == 3) {
      document.getElementById("banners").src = "photo/main_photo/MainMusic.png";
      counter = 4;
    } else if (counter == 4) {
      document.getElementById("banners").src = "photo/main_photo/MainRec.png";
      counter = 1;
    }
  }
}

addEventListener('load', myTimer);

$(document).ready(function() {
  $(".nav").hide();

  $("#upload_but").click(function() {
    $(".modal").css({
      "display": "block"
    });
  });
  $(".close").click(function() {
    $(".modal").css({
      "display": "none"
    });
  });
  $("html").click(function(event) {
    if (event.target.id === "myModal") {
      $(".Modal").css({
        "display": "none"
      });
    }
  });

  function btnClickHandler(cat){

    $('#cat').attr('value', cat);

     $("#movie").show();
    $("#posts").hide();

    $("#upload_but").click(function() {
      $(".modal").css({
        "display": "block"
      });
    });
    $(".close").click(function() {
      $(".modal").css({
        "display": "none"
      });
    });
    $("html").click(function(event) {
      if (event.target.id === "myModal") {
        $(".Modal").css({
          "display": "none"
        });
      }
    });
  }

  $("#but_movie").click(function(callback) {

    btnClickHandler('movie');
  });

  $("#but_music").click(function(callback) {

    btnClickHandler('music');
  });

  $("#but_book").click(function(callback) {

    btnClickHandler('book');
  });

  function getPostHandler(event) {
    idx = event.target.parentElement.childNodes[3].value
    location.href = '/showpost/' + idx;
  }

  function getPostListHandler(cat, offset){
    $.ajax({
      type: 'get',
      url: '/api/getPostListInfo/' + $('#cat').val() + '/' + cat +'/' + offset,
      datatype: 'json',
      success: (data) => {
        var lists = data.lists;
        var length = data.length.cnt;
        var $postview = $('#postview').css('display', 'grid').css('grid-template-columns', '1fr 1fr 1fr 1fr')
        $postview.html('');
        for(i in lists){
          var $appendpost = $('<div></div>')
          $appendpost.click(getPostHandler)

          var $img = $('<img>').attr('src', 'data:image/jpeg;base64,'+lists[i].post_picture).css('width', '100%').css('height', '400px').appendTo($appendpost);
          $appendpost.append('<div>'+lists[i].post_title+'</div>');
          $appendpost.append('<div>조회수 : '+lists[i].post_hit_count + ' 좋아요 : ' + lists[i].post_like_count + ' 댓글 : ' + lists[i].post_comment_count+'</div>');
          $appendpost.append('<input type = hidden name = idx value = ' + lists[i].post_idx + '>');
          $postview.append($appendpost);
        }

        var offsetSize = length / 8;
        var $offset = $('#offset');
        $offset.html('');
        $offset.css('text-align', 'center');
        for(var i = 0; i < offsetSize; i++){
          $offset.append(' <button class = "offset">' + (i + 1) + '</button>');
        }
        var offsetArray = document.getElementsByClassName('offset');
        for(let i = 0; i < offsetSize; i++){
          offsetArray[i].addEventListener('click', () => {
            let offset = i;
            getPostListHandler(cat, offset);
          })
        }
      }
    })
  }

  $("#map_ame_but").click(function() {

    getPostListHandler('America', 0);

  });

  $("#map_asia_but").click(function() {

    getPostListHandler('Asia', 0);

  });

  $("#map_eur_but").click(function() {

    getPostListHandler('Europe', 0);

  });

  $("#map_else_but").click(function() {

    getPostListHandler('else', 0);

  });
});

function login_page() {
  location.href = "/login";
}

function signup_page() {
  location.href = "/signup";
}

function logout() {
  location.href = "/logout";
}
