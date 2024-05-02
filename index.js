const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser'); 
const qs=require('qs')
const path=require('path')

const app = express();
app.set('view engine', 'pug');
//app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));

const private_app_access = 'private_app_access_token';


app.get("/", async (req, res) => {
    const contact = 'https://api.hubspot.com/crm/v3/objects/contacts?properties=email&properties=firstname&properties=lastname&properties=mobilephone&limit=100';
    const headers = {
        'Authorization': `Bearer ${private_app_access}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(contact, { headers });
        const result = response.data.results;
        console.log(result);
        const data=result;
        res.render("homepage", { data: data });
    } catch (error) {
        console.error("Getting an error", error);
        res.status(500).send("Error in fetching data from the API");
    }
});

// Creating a new contact here 
app.post("/update-cobj", async (req, res) => { 
    const { email, firstname, lastname, phoneno } = req.body;
    const axios = require('axios');
                let data = JSON.stringify({
                "properties": {
                    "email": email,
                    "firstname": firstname,
                    "lastname": lastname,
                    "mobilephone":phoneno
                }
                });

                let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.hubapi.com/crm/v3/objects/contacts',
                headers: { 
                    'authorization': `Bearer ${private_app_access}`, 
                    'content-type': 'application/json'
                },
                data : data
                };

                axios.request(config)
                .then((response) => {
                console.log(JSON.stringify(response.data));
                console.log("Data has been created successfully!\n",data);
                res.redirect("/");
                })
                .catch((error) => {
                console.log(error);
                res.send("Getting an error to create new data record",error);
                });

});

// Updating a contact data by ID
app.get("/update-cobj/:id", async (req, res) => { 
    const id = req.params.id;
    const contactUpdateUrl = `https://api.hubspot.com/crm/v3/objects/contacts/${id}`;
    const headers = {
        Authorization: `Bearer ${private_app_access}`,
        'Content-Type': 'application/json'
    };

    const updatedValue = {
        properties: {
            firstname: "Vishal",
            lastname: "kumar",
            email: "vishalkumar8877@gmail.com",
            mobilephone: "+999999999999"
        }
    };

    try {
        const response = await axios.patch(contactUpdateUrl, updatedValue, { headers });
        const data = response.data;
        console.log("Contact has been updated successfully!", data);
        res.redirect("/");
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).send("Error updating contact: " + error.message);
    }
});

// Deleting a contact data by ID
app.get("/delete/:id", async (req, res) => { 
    const id = req.params.id;
    const contact = `https://api.hubapi.com/crm/v3/objects/contacts/${id}`; 
    const headers = {
        Authorization: `Bearer ${private_app_access}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.delete(contact, { headers });
        const data = response.data;
        console.log("Data has been Deleted Successfully!");
        res.redirect("/");
    } catch (error) {
        console.error("Getting an Error to delete the data ", error);
        res.status(500).send("Getting an Error to delete the data " + error.message);
    }
});

// Rendering the updates.pug here
app.get("/update-form", (req, res) => {
    res.render("updates"); 
});

app.listen(3000, () => {
    console.log("Output is running on: localhost:3000");
});
