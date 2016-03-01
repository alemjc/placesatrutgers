$(document).ready(function(){
  $(".parallax").parallax();
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
  // if ($(".stars").html() === "5"){
  //   $(".stars").html("five")
  // }else{
  //   
  // }
});