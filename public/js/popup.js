//close popup-item class
var closeButton = document.querySelector(".close-btn button");
var popUpItem = document.querySelector(".pop-up-item");

var closeBtn = document.querySelector(".pop-btn");
closeBtn.addEventListener("click",function(){
    var pop_item = document.querySelector(".pop-up-item");
    pop_item.classList.remove("active");
});