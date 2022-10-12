let allTimezoneCities=require('ashritha_weatherdata');
const fs=require('fs');
//listen to parent message.
process.on('message',(message)=>{
  try{
    let messageApiName=message.messageName;
    // throw error when there is no valid messageName.
    if(!messageApiName){
      let date=new Date();
      throw new Error("Error: No api message, time:"+date.toLocaleTimeString()+".");
    }
    else{
      switch (messageApiName){
        // return all city data to parent js, if all the input is correct.
        case 'all-timezone-cities':
          let cityData = allTimezoneCities.allTimeZones();
          process.send(cityData);
          break;
        case 'city':
          // throw error when there is no valid messageBody.
          if(!message.messageBody){
            let date=new Date();
            throw new Error("Error: No valid city name, time:"+date.toLocaleTimeString()+".");
          }
          // return the livetime of city to parent js, if all the input is correct.
          else if(message.messageBody.cityName){
            let cityLivetimeData=allTimezoneCities.timeForOneCity(message.messageBody.cityName);
            process.send(cityLivetimeData);
          }
          break;
        case 'hourly-forecast':
          // throw error when there is no valid messageBody.
          if(!message.messageBody){
            let date=new Date();
            throw new Error("Error: No valid input data, time:"+date.toLocaleTimeString()+".");
          }
          // throw error when there is no valid cityDTN.
          if(!message.messageBody.cityDataTimeName){
            let date=new Date();
            throw new Error("Error: No valid cityDTN, time:"+date.toLocaleTimeString()+".");
          }
          // throw error when there is no valid hour.
          if(!message.messageBody.hour){
            let date=new Date();
            throw new Error("Error: No valid hour, time:"+date.toLocaleTimeString()+".");
          }
          // throw error when there is no valid city data.
          if(!message.messageBody.allCityData){
            let date=new Date();
            throw new Error("Error: No valid city data, time:"+date.toLocaleTimeString()+".");
          }
          // return the future hours live temperature to parent js, if all the input is correct.
          else if(message.messageBody.cityDataTimeName&&message.messageBody.hour&&message.messageBody.allCityData){
      
            let cityLiveTemp=allTimezoneCities.nextNhoursWeather(message.messageBody.cityDataTimeName,message.messageBody.hour,message.messageBody.allCityData);
            process.send(cityLiveTemp);
          }
          break;
        // throw error when there is no valid api message.
        default:
          let date=new Date();
          throw new Error("Error: No valid api message, time:"+date.toLocaleTimeString()+".");
      }
    }
  }
  //catch the thrown errors and log it in logger file.
    catch(error){
      let errorData=error.message+"\n";
      fs.appendFile("logger.txt",errorData,()=>{
      });
    }
  
});