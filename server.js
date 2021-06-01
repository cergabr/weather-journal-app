/* Empty endpoint for all routes */
projectData = {};

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */
// Configuring express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

// Cors package for Cross-origin Resource Sharing
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

const port = 8000;
const server = app.listen(port, ()=>{console.log(`server running on localhost: ${port}`)});

const fetch = require("node-fetch");

const readApiKeyId = async (url)=> {
    const res = await fetch(url);
    try{
        return await res.json();
    }catch(error){
        console.error("Unable to fetch data ",error);
    } 
}

readApiKeyId("http://localhost:8000/openWeatherID.json")
.then(data=>{
    projectData.apiKeyId=data;
    console.log(projectData);
});

app.get('/apiKeyId',(req,res)=>{res.send(projectData.apiKeyId)});

app.get('/all', (req,res)=>{res.send(projectData)});

projectData.weatherData=[];
app.post('/add',(req, res)=>{
    const newEntry = {
        city: req.body.city,
        date: req.body.date,
        temperature: req.body.temp,
        icon: req.body.icon,
        weather: req.body.weather,
        userResponse: req.body.userResponse
    }
    projectData.weatherData.push(newEntry);
    res.send(projectData);
    console.log(projectData);
});
