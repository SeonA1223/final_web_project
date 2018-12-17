$(document).ready(function() {

  $("#check_overNn").click(function(event) {
    event.preventDefault();
     $.ajax({
       type: 'POST',
       url: '/signup_checkName',
       dataType: "json",
       data: {
         nname: $('#nname').val()
       },
       success: function(response) {
         console.log(response.RESULT);
         if (response.RESULT == 1) {
           alert("가능한 닉네임 입니다.");
         } else if (response.RESULT == 0) {
           alert("중복된 닉네임 입니다.");
         } else {
           alert("알 수 없는 에러 발생");
         }
       },
     })
   });

  $("#check_overId").click(function(event) {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/signup_checkId',
      dataType: "json",
      data: {
        id: $('#id').val()
      },
      success: function(response) {
        if (response.RESULT == 1) {
          alert("가능한 아이디 입니다.");
        } else if (response.RESULT == 0) {
          alert("중복된 아이디 입니다.");
        } else {
          alert("알 수 없는 에러 발생");
        }
      },
    })
  });


});
