//initial function
$(document).ready(function(){
    //prepare month view
    window.disDate = new Date();
    window.months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    window.dateInfo=new getDate(disDate);
    disCalendar(dateInfo.weeks);

    //display event list
    //disEvents();

    //adjust interface
    $("#divEventAdd").hide();
    $("#divLogout").hide();
    $("#tableEventList").hide();
    $("#divEventEdit").hide();
    $("#divEventTags").hide();
    $("#divShare").hide();
    $("#divEventList").hide();
    
    //bind listener
    $("#btnLoginSubmit").click(login);
    $("#btnLogoutSubmit").click(logout);
    $("#btnRegisterSubmit").click(register);
    $("#btnCalBodyPre").click(disPreMonth);
    $("#btnCalBodyNext").click(disNextMonth);
    $("#btnEventAddSubmit").click(addEvent);
    $("#btnDisEventAll").click(disEvents);
    $("#btnShareCal").click(shareCal);
    $("#instructions").click(instruct);
    $("#btnGetUsers").click(getUsers);
});

// calendar library from https://classes.engineering.wustl.edu/cse330/index.php?title=JavaScript_Calendar_Library
(function(){
    Date.prototype.deltaDays=function(c){
        return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c)
    };
    Date.prototype.getSunday=function(){
        return this.deltaDays(-1*this.getDay())
    }
})();

function Week(c){
    this.sunday=c.getSunday();
    this.nextWeek=function(){
        return new Week(this.sunday.deltaDays(7))
    };
    this.prevWeek=function(){
        return new Week(this.sunday.deltaDays(-7))
    };
    this.contains=function(b){
        return this.sunday.valueOf()===b.getSunday().valueOf()
    };
    this.getDates=function(){
        for(var b=[],a=0;7>a;a++)b.push(this.sunday.deltaDays(a));
        return b
    }
}

function Month(c,b){
    this.year=c;
    this.month=b;
    this.nextMonth=function(){
        return new Month(c+Math.floor((b+1)/12),(b+1)%12)
    };
    this.prevMonth=function(){
        return new Month(c+Math.floor((b-1)/12),(b+11)%12)
    };
    this.getDateObject=function(a){
        return new Date(this.year,this.month,a)
    };
    this.getWeeks=function(){
            var a=this.getDateObject(1),b=this.nextMonth().getDateObject(0),c=[],a=new Week(a);
            for(c.push(a);!a.contains(b);)a=a.nextWeek(),c.push(a);return c
        }
    };

//function to get attributes of a date obj
function getDate(date){
    this.fullDate=date;
    this.month = this.fullDate.getMonth();
    //$("#headerCal").text(this.month);
    this.year = this.fullDate.getFullYear();
    let objMonth = new Month(this.year,this.month);
    this.weeks=objMonth.getWeeks();
}   

//the function to display calendar body
function disCalendar(weeks){
    $("#tableCal").empty();
    this.weeks=weeks;
    //display the month and year
    let disMonthFull=months[dateInfo.month];
    $("#headerCal").text(disMonthFull+", "+dateInfo.year);

    //display the headers of the calendar
    let days=["Sunday","Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday"];
    $trHeaders=$("<tr></tr>");
    for (let s=0; s<days.length; s++){
        $th=$("<th></th>").text(days[s]);
        $trHeaders.append($th);
    }
    $("#tableCal").append($trHeaders);

    //display the body of calendar
    for (let i=0; i<this.weeks.length; i++){
        let curWeek=this.weeks[i];
        let $tr=$("<tr></tr>");
        let curDates=curWeek.getDates();
        for (let j=0; j<curDates.length; j++){
            let curDate=curDates[j];
            let $td=$("<td></td>");
            $td.text(curDate.getDate());
            $tr.append($td);
        }
        $("#tableCal").append($tr);
    }
}

//function to display the previous month
function disPreMonth(){
    let disMonth=disDate.getMonth()-1;
    disDate.setMonth(disMonth);
    dateInfo=new getDate(disDate);
    disCalendar(dateInfo.weeks);
}

