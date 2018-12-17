function goback() {
  location.href = "/";
}

function deletepost(idx) {
  location.href = "/deletepost/" + idx
}


$(document).ready(function() {
  $('#good_but').click(function(){

    var pid = $('#pid').val()

    $.ajax({
      type: 'get',
      url: '/api/handleLike/' + pid,
      datatype: 'json',
      success: (data) => {
        var cnt = $('#likecount').html() * 1
        if(data === true){
          $('#likecount').html(cnt + 1)
        }
        else if(data === false){
          $('#likecount').html(cnt - 1)
        }
      }
    })
  });
});
