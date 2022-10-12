// import the required modules.
// declare constants.
const express = require("express");
const {fork}=require('child_process');
const app = express();
let startTime = new Date();
let dayCheck = 14400000;
let weatherResult = [];
let bodyparser=require("body-parser");

//render html file on default.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//import body parser to parse incoming strings or arrays in a middleware.
app.use(bodyparser.urlencoded({extended : false}));

// convert the returned object into json.
app.use(bodyparser.json());

//render all the files in that directory.
app.use(express.static(__dirname));

// render live data of each city at regular intervals.
app.get("/all-timezone-cities", (req, res) => {
  let currentTime = new Date();
  // render live data if the time exceeds 4 hours.
  if (currentTime - startTime > dayCheck) {
    startTime = new Date();
    const child_to_fetch_cityData=fork('./child.js');
    // send message to child node.
    child_to_fetch_cityData.send({messageName:'all-timezone-cities',messageBody:{}});
    // listen to child node.
    child_to_fetch_cityData.on('message',(cityData)=>{
        weatherResult=cityData;
        res.send(weatherResult);
      });
  }
  //render live data for the first time.
  else {
    if (weatherResult.length === 0) {
      const child_to_fetch_cityData=fork('./child.js');
      // send message to child node.
      child_to_fetch_cityData.send({messageName:'all-timezone-cities',messageBody:{}});
      // listen to child node.
      child_to_fetch_cityData.on('message',(cityData)=>{
        weatherResult=cityData;
        res.send(weatherResult);
      });
    }
    else{
      res.json(weatherResult);
    }
  }
});

// render live time of each city.
// append the api with "/city" string as "/" is already used to render html file on default.
// req.query is used to fetch the query in api, which is then passed as a argument to a function.
app.get('/city', function (req, res) {
  const child_to_fetch_liveTime=fork('./child.js');
  // send message to child node.
  child_to_fetch_liveTime.send({messageName:"city",messageBody:{cityName:req.query.city}})
  // listen to child node.
  child_to_fetch_liveTime.on('message',(cityLivetimeData)=>{
        let timeForOneCity=cityLivetimeData;
        res.send(timeForOneCity);
      });
});

//update future hours live temperature for each city.
app.post('/hourly-forecast',function (req, res) {
  let cityDTN=req.body.city_Date_Time_Name;
  let hours=req.body.hours;
  const child_to_fetch_liveTemperature=fork('./child.js');

  if(cityDTN && hours){
    // listen to child node.
      child_to_fetch_liveTemperature.on('message',(cityLiveTemp)=>{
      let cityFutureHrsTemp=cityLiveTemp;
      res.send(cityFutureHrsTemp);
    });
    // send message to child node.
    child_to_fetch_liveTemperature.send({messageName:"hourly-forecast",messageBody:{cityDataTimeName:cityDTN,
      hour:hours,
      allCityData:weatherResult
    }})

  }
  else{
    res
    .status(404)
    .json({Error: "Not a valid End Point"});
  }
});

//handle all the requests that are not handled by any other route handler.
//hanlder will redirect the user to an error page.
app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});

// listen to port 8080.
app.listen(8080, () => {
  console.log("Application started and Listening on port 8080");
});
