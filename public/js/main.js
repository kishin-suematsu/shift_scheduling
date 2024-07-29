const shiftElements = document.querySelectorAll('.individual_shift');
const pop_up_personal_info_container = document.querySelector(".pop-up-personal-info_container");
const nameElement = document.querySelector('.pop-up-personal-info li:nth-child(1)');
const titleElement = document.querySelector('.pop-up-personal-info li:nth-child(2)');
const noteElement = document.querySelector('.pop-up-personal-info li:nth-child(3)');
const startTimeElement = document.querySelector('.pop-up-personal-info li:nth-child(4)');
const endTimeElement = document.querySelector('.pop-up-personal-info li:nth-child(5)');
const pop_up_add_btn = document.querySelector(".add-user");
const pop_up_add_container = document.querySelector(".pop-up-add-container")
const btn__answer_close = document.querySelector(".btn__answer_close"); 
const btn__answer_close_forPersonal_info = document.querySelector(".btn__answer_close_forPersonal_info")

// Event listener for individual shift click
shiftElements.forEach(element => {
    element.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const name = clickedElement.closest('.individual_shift').id;
        const title = clickedElement.closest('.individual_shift').getAttribute('data-title');
        const notes = clickedElement.closest('.individual_shift').getAttribute('data-notes');
        const start_time = clickedElement.closest('.individual_shift').getAttribute('data-startTime');
        const end_time = clickedElement.closest('.individual_shift').getAttribute('data-endTime');
        
        // Update the name and title in the pop-up info
        nameElement.textContent = `Name: ${name}`;
        titleElement.textContent = `Title: ${title}`;
        noteElement.textContent = `Note: ${notes}`;
        startTimeElement.textContent = `start: ${start_time}`;
        endTimeElement.textContent = `end: ${end_time}`;

        // Display the pop-up info
        pop_up_personal_info_container.style.display = 'flex';
    });
});

btn__answer_close_forPersonal_info.addEventListener("click", function(){
    pop_up_personal_info_container.style.display = "none"
})

pop_up_add_btn.addEventListener("click", function() {
    pop_up_add_container.style.display = "flex";
})

btn__answer_close.addEventListener("click", function() {
    pop_up_add_container.style.display = "none";
});
