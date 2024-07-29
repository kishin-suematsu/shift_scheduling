const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/employeeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const shiftSchema = {
  shift_id: Number,
  start_time: Date,
  end_time: Date,
  date: Date,
  location: String,
  notes: String,
};

const employeesSchema = {
    name: String, 
    detail: {
        id: Number,
        payRate:Number,
        title: {
            manager:Boolean,
            childcare_worker:Boolean,
            child_guidance_counselor:Boolean,
            nurse_supervisor:Boolean,
            physical_therapist:Boolean,
            doctor:Boolean
        }
    },
    shift:[shiftSchema]
};
 

//global variables
var sheet_date = new Date();
sheet_date.setHours(0, 0, 0, 0);

var monthly_employees=[]; //get specific month employees
var daily_employees=[]; //get specific date employees

//create mongoDB collection and initialize employees
var year = sheet_date.getFullYear();
var month = sheet_date.getMonth();
var EmployeeModel = mongoose.model(`Employee_${year}_${month+1}`, employeesSchema);

initialize_employees();



app.get("/", async function(req, res) {
    try {
        await get_theDate_member();
        //res.json(daily_employees);
        res.render("home", { employees: daily_employees, sheet_date : sheet_date });
    } catch(err) {
        console.log(err);
    }
    // await refresh() will pause the execution of 
    // the GET request handler until refresh() has finished. 
    // This ensures that the latest data is sent in the response.
});

app.get("/adduser", function(req, res){
    res.render("addUser");
})

app.get("/monthShift", async function(req, res){
    try {
        await initialize_employees(); // Refresh data from the database
        //res.json(monthly_employees);
        res.render("monthShift", { employees: monthly_employees, sheet_date : sheet_date });
    } catch(err) {
        console.log(err);
    }
})


app.post("/submit-date", async function(req, res) {
    try {
        // Get the selected date from the form data
        //update global veritable year and month
        var dateString = req.body.selectedDate; 
        var theDate = new Date(dateString);
        var temp = month;
        year = theDate.getFullYear();
        month = theDate.getMonth();
        if(temp !== month){
            EmployeeModel=mongoose.model(`Employee_${year}_${month+1}`, employeesSchema);
        }        

        console.log("year and month : " + year + " " + (month+1))

        sheet_date = new Date(theDate.setDate(theDate.getDate() + 1));
        console.log("Selected Date: ", sheet_date);

        await get_theDate_member();
        res.render("home", { employees: daily_employees, sheet_date : sheet_date });
    } catch(err) {
        console.log(err);
    }
});

app.post("/next-day", async function(req, res) {
    try {
        // go next day
        sheet_date = new Date (sheet_date.setDate(sheet_date.getDate() + 1));
        console.log("Selected Date: ", sheet_date);

        //update global veritable year and month
        var theDate = sheet_date;
        var temp = month;
        year = theDate.getFullYear();
        month = theDate.getMonth();
        if(temp !== month){
            EmployeeModel=mongoose.model(`Employee_${year}_${month+1}`, employeesSchema);
        }
        //console.log("year and month : " + year + " " + month+1)

        await get_theDate_member();
        res.redirect("/")
    } catch(err) {
        console.log(err);
    }
});

app.post("/previous-day", async function(req, res) {
    try {
        // go back one day
        sheet_date = new Date (sheet_date.setDate(sheet_date.getDate()-1))
        console.log("Selected Date: ", sheet_date);

         //update global veritable year and month
        var theDate = sheet_date;
        var temp = month;
        year = theDate.getFullYear();
        month = theDate.getMonth();
        if(temp !== month){
            EmployeeModel=mongoose.model(`Employee_${year}_${month+1}`, employeesSchema);
        }
        await get_theDate_member();
        res.redirect("/")    
    } 
    catch(err) {
        console.log(err);
    }
});

app.post("/monthShift", function(req, res){
    const [start_h, start_m] = req.body.start_time.split(':');
    const [end_h, end_m] = req.body.end_time.split(':');
    const theDay = req.body.data_day;
    const theName = req.body.data_name;
    const index = theDay-1;
    let theStartTime, theEndTime;

    console.log(theName);

    if(start_h !== "休み" && end_h !== "休み"){
        //出勤
        theStartTime = new Date(2023,month,theDay, start_h, start_m);
        theEndTime = new Date(2023, month, theDay, end_h, end_m);
        // console.log(theStartTime.toLocaleString());
        // console.log(theEndTime.toLocaleString());

        EmployeeModel.findOneAndUpdate({
            name: theName,
          }, {
            $set: {
                [`shift.${index}.start_time`]: theStartTime,
                [`shift.${index}.end_time`] : theEndTime
            }
          }, {
            new: true // This option will return the new document
          })
          .then(function(foundItems) {
            console.log(foundItems);
            res.redirect("/monthShift");
          })
          .catch(function(err) {
            console.log(err);
          });


    }else{
        //休み
        console.log("休み")
        EmployeeModel.findOneAndUpdate({
            name: theName,
          }, {
            $set: {
                [`shift.${index}.start_time`]: null,
                [`shift.${index}.end_time`] : null
            }
          }, {
            new: true // This option will return the new document
          })
          .then(function(foundItems) {
            console.log(foundItems);
            res.redirect("/monthShift");
          })
          .catch(function(err) {
            console.log(err);
          });
    }

});


