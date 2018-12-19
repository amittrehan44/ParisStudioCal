const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const twilio = require('twilio');
const accountSid = functions.config().twilio.sid
const authToken  = functions.config().twilio.token
const client = new twilio(accountSid, authToken);
const twilioNumber = '+16043324442'   // your twilio phone number


/// start cloud function
/*exports.textStatus = functions.database
       .ref('/appointments/{key}/phone')
       .onUpdate(event => {
           const orderKey = event.params.key
           return admin.database()
                       .ref(`/appointments/${orderKey}`)
                       .once('value')
                       .then(snapshot => snapshot.val())
                       .then(appointment => {
                           const name = appointment.name
                           const phoneNumber = appointment.phone
                           if (!validE164(phoneNumber)) {
                               throw new Error('number must be E164 format!')
                           }
                           const textMessage = {
                               body: `Hello kiddan: ${name}`,
                               to: phoneNumber,  // Text to this number
                               from: twilioNumber // From a valid Twilio number
                           }
                           return client.messages.create(textMessage)
                       })
                       .then(message => console.log(message.sid, 'success'))
                       .catch(err => console.log(err))
       });
*/



//Test Functions

/* 
exports.helloworld = functions.database
    .ref('/appointments/{key}')
    .onWrite(event => {
        const post = event.data.val()
        if (post.sanitized){
            return
        }
        console.log("Kiddann"+ post.name )
        post.sanitized = true
    })
*/

//Send SMS on create of start time or create of new appointment
exports.createAppointment = functions.database
       .ref('/appointments/{key}/start')
       .onCreate(event => {
           const orderKey = event.params.key
           return admin.database()
                       .ref(`/appointments/${orderKey}`)
                       .once('value')
                       .then(snapshot => snapshot.val())
                       .then(appointment => {
                           const name = appointment.name
                           const start = DisplayCurrentTime(appointment.start)
                           const phoneNumber = appointment.phone
                           if (!validE164(phoneNumber)) {
                               throw new Error('number must be E164 format!')
                           }
                           const textMessage = {
                               //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                               body: `You have booked an appointment on ${start} - Paris Studio - Lougheed Mall. If you need to reschedule please call (604) 420-0151`,
                               //to: +17787792744,
                               to: phoneNumber,  // Text to this number
                               from: twilioNumber // From a valid Twilio number
                           }
                           console.log('Sending messge to' + name + 'on phone number' + phoneNumber + 'on ' + start )
                            return client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                                     .catch(err => console.log(err))
                          
                       })
                       
       });

//send sms on update start time
exports.onUpdateAppointment = functions.database
       .ref('/appointments/{key}/start')
       .onUpdate(event => {
           const orderKey = event.params.key
           return admin.database()
                       .ref(`/appointments/${orderKey}`)
                       .once('value')
                       .then(snapshot => snapshot.val())
                       .then(appointment => {
                           const name = appointment.name
                           const start = DisplayCurrentTime(appointment.start)
                           const phoneNumber = appointment.phone
                           if (!validE164(phoneNumber)) {
                               throw new Error('number must be E164 format!')
                           }
                           const textMessage = {
                               //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                               body: `You have booked an appointment on ${start} - Paris Studio - Lougheed Mall. If you need to reschedule please call (604) 420-0151`,
                               //to: +17787792744,
                               to: phoneNumber,  // Text to this number
                               from: twilioNumber // From a valid Twilio number
                           }
                           console.log('Sending messge to' + name + 'on phone number' + phoneNumber + 'on ' + start )
                            return client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                                     .catch(err => console.log(err))
                          
                       })
                       
       });


 //OnDelete
 
 //Send SMS on create of start time or create of new appointment
