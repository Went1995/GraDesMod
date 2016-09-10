///**
// * Created by 姜文韬 on 2016/9/8.
// */
//function click1(){
//    var box1 = document.getElementById('#box1');
//    box1.setAttribute("display","block");
//}
//function click2(){
//    var box2 = document.getElementById('#box1');
//    box2.setAttribute("display","block");
//}

$(function() {
    $("#box2 div span").click(function(){
        $("#box1").css("float","left");
        $("#box1").show(1000);
    });
    $("#box2").click(function(){
        $("#box1").css("float","left");
        $("#box1").hide(1000);
    });
    $("#btn1").click(function(){
        $("#btn2").removeClass("active");
        $("#btn1").addClass("active");
    });
    $("#btn2").click(function(){
        $("#btn1").removeClass("active");
        $("#btn2").addClass("active");
    });
    //$("#box1").toggle(function(){
    //
    //},function(){
    //
    //});
})
