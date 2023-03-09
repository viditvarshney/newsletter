const bodyParser = require("body-parser");
const express = require("express");

const https = require("https");

const app = express();

app.use(express.static("public")); // This is used to use the static files. Assume you are on the public folder then give hte relative path.
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.emailId;

    // data to be send mailchimp server for add new member to the list.
    const data = {
        "members":[
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName

                }
            }

        ]
    };
    const JSONdata = JSON.stringify(data);
    const listID = "5ab97b9494";
    const url = "https://us19.api.mailchimp.com/3.0/lists/"+listID;

    const options = { // specify the method and the authhentication via api key.
        method: "POST",
        auth:"anyusername:eee8f511cabff138896974ae1e0a8262-us19"
    }


    const request = https.request(url,options,function(response){  // requesting (sending) data to mailchimp

        if (response.statusCode == 200) {
            res.sendFile(__dirname +"/success.html");

        } else {
            res.sendFile(__dirname +"/failure.html");
        }
        // response.on("data", function(data){
        //     console.log(JSON.parse(data));
        // })
    })

    request.write(JSONdata); // after authentication writing data to mialchimp
    request.end();

});


// failure page route

app.post("/failure", function(req,res){
    res.redirect("/");
});




app.listen(3000, function(err){
    if (err) console.log("Error in setup");
    console.log("server is Listening on 3000...");
})


// apikey
// eee8f511cabff138896974ae1e0a8262-us19

// list id
// 5ab97b9494