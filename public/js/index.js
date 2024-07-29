


//menu
var menu = document.querySelector(".menu");
menu.addEventListener("click",function(){
    var category_nav = document.querySelector(".category-nav");
    var body_section = document.querySelector("#body-section");
    var cover = document.querySelector(".cover");
    menu.classList.toggle("active");
    category_nav.classList.toggle("active");
    body_section.classList.toggle("active");
    cover.classList.toggle("active");
});

//un-activate
var cover = document.querySelector(".cover");
cover.addEventListener("click",function(){
    var category_nav = document.querySelector(".category-nav");
    var body_section = document.querySelector("#body-section");
    var menu = document.querySelector(".menu");
    cover.classList.remove("active");
    category_nav.classList.remove("active");
    body_section.classList.remove("active");
    menu.classList.remove("active");
});

//active show
var btn = document.querySelector(".for-dropdown-category");
btn.addEventListener("click",function(){
    var dropdown = document.querySelector(".dropdown-category");
    dropdown.classList.toggle("show");
});