//function to display the next month
function disNextMonth(){
    let disMonth=disDate.getMonth()+1;
    disDate.setMonth(disMonth);
    dateInfo=new getDate(disDate);
    disCalendar(dateInfo.weeks);
}


//the function to log a user in
function login(){
    const username = document.getElementById("inLoginUsrnm").value; // Get the username from the form
    const password = document.getElementById("inLoginPswd").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 
                'content-type': 'application/json',
                'Accept': 'application/json'
            } 
    })
        .then(response => response.json())
        .then(
            data =>{
                if (data.success){
                    $("#pWelcome").text("Welcome, " + data.username + "!");
                    $("#divLogin").hide();
                    $("#divRegister").hide();
                    $("#divLogout").show();
                    $("#divEventList").show();
                    $("#divEventAdd").show();
                    $("#divEventEdit").show();
                    $("#divEventTags").show();
                    $("#divShare").show();
                    $("#divEventTags").click( () => {
                        var radioValue = $("input[name='tag']:checked").val();
                        if(radioValue){
                            disEventTags(radioValue);
                        }
                    })
                    disEvents();
                    userList = getUsers();
                    window.token = data.token;
                }
                else{
                    alert("You are not logged in due to " + data.message);
                }
            }
        )
        .catch(error => console.error('Error:',error))
        
}

//function to log current user out
function logout(){
    fetch('logout.php', {
        method: "GET"
    })
    alert("You have successully logged out.");
    $("#pWelcome").hide();
    $("#divLogin").show();
    $("#divRegister").show();
    $("#divLogout").hide();
    $("#divEventList").hide();
    $("#divEventAdd").hide();
    $("#divEventEdit").hide();
    $("#divShare").hide();
    $("#inLoginUsrnm").val('');
    $("#inLoginPswd").val('');
    $("#divEventEdit").empty();
    $("#inEventAddTitle").val('');
    $("#inEventAddDate").val('');
    $("#inEventAddTime").val('');
    $("#radioAddTagP").prop("checked", false); 
    $("#radioAddTagH").prop("checked", false); 
    $("#radioAddTagW").prop("checked", false); 
    $("#radioAddTagA").prop("checked", false); 
    $("#radioAddTagB").prop("checked", false); 
    $("#inEventEditTitle").val("");
    $("#inEventEditDate").val("");
    $("#inEventEditTime").val("");
    $("#radioEventEditP").prop("checked", false); 
    $("#radioEventEditH").prop("checked", false); 
    $("#radioEventEditW").prop("checked", false); 
    $("#radioEventEditA").prop("checked", false); 
    $("#radioEventEditB").prop("checked", false); 
}   

//function to create new account
function register(){
    const username = document.getElementById("inRegisterUsrnm").value; // Get the username from the form
    const password = document.getElementById("inRegisterPswd").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password }; 

    fetch("register.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(
        data => {
            if (data.success){
                $("#divRegister").hide();
                alert("You have succesfully signed up. You can now log in.");
            }
        }
    )

     // This the way to print response text in the console log
    //  .then(data => data.text())
    //  .then(text => console.log(text))
 
    .catch(error => console.error('Error:',error))
}        

//the function to add evnets
function addEvent(){
    // to get the variable of the event
    let eventTitle = $("#inEventAddTitle").val();
    let eventDate = $("#inEventAddDate").val();
    let eventTime = $("#inEventAddTime").val();

    // get value of tag radio
    let eventTag = null;
    let radioValue = $("input[name='radioAddTag']:checked").val();
    if(radioValue){
        eventTag = radioValue; 
    }
        // }else{
    //     let eventTag = null;
    // }

    const data={"title": eventTitle, "date": eventDate, "time": eventTime, "tag": eventTag};

    console.log(data);
    
    // to send a post request to php script
    fetch ("add_event.php", {
        method: "POST",
        body:JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(data => data.json())
    .then(response => {
        console.log(response.success);
        alert(response.success);
        $("#inEventAddTitle").val('');
        $("#inEventAddDate").val('');
        $("#inEventAddTime").val('');
        $("#radioAddTagP").prop("checked", false); 
        $("#radioAddTagH").prop("checked", false); 
        $("#radioAddTagW").prop("checked", false); 
        $("#radioAddTagA").prop("checked", false); 
        $("#radioAddTagB").prop("checked", false); 
        radioValue = null;
        disEvents();
    })

    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))

    .catch(error => console.error('Error:',error))

}