app.post("/adduser", function(req, res){
    const theName = req.body.user_name;
    const theTitle1 = req.body.user_role1;
    const theTitle2 = req.body.user_role2;

    console.log(theName);
    console.log(theTitle1);
    console.log(theTitle2);

    EmployeeModel.findOne({
        name:theName
    })
    .then(function(foundItem){
        if(foundItem===null){
            //if there is not same user then add

            // Create array for shifts
            let shiftsArray = [];

            // Get number of days in the current month
            const daysInMonth = new Date(year, month+1, 0).getDate();

            // Generate shift for each day of the month
            for(let i = 1; i <= daysInMonth; i++) {
                shiftsArray.push({
                    start_time: new Date(year, month,i,Math.floor(Math.random() * (10 - 1 + 1)) + 1),
                    end_time: new Date(year, month,i,Math.floor(Math.random() * (20 - 12 + 1)) + 12),
                    date: new Date(year, month,i),
                });
            }

            EmployeeModel.insertMany({
                name: theName, 
                detail: {
                    id: Math.random(), //if no id which cause error
                    payRate:1000,
                    title: {
                        manager:(theTitle1==="manager" || theTitle2 === "manager") ? true : false,
                        childcare_worker:(theTitle1==="childcare_worker" || theTitle2 === "childcare_worker") ? true : false,
                        child_guidance_counselor:(theTitle1==="child_guidance_counselor" || theTitle2 === "child_guidance_counselor") ? true : false,
                        nurse_supervisor:(theTitle1==="nurse_supervisor" || theTitle2 === "nurse_supervisor") ? true : false,
                        physical_therapist:(theTitle1==="physical_therapist" || theTitle2 === "physical_therapist") ? true : false,
                        doctor:(theTitle1==="doctor" || theTitle2 === "doctor") ? true : false
                    }
                },
                shift: shiftsArray
            })
            .then(function(){
                console.log("Successful");
            })
            .catch(function(err){
                console.log(err);
            })

        }else{
            //alert("同じ名前の人物がすでに存在しています。")
        }
    })

    res.redirect("/monthShift");

    
})




app.listen(3000, function(){
    console.log("Server is running on port 3000");
})


//--------functions----------------

//create mongoDB collection and initialize employees
async function initialize_employees() {
    var monthShift = []; //get specific month's info
    console.log("year : " + year + ", month : " + (month+1));
    await refresh();
    console.log(monthly_employees);
}


//refresh employees[] arr and get new employees[]
function refresh(){
    return EmployeeModel.find({})
    .then((foundItem)=>{
        monthly_employees = [];
        //sheet_date = new Date();
        sheet_date.setHours(0, 0, 0, 0);

        //initialize every single variables
        for(var i=0; i<foundItem.length; i++){

            var employee_name = foundItem[i].name;
            var employee_detail_id = foundItem[i].detail.id;
            var employee_detail_title = foundItem[i].detail.title;

            var employee_shifts = [];  // Create array to hold this employee's shifts

            for(var j=0; j<foundItem[i].shift.length; j++){
                var employee_shift_id = foundItem[i].shift[j].shift_id;
                var employee_shift_start_time = foundItem[i].shift[j].start_time;
                var employee_shift_end_time = foundItem[i].shift[j].end_time;
                var employee_shift_date = foundItem[i].shift[j].date;
                var employee_shift_location = foundItem[i].shift[j].location;
                var employee_shift_notes = foundItem[i].shift[j].notes;

                // Push this shift into the array
                employee_shifts.push({
                    shift_id: employee_shift_id,
                    start_time: employee_shift_start_time,
                    end_time: employee_shift_end_time,
                    date: employee_shift_date,
                    location: employee_shift_location,
                    notes: employee_shift_notes,
                });
            }

            //add items to employees arr
            monthly_employees.push({
                name: employee_name, 
                detail: {
                    id: employee_detail_id,
                    title: employee_detail_title,
                },
                shift: employee_shifts // Add the array of shifts
            });
        }       
    })
    .catch((err)=>{
        console.log(err);
    })
}

//get the daily_employees by specific date
async function get_theDate_member() {
    await refresh();
    daily_employees = [];
    monthly_employees.forEach(employee => {
        employee.shift.forEach(shift => {
            //console.log("shift.date : " + shift.date.toISOString().split('T')[0]);
            if (
                sheet_date.toISOString().split('T')[0] === shift.date.toISOString().split('T')[0]
            ) {
                daily_employees.push({
                    name: employee.name,
                    start_time: shift.start_time,
                    end_time: shift.end_time,
                    date: shift.date,
                    location: shift.location,
                    notes: shift.notes,
                    title: employee.detail.title
                });
            }
        });
    });

    console.log(daily_employees);
}