exports.onDeleteAppointment = functions.database
.ref('/appointments/{key}')
.onDelete(event => {
    const orderKey = event.params.key
    var before = event.data.previous.val();
    var name = before.name;
    var phoneNumber = before.phone;
    var service = before.service;
    var chair = before.chair;
    var start = DisplayCurrentTime(before.start)
    var copy = []
    // console.log(orderKey);
    // console.log(name);
    // console.log(phoneNumber);
    // console.log(start);
    // console.log(chair);
    // console.log(service);
    // console.log(service.length);
    // console.log(service[0]["name"]);
    //console.log("*********");
    for(let i=0; i<service.length; i++){
        copy.push(service[i]["name"])
    }
    var allServices = copy.join();
   
    
    const textMessage = {
                            //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                            body: `Appointment deleted for ${name} on ${start} phone: ${phoneNumber} Service: ${allServices}   - Paris Studio`,
                            to: +17787792744,
                            //to: phoneNumber,  // Text to this number
                            from: twilioNumber // From a valid Twilio number
                        }
                        console.log('Delete Appointment: Sending messge to Amit for ' + name + ' on phone number ' + phoneNumber + ' on ' + start + ' phone ' +phoneNumber+ ' service: ' + allServices )
                         client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                                  .catch(err => console.log(err))

    
    const textMessage2 = {
                            //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                            body: `Appointment deleted for ${name} on ${start} phone: ${phoneNumber} Service: ${allServices}   - Paris Studio`,
                            to: +16043077549,
                            //to: phoneNumber,  // Text to this number
                            from: twilioNumber // From a valid Twilio number
                        }
                        console.log('Delete Appointment: Sending messge to Bunty for ' + name + ' on phone number ' + phoneNumber + ' on ' + start + ' phone ' +phoneNumber+ ' service: ' + allServices )
                       return client.messages.create(textMessage2).then(message => console.log(message.sid, 'success'))
                                                                                                          .catch(err => console.log(err))                                                              
    
    

    // return admin.database()
    //             .ref(`/appointments/${orderKey}`)
    //             .once('value')
    //             .then(snapshot => snapshot.val())
    //             .then(appointment => {
    //                 const name = appointment.name
    //                 const start = DisplayCurrentTime(appointment.start)
    //                 const phoneNumber = appointment.phone
    //                 if (!validE164(phoneNumber)) {
    //                     throw new Error('number must be E164 format!')
    //                 }
    //                 const textMessage = {
    //                     //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
    //                     body: `Appointment deleted for ${name} on ${start} - Paris Studio`,
    //                     to: +17787792744,
    //                     //to: phoneNumber,  // Text to this number
    //                     from: twilioNumber // From a valid Twilio number
    //                 }
    //                 console.log('Sending messge to' + name + 'on phone number' + phoneNumber + 'on ' + start )
    //                  return client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
    //                                                           .catch(err => console.log(err))
                   
    //             })
                
});

const ref = admin.database().ref()
//send sms daily at 6PM
/*exports.dailySMSReminder = functions.https.onRequest((req, res) => {
    const currentTime = new Date().getTime()
    const names = []

    ref.child('appointments').orderByChild('start').startAt(currentTime).once('value')
    .then(snap => {
        snap.forEach(childSnap => {
            const name = childSnap.val().name
            names.push(name)
        })
        return names
    }).then(names => {
        console.log('Appointments for tomorrow: ' + names.join())
        return names.join().then(() => {
            res.send('SMS Sent')
        }).catch(error => {
            res.send(error)
        })
    })
})

*/

exports.dailySMSReminder = functions.https.onRequest((req, res) => {
    var currentDate = new Date()
    // change time in PST
    currentDate.setHours(currentDate.getHours() - 8)

    //Add number of hours to change date or to the point when client wants to send reminders
    // Example if at 6PM then and 6 hours to current date to make it next date
    currentDate.setHours(currentDate.getHours() + 14)
    const getDate = currentDate.toDateString();

    // const names = []

    ref.child('appointments').once('value')
    .then(snap => {
        snap.forEach(childSnap => {
            const name = childSnap.val().name
            const start1 = childSnap.val().start
            var date = new Date(start1)
            // change time in PST
			//Daylight Saving Changes
			////for PST nov to march - 8 and for PDT mar to nov -7
            date.setHours(date.getHours() - 8)
            const getStartDate = date.toDateString()

          

            if (getStartDate == getDate) {
                //names.push(name)
                const start = DisplayCurrentTime(childSnap.val().start)
                const phoneNumber1 = childSnap.val().phone
                if (!validE164(phoneNumber1)) {
                    throw new Error('number must be E164 format!')
                }
                console.log('SMS will be sent to ' + name + ' on phone number' + phoneNumber1 + 'on ' + start)

                const textMessage = {
                    //body: `Hello ${name}, you have an Appointment tomorrow on ${start} - Paris Studio - Lougheed Mall, If you need to reschedule please call (604) 420-0151`,
                    body: `You have an Appointment booked on ${start} - Paris Studio - Lougheed Mall. If you need to reschedule please call (604) 420-0151`,
                    //to: +17787792744,
                    to: phoneNumber1,  // Text to this number
                    from: twilioNumber // From a valid Twilio number
                }
                console.log('Sending messge to' + name + 'on phone number' + phoneNumber1 + 'on ' + start)
                 client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                          .catch(err => console.log(err))
                
            }
        })
    }).then(() => {
            res.send('SMS Sent')
            })
            .catch(error => {
                res.send(error)
            })

});




/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}