function disEvents(){
    const data={};

    fetch ("display_events.php", {
        method: "POST",
        body:JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(data => data.json())
    .then(data => {
        
        if (data.success){
            console.log(data);
            disEventsList(data);
            window.userEvents = data; 
        }
        
    })
    
    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))
     
    .catch(error => console.error('Error:',error))

}

function disEventsList(data){
    // bind the div of event list to a var 
    let divEventList=$("#divEventList");
    // acquire the length of JSON data  
    let listLength=Object.keys(data).length;
    // get the values inside the JSON data and bind it with html elements
    let listKeys=Object.keys(data);
    // to empty the table and then add new table headers
    $("#tableEventList").empty();

    $trHeaders = $("<tr></tr>"); 
    $th1 = $("<th></th>").text("Title");
    $th2 = $("<th></th>").text("Date");
    $th3 = $("<th></th>").text("Time");
    $th5 = $("<th></th>").text("Tag");
    $th4 = $("<th></th>").text("Options");
    $trHeaders.append($th1, $th2, $th3, $th5, $th4);


    $("#tableEventList").append($trHeaders);
    for (x in listKeys){
        let indexData=String(listKeys[x]);

        // acquire data and append to html table
        if (data[indexData]!=true){ // to prevent print the "success" value
            let $tr=$("<tr></tr>").attr("id", "trEventsList"+x);
            let $tdEventTitle= $("<td></td>").text(data[indexData]["event_title"]);//htmlentities()?
            let $tdEventDate= $("<td></td>").text(data[indexData]["event_date"]);
            let $tdEventTime = $("<td></td>").text(data[indexData]["event_time"]);
            let $tdEventTag = $("<td></td>").text(data[indexData]["event_tag"]);
            
            let eventId = data[indexData]["event_id"];  
            let userId = data[indexData]["event_user_id"];
            let eventTitle = data[indexData]["event_title"];
            let eventDate = data[indexData]["event_date"];
            let eventTime = data[indexData]["event_time"];
            let eventTag = data[indexData]["event_tag"];
            

            let $btnEdit = $("<button></button>").text("Edit");
            $btnEdit.attr("id", "btnEditEvent"+eventId);
            $btnEdit.click( () => {
                editEventForm(eventId,userId, eventTitle, eventDate, eventTime, eventTag);
            });
            //$("#btnEditEvent"+eventId).click(editEvent(eventId, userId));

            let $btnDelete = $("<button></button>").text("Delete");
            $btnDelete.attr("id", "btnDeleteEvent"+eventId);
            // $btnDelete.attr("eventId", eventId);
            // $btnDelete.attr("userId", userId);
            $btnDelete.click(() => {
                deleteEvent(eventId, userId);
            });
            // $("#btnDeleteEvent"+eventId).click(deleteEvent(this));
            // $btnDelete.click(deleteEvent(this));
            // let buttonId = "btnDeleteEvent" + eventId;
            // document.getElementById(buttonId).addEventListener("click", deleteEvent(eventId, userId), false);

            let $tdButtons = $("<td></td>");
            $tdButtons.append($btnEdit, $btnDelete);

            $tr.append($tdEventTitle, $tdEventDate, $tdEventTime, $tdEventTag, $tdButtons); 
            
            $("#tableEventList").append($tr);
            
        }
        
    }
    $("#tableEventList").show();
    reloadRadio();
}

function deleteEvent(eventId, userId){
    // let eventID=$("#btnEventList")
    // let $button = button;
    // let eventId= eventId;
    // let userId = ;
    
    // Make a URL-encoded string for passing POST data:
    const data = { 'event_id': eventId, 'user_id': userId, "token": window.token}; 

    fetch("delete_event.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(
        data => {
            console.log(data);
            if (data.success){
                alert("This event has beed deleted.");
                disEvents();
            }
        }
    )
    .catch(error => console.error('Error:',error))
}

function editEventForm(eventId, userId, title, date, time, tag){ ``
    // alert("edit event running");

    // show the table and the current value of event to be editted
    $("#divEventEdit").empty();
    $header = $("<h4></h4>").text("Edit Event");
    $labelTitle = $("<label></label>").text("Title: ");
    $labelDate = $("<label></label>").text("Date: ");
    $labelTime = $("<label></label>").text("Time: ");
    $inputTitle = $("<input></input>").val(title);
    $inputTitle.attr("type", "text");
    $inputTitle.attr("id", "inEventEditTitle");
    $inputDate = $("<input></input>").val(date);
    $inputDate.attr("type", "date");
    $inputDate.attr("id", "inEventEditDate");
    $inputTime = $("<input></input>").val(time);
    $inputTime.attr("type", "time");
    $inputTime.attr("id", "inEventEditTime");
    $button = $("<input></input>");
    $button.attr("id", "btnEventEditSubmit");
    $button.attr("type", "submit");
    $button.attr("value", "Submit");

    // add radio buttons for tags
    let $rb1 = $("<input></input>").attr("type", "radio");
    let $rb2 = $("<input></input>").attr("type", "radio");
    let $rb3 = $("<input></input>").attr("type", "radio");
    let $rb4 = $("<input></input>").attr("type", "radio");
    let $rb5 = $("<input></input>").attr("type", "radio");

    $rb1.attr("id", "radioEventEditP"); 
    $rb1.attr("value", "personal");
    $rb1.attr("name", "radioEventEdit")
    let $label1 = $("<label></label>").text("Personal");
    $rb2.attr("id", "radioEventEditA"); 
    $rb2.attr("value", "academic");
    $rb2.attr("name", "radioEventEdit")
    let $label2 = $("<label></label>").text("Academic");
    $rb3.attr("id", "radioEventEditW"); 
    $rb3.attr("value", "work");
    $rb3.attr("name", "radioEventEdit")
    let $label3 = $("<label></label>").text("Work");
    $rb4.attr("id", "radioEventEditH"); 
    $rb4.attr("value", "holiday");
    $rb4.attr("name", "radioEventEdit")
    let $label4 = $("<label></label>").text("Holiday");
    $rb5.attr("id", "radioEventEditB"); 
    $rb5.attr("value", "birthday");
    $rb5.attr("name", "radioEventEdit")
    let $label5 = $("<label></label>").text("Birthday");

    // acquire value of current tag TODO
    // switch(tag) {
    //     case "personal":
    //       $rb1.prop("checked", true);
    //       break;
    //     case y:
    //       // code block
    //       break;
    //     default:
    //       // code block
    //   }


    $("#divEventEdit").append($header, $labelTitle, $inputTitle, $("<br>"), $labelDate, $inputDate, $("<br>"), $labelTime, $inputTime, $("<br>"), $rb1, $label1, $rb2, $label2, $rb3, $label3, $rb4, $label4, $rb5, $label5, $("<br>"), $button); 
    // $("#inEventEditTitle").val(title);
    // $("#inEventEditDate").val(date);
    // $("#inEventEditTime").val(time);

    $("#btnEventEditSubmit").click(() =>{
        //alert("hi");
        editEvent(eventId, userId);
    });
    
    // display the edit form
    $("#divEventEdit").show();

    
}

