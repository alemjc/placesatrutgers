$(document).ready(function(){
  $(".parallax").parallax();
  $('.modal-trigger').leanModal();
  $('select').material_select();
  $("#clearBtn").on("click", function(){
  	//get the input fields by id and clear it
  });


  $(".stars").each(function(){
    if ($(this).html() === "5"){
      $(this).html("<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>")
    }else if ($(this).html() === "4"){
      $(this).html("<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i>")
    }else if ($(this).html() === "3"){
      $(this).html("<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i>")
    }else if ($(this).html() === "2"){
      $(this).html("<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i>")
    }else if ($(this).html() === "1"){
      $(this).html("<i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i>")
    } else{
      $(this).html("<i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i>")
    }
  })
  
  $(document).on("click", ".starIcons .fa", function(){
    $(this).addClass("rating");
    $(this).prevAll().addClass("rating");
    $(this).nextAll().removeClass("rating");
  })

  $(document).on({
    mouseenter: function () {
      $(this).addClass("fa-star");
      $(this).removeClass("fa-star-o");
      $(this).prevAll().addClass("fa-star");
      $(this).prevAll().removeClass("fa-star-o");
      $(this).nextAll().addClass("fa-star-o");
      $(this).nextAll().removeClass("fa-star");
    },
    mouseleave: function () {
      $(this).addClass("fa-star-o");
      $(this).removeClass("fa-star");
      $(this).prevAll().addClass("fa-star-o");
      $(this).prevAll().removeClass("fa-star");
      $(".rating").addClass("fa-star");
      $(".rating").removeClass("fa-star-o");
    }
  }, ".starIcons .fa");


  $(document).on("click", ".fa-star", function(){
    var numItems = $('.starIcons .fa-star').length;
    console.log(numItems);
    $(".starInput").attr("value", numItems.toString());
  });

});

