
  /**
   * fetch api to get live city data. 
   *
   * @return {object} city data 
   */
  function getcityData() {
    
      let dataOfAllCities = new Promise(async (resolve, reject) => {
        let cityData = await fetch("http://localhost:8080/all-timezone-cities",
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
          }
        );
        let data=cityData.json();
        resolve(data);
      });
      return dataOfAllCities;
    }
  /**
   * fetch api to display live time for each city.
   *
   * @param {*} city city name 
   * @return {object} city live time  
   */
  async function LiveTimeForCity(city) {
    try{
      let TimeData= await fetch(`http://localhost:8080/city/?city=${city}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      return TimeData;
    }
    catch(error){
      console.error(error);
    }
  }

  /**
   *fetch api and get next 5 hrs live temperature of each city.
   *
   * @param {*} city city name fetched when changing the datalist.
   * @return {object} city live temperature. 
   */
  async function getCityLiveTemp(city) {
  
    var selectedCity=document.getElementById(`${city}`).value;
    selectedCity=selectedCity.toLowerCase();
    //change the cityname according to the name present in datalist.
    switch (selectedCity){
      case 'newyork':
        selectedCity="NewYork";
        break;
      case 'losangeles':
        selectedCity="LosAngeles";
        break;
      case 'bangkok':
        selectedCity="BangKok"
        break;
      case 'brokenhill':
        selectedCity="BrokenHill"
        break;
      default:
        selectedCity=selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
    }
    // return all city data to parent js, if all the input is correct.
    let fetchDataFromAPI = await LiveTimeForCity(selectedCity);
    let fetchData = await fetchDataFromAPI.json();
    fetchData.hours=5;
    let fetchDataFromAPI1 = await weatherForNextNHours(fetchData);
    
    async function weatherForNextNHours(data) {
      try{
        let weatherData= await fetch("http://localhost:8080/hourly-forecast",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body:
            JSON.stringify(data),
          }
        );
      
      let fetchData1 = await weatherData.json();
      return fetchData1.temperature;
        }
      catch(error){
        console.error(error);
      }
    }
    return fetchDataFromAPI1;
  }
    

  export { getCityLiveTemp,getcityData};