function editEvent(eventId, userId){
    let title = $("#inEventEditTitle").val();
    let date = $("#inEventEditDate").val();
    let time = $("#inEventEditTime").val();
    // let tag = $("input[name='radioEventEdit']:checked").val();
    let tag = null;
    let radioValue = $("input[name='radioEventEdit']:checked").val();
    if(radioValue){
        tag = radioValue; 
    }
    const data = { 
        'event_id': eventId, 
        'user_id': userId, 
        "event_title": title, 
        "event_date": date,
        "event_time": time,
        "event_tag": tag,
        "token": window.token
    }; 

    fetch("edit_event.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(
        data => {
            console.log(data);
            if (data.success){
                alert("Your calendar has been edited.");
                console.log(data.success);
                disEvents();
            }
        }
    )

    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))
    
    .catch(error => console.error('Error:',error))
}

function disEventTags(radioValue){
    const data={"tag": radioValue};

    fetch ("display_events_tags.php", {
        method: "POST",
        body:JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(data => data.json())
    .then(data => {
        
        if (data.success){
            console.log(data);
            disEventsList(data);
        }
        
    })
    
    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))
     
    .catch(error => console.error('Error:',error))
}

function reloadRadio(){
    $("#disEventTagP").prop("checked", false); 
    $("#disEventTagH").prop("checked", false); 
    $("#disEventTagW").prop("checked", false); 
    $("#disEventTagA").prop("checked", false); 
    $("#disEventTagB").prop("checked", false);  
}

function getUsers(){
    const data={};

    fetch ("get_users.php", {
        method: "POST",
        body:JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(data => data.json())
    .then(data => {
        
        if (data.success){
            console.log(data);
            
            // create the menu and button
            $("#divShare").empty();
            $menu = $("<select></select>").attr("id", "menuShareCal");
            $("#divShare").append($menu);
            $btn = $("<button></button>").attr("id", "btnShareCal");
            $btn.attr("type", "button");
            $btn.text("Share");
            $("#divShare").append($btn);

            // disEventsList(data); 
            $("#menuShareCal").empty();
            let listLength=Object.keys(data).length;
            // alert(listLength);
            for (let i=0; i<listLength-1; i++){
                // alert (i);
                if (data[i] != true){
                    let $option = $("<option></option>").attr("value", data[i]["user_id"]);
                    //alert(data[i]["user_id"]);
                    //console.log(option);
                    $option.text(data[i]["username"]);
                    $("#menuShareCal").append($option);
                    //console.log($option);
                }
            }
            let sharedUser = $('#menuShareCal option:selected').val();
            $("#menuShareCal").change(
                () => {
                    sharedUser = $('#menuShareCal option:selected').val();
                }  
            )
            // parseInt(sharedUser);
            // alert(sharedUser);
            // $("#btnShareCal").click(
            //     ()=>{
            //         shareCal(sharedUser);
            //     }
            // );
            
            $("#btnShareCal").click( () => {
                shareCal(sharedUser);
            });
            // $("#menuShareCal").empty();
            // alert(sharedUser);
        }
        
    })
    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))
     
    .catch(error => console.error('Error:',error))
}

function shareCal(sharedUser){
    // alert(sharedUser);
    // this is just for debug
    if(Number.isInteger(parseInt(sharedUser))){
        // alert(sharedUser);
        // Make a URL-encoded string for passing POST data:
        const data = window.userEvents;
        data["user_id"] = sharedUser;
        // alert(data);
        console.log(data);

        fetch("share_cal.php", {
                method: 'POST',
                body: JSON.stringify(data),
                // body: data, 
                headers: { 
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                } 
        })
            .then(response => response.json())
            .then(
                data =>{
                    if (data.success){
                        alert("Your calendar has been shared. ");
                        sharedUser = null;
                    }
                }
            )
            // This the way to print response text in the console log
            // .then(data => data.text())
            // .then(text => console.log(text))
            .catch(error => console.error('Error:',error))
    }
}
function instruct(){
    alert("To add a group event, first add the event to your individual calendar, then use the dropdown to share with as many users as you'd like! EZ as pi! :D");
}