//return date and time
function DisplayCurrentTime(date1) {
    

    //console.log(date1.substring(35, 56));
    var dayLightHours = 7;
    if (date1.substring(35, 56) == "Pacific Daylight Time" || date1.substring(35, 38) == "PDT") {

        dayLightHours = 7;
        console.log("inside daylight time if statement and dayLightHours = 7");
    } else {
        dayLightHours = 8;
        console.log("inside pacific standard time if statement nd dayLightHours = 8");
    }

    //console.log(dayLightHours);
    //console.log(date1);
    var date = new Date(date1);
    console.log(date);
    //Daylight Saving Changes
	////for PST nov to march - 8 and for PDT mar to nov -7
    date.setHours(date.getHours() - dayLightHours);
   // console.log(date);
    var getDate = date.toDateString();
    //console.log(getDate);
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    //console.log(hours);
    //console.log(am_pm);
    hours = hours < 10 ? "0" + hours : hours;
    //console.log(hours);
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = getDate + " at " + hours + ":" + minutes + " " + am_pm;
    //time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    //console.log(time);
    return time;
}


//send sms on update to Bunty and Amit
exports.buntyUpdateAppointment = functions.database
       .ref('/appointments/{key}')
       .onUpdate(event => {
           const orderKey = event.params.key
           var before = event.data.previous.val();
           var after = event.data.val();

           const newName = after.name
           const oldName = before.name

           const newPhone = after.phone
           const oldPhone = before.phone

            const newStart =  DisplayCurrentTime(after.start)
            const oldStart =  DisplayCurrentTime(before.start)

            const newChair = after.chair
            const oldChair = before.chair

            const newService = getServicesJoin(after.service);
            const oldService = getServicesJoin(before.service);

            

            const textMessage = {
                //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                body: `Appointment Updated: OldValues: ${oldName}(${oldPhone}) on ${oldStart} Service: ${oldService}  To NewValue: ${newName}(${newPhone}) on ${newStart} Service: ${newService}`,
                to: +17787792744,
                //to: phoneNumber,  // Text to this number
                from: twilioNumber // From a valid Twilio number
            }
            console.log('Appointment updated for ' + oldName + ' on phone number ' + oldPhone + ' on ' + oldStart + ' service: ' + oldService + ' To NewValue ' + newName + ' on phone number ' + newPhone + ' on ' + newStart + ' service: ' + newService )
             client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                      .catch(err => console.log(err))


            const textMessage2 = {
                //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                body: `Appointment Updated: OldValues: ${oldName}(${oldPhone}) on ${oldStart} Service: ${oldService}  To NewValue: ${newName}(${newPhone}) on ${newStart} Service: ${newService}`,
                to: +16043077549,
                //to: phoneNumber,  // Text to this number
                from: twilioNumber // From a valid Twilio number
            }
            console.log('Appointment updated for ' + oldName + ' on phone number ' + oldPhone + ' on ' + oldStart + ' service: ' + oldService + ' To NewValue ' + newName + ' on phone number ' + newPhone + ' on ' + newStart + ' service: ' + newService )
           return client.messages.create(textMessage2).then(message => console.log(message.sid, 'success'))
                                                                                              .catch(err => console.log(err))                                                              

        
                       
       });

       //send sms on create to Bunty and Amit
       //Send SMS on create of start time or create of new appointment
exports.buntyCreateAppointment = functions.database
.ref('/appointments/{key}/start')
.onCreate(event => {
    const orderKey = event.params.key
    return admin.database()
                .ref(`/appointments/${orderKey}`)
                .once('value')
                .then(snapshot => snapshot.val())
                .then(appointment => {
                    const name = appointment.name
                    const start = DisplayCurrentTime(appointment.start)
                    const phoneNumber = appointment.phone
                    const service = getServicesJoin(appointment.service);
                    // if (!validE164(phoneNumber)) {
                    //     throw new Error('number must be E164 format!')
                    // }
                    const textMessage = {
                        //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                        body: `Appointment Created for ${name}(${phoneNumber}) on ${start} service: ${service} - Paris Studio`,
                        to: +17787792744,
                        //to: phoneNumber,  // Text to this number
                        from: twilioNumber // From a valid Twilio number
                    }
                    console.log('Sending messge to Amit for: ' + name + ' on phone number: ' + phoneNumber + ' on ' + start + 'service: ' + service )
                    client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                              .catch(err => console.log(err))
                   

                    const textMessage2 = {
                        //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                        body: `Appointment Created for ${name}(${phoneNumber}) on ${start} service: ${service} - Paris Studio`,
                        to: +16043077549,
                        //to: phoneNumber,  // Text to this number
                        from: twilioNumber // From a valid Twilio number
                    }
                    console.log('Sending messge to Bunty for: ' + name + ' on phone number: ' + phoneNumber + ' on ' + start + 'service: ' + service )
                    return client.messages.create(textMessage2).then(message => console.log(message.sid, 'success'))
                                                                                                      .catch(err => console.log(err))

                })
                
});


    function getServicesJoin(servicesObj) {
        var copy = [];
        for(let i=0; i<servicesObj.length; i++){
            copy.push(servicesObj[i]["name"])
        }
        return copy.join();
    }