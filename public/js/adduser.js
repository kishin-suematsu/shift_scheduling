const addUserContainer = document.querySelector(".popup-addUser_container");


function addUser(){
    addUserContainer.style.display = "block";
}

function handleCancel(){
    addUserContainer.style.display = "none";
}


function edit(clickedItem) {
    //alert(clickedItem);
    const [employee, day] = clickedItem.split('-');
    //alert("name : " + employee + "\n day : " + day);
  
    // Get the "employee" element inside "employee-info" by its class
    var data_day = document.querySelector(".hidden_day");
    var data_name = document.querySelector(".hidden_name");
    var text_day = document.querySelector(".day");
    var text_employee = document.querySelector(".employee");
    
    //<li class="day" value="" name="data_day"></li>
    data_day.setAttribute("value", day);
    data_name.setAttribute("value", employee);


    text_day.textContent = "日付 : " + day + " 日";
    text_employee.textContent = "名前 : " + employee;
  
    // Display the popup
    document.querySelector(".popup-info_container").style.display = "block";
}

function handleClick(){
    document.querySelector(".popup-info_container").style.display="none";
}

function clickedName(clickedItem){
    //alert(clickedId);
    const [employee, day] = clickedItem.split('-');
    //alert("name : " + employee + "\n day : " + day);
  
    // Get the "employee" element inside "employee-info" by its class
    var data_day = document.querySelector(".hidden_day");
    var data_name = document.querySelector(".hidden_name");
    var text_day = document.querySelector(".day");
    var text_employee = document.querySelector(".employee");
    
    //<li class="day" value="" name="data_day"></li>
    data_day.setAttribute("value", day);
    data_name.setAttribute("value", employee);


    text_day.textContent = "日付 : " + day + " 日";
    text_employee.textContent = "名前 : " + employee;
  
    // Display the popup
    document.querySelector(".popup-info_container").style.display = "block";
}