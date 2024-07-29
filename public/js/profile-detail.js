const profile_detail_container = document.querySelector(".profile-detail_container");


function nameClicked(clickedItem, role1, role2) {
    
    const profile_detail_name = document.querySelector(".profile-detail-name")
    const profile_detail_role1 = document.querySelector(".profile-detail-role1")
    const profile_detail_role2 = document.querySelector(".profile-detail-role1")

    //alert(clickedItem);
    const [blank, name] = clickedItem.split('_');

    //set value
    profile_detail_name.setAttribute("value", name);
    profile_detail_role1.setAttribute("value", role1);
    profile_detail_role2.setAttribute("value", role2);
    
    //<li class="day" value="" name="data_day"></li>
    profile_detail_name.textContent = "名前 : " + name;
    profile_detail_role1.textContent = "役割 : " + role1;
    profile_detail_role2.textContent = "役割 : " + role2;
  
    // Display the popup
    profile_detail_container.style.display = "block";
}
