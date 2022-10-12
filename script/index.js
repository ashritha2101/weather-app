/* The code below will dynamically change the top container content to
show the weather information for the user preferred selected city */

/* import a nil function from utility.js */
import { updateUIWithGivenAttributeValue } from './utility.js';

import { getCityLiveTemp, getcityData } from './weatherdata.js';

const CURRENTTIMELABEL = "Now";
var interval;
let selectedCityData;
let updateCardDetails;
let data = {};
//enter cities in the datalist.
( async function () {
  setInterval(defaultCityDisplay,1.262e+11);
  async function defaultCityDisplay(){
    let fetchDataFromAPI = await getcityData();
    let fetchData = await fetchDataFromAPI;
    await fetchData.forEach((element) => {
      data[element.cityName.toLowerCase()] = element;
    });
    const cities = [];
    /* loop to enter each value of city inside cities array  */
    for (var i = 0; i < Object.keys(data).length; i++) {
      cities.push(data[Object.keys(data)[i]].cityName);
    }
    var datalist = document.getElementById('city-selector');
    /* loop to make option for datalist with each value of cities array   */
    cities.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item;
      datalist.appendChild(option);
    });
    updateSelectedCityBasedOnInput();
    updateCityCardDataOnClick();
   
  }
  defaultCityDisplay();
})();


/**
 * bind variables and get functions
 * @class updateSelectedCityData 
 */
class updateSelectedCityData {
  constructor(cityselected) {
    if (data.hasOwnProperty(cityselected)) {
      this.cityselected = cityselected;
      this.cityName = data[cityselected].cityName;
      this.dateAndTime = data[cityselected].dateAndTime;
      this.timeZone = data[cityselected].timeZone;
      this.temperature = data[cityselected].temperature;
      this.humidity = data[cityselected].humidity;
      this.precipitation = data[cityselected].precipitation;

    }

    this.getSelectedCity = function () {
      return this.cityselected;
    };

    this.getCityName = function () {
      return this.cityName;
    };
    this.getdateAndTime = function () {
      return this.dateAndTime;
    };
    this.gettimeZone = function () {
      return this.timeZone;
    };
    this.gettemperature = function () {
      return this.temperature;
    };
    this.gethumidity = function () {
      return this.humidity;
    };
    this.getprecipitation = function () {
      return this.precipitation;
    };
   
  }

  /**
   *fetch live date and time for each input.
   *
   * @memberof updateSelectedCityData
   */
  updateDateTimeBasedOnInput() {
    function display() {

      var time = new Date().toLocaleString("en-US", {
        timeZone: selectedCityData.gettimeZone(),
      });
      var day = new Date(time).getDate();
      day = day < 10 ? '0' + day : day;
      var month = new Date(time).toLocaleString("en-US", { month: 'short' });
      var year = new Date(time).getFullYear();
      var hour = new Date(time).getHours();
      var min = new Date(time).getMinutes();
      var sec = new Date(time).getSeconds();
      var ampm;
      var update = selectedCityData.updateHourMinSecBasedOnInput(ampm, hour, min, sec);

      updateUIWithGivenAttributeValue("citydate", "innerHTML", `${day}-${month}-${year}`);
      updateUIWithGivenAttributeValue("citytimemin", "innerHTML", `${update.hour}:${update.min}:`);
      updateUIWithGivenAttributeValue("citytimesec", "innerHTML", `${update.sec}`);
      updateUIWithGivenAttributeValue("citytimeimg", "src", `./assets/${update.ampm.toLowerCase()}State.svg`);
      var hours = hour;
      selectedCityData.updateHrsForFutureHrBasedOnInput(hours);
    }
    clearInterval(interval);
    interval = setInterval(display, 1);

  }

  /**
   *set nil image and text for an invalid city input.
   *
   * @memberof updateSelectedCityData
   */
  setNilForInvalidCitySelection() {
    updateUIWithGivenAttributeValue("icon", "src", `./assets/warning.svg`);
    updateUIWithGivenAttributeValue("tempc", "innerHTML", "Nil");
    updateUIWithGivenAttributeValue("temphumidity", "innerHTML", "Nil");
    updateUIWithGivenAttributeValue("tempf", "innerHTML", "Nil");
    updateUIWithGivenAttributeValue("degree", "innerHTML", "Nil");
    updateUIWithGivenAttributeValue("imgcloud", "src", `./assets/warning.svg`);
    updateUIWithGivenAttributeValue("nowtemp", "innerHTML", "Nil");
    updateUIWithGivenAttributeValue("citydate", "innerHTML", "Nil");
    updateUIWithGivenAttributeValue("citytimemin", "innerHTML", `Nil:Nil:`);
    updateUIWithGivenAttributeValue("citytimesec", "innerHTML", "Nil");
    updateUIWithGivenAttributeValue("citytimeimg", "src", `./assets/warning.svg`);
    /* change the next 5 hours to nil  */
    for (let i = 1; i < 6; i++) {
      updateUIWithGivenAttributeValue(`hour${i}`, "innerHTML", "Nil");
    }

    updateUIWithGivenAttributeValue('now', "innerHTML", "Nil");
    /* change the next 5 hours icon based on temp to nil  */
    for (var i = 0; i < 5; i++) {
      updateUIWithGivenAttributeValue(`imgcloud${i + 1}`, "src", `./assets/warning.svg`);
    }
    /* change the next 5 hours temp to nil  */
    for (var i = 0; i < 5; i++) {
      updateUIWithGivenAttributeValue(`temp${i + 1}`, "innerHTML", "Nil");
    }
    alert("Please enter a valid city!");
    updateUIWithGivenAttributeValue("percentage-color", "innerHTML", "");
    updateUIWithGivenAttributeValue("percentage-color-1", "innerHTML", "");

  }

  /**
   *change icon of preferred city.
   *
   * @memberof updateSelectedCityData
   */
  updateIconBasedOnInput() {
    updateUIWithGivenAttributeValue("icon", "src", `./assets/${selectedCityData.getSelectedCity()}.svg`);
  }

  /**
   *update future hours time according the input city time.
   *
   * @param {*} hours live hour of each city
   * @memberof updateSelectedCityData
   */
  updateHrsForFutureHrBasedOnInput(hours) {
    for (let i = 1; i < 6; i++) {
      if (hours < 11) {
        updateUIWithGivenAttributeValue(`hour${i}`, "innerHTML", `${parseInt(hours) + 1}AM`);
      }
      else if (hours == 11) {
        updateUIWithGivenAttributeValue(`hour${i}`, "innerHTML", `${parseInt(hours) + 1}PM`);
      }
      else if (hours > 23) {
        updateUIWithGivenAttributeValue(`hour${i}`, "innerHTML", `${parseInt(hours) - 23}AM`);
      }
      else if (hours == 23) {
        updateUIWithGivenAttributeValue(`hour${i}`, "innerHTML", `${parseInt(hours) - 11}AM`);
      }
      else {
        updateUIWithGivenAttributeValue(`hour${i}`, "innerHTML", `${parseInt(hours) - 11}PM`);
      }
      hours++;
    }
    updateUIWithGivenAttributeValue("now", "innerHTML", `${CURRENTTIMELABEL}`);
  }

  /**
   *update exact time of each city but converting it to 12 hour clock.
   *
   *@param {ampm} am,pm of each city
   * @param {hour} hour hour of each city
   * @param {min} min min of each city
   * @param {sec} sec sec of each city
   * @memberof updateSelectedCityData
   */
  updateHourMinSecBasedOnInput(ampm, hour, min, sec) {
    ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;

    var prefixzeroaddedhour = selectedCityData.prefixZero(hour);
    var prefixzeroaddedmin = selectedCityData.prefixZero(min);
    var prefixzeroaddedsec = selectedCityData.prefixZero(sec);
    return {
      hour: prefixzeroaddedhour.timePart,
      min: prefixzeroaddedmin.timePart,
      sec: prefixzeroaddedsec.timePart,
      ampm: ampm
    };
  }

  /**
   *add prefix zero if it is a single digit.
   *
   * @param {*} timePart
   * @return {time} timepart zero prefixed hour,sec,min
   * @memberof updateSelectedCityData
   */
  prefixZero(timePart) {
    timePart = timePart < 10 ? '0' + timePart : timePart;

    return {
      timePart: timePart,
    };
  }

  /**
   *update temperature, humidity and precipitation of each selected city.
   *
   * @memberof updateSelectedCityData
   */
  updateTempBasedOnInput() {
    var tempInCelsius = selectedCityData.gettemperature();
    // calculate fahrenheit.
    function calculateFahForUpdatedTempValue() {
      return Math.round(parseInt(tempInCelsius) * 9 / 5 + 32);
    }
    var tempInFahrenheit = calculateFahForUpdatedTempValue();
    var curtemp = selectedCityData.gettemperature();
    curtemp=curtemp.substring(0, curtemp.length - 1);
    updateUIWithGivenAttributeValue("tempc", "innerHTML", `${curtemp} ℃`);
    var cityhumidity = parseInt(`${selectedCityData.gethumidity()}`);
    updateUIWithGivenAttributeValue("temphumidity", "innerHTML", cityhumidity);
    updateUIWithGivenAttributeValue("tempf", "innerHTML", `${tempInFahrenheit} F`);
    var cityPrecipitation = parseInt(`${selectedCityData.getprecipitation()}`);
    updateUIWithGivenAttributeValue("degree", "innerHTML", cityPrecipitation);
    var percentage = "%";
    updateUIWithGivenAttributeValue("percentage-color", "innerHTML", percentage);
    updateUIWithGivenAttributeValue("percentage-color-1", "innerHTML", percentage);
  }

  /**
   *change future hours temperature image based on input city's temperature.
   *
   * @memberof updateSelectedCityData
   */
  async updateFutureHrsTempImgBasedOnInput() {
    //loop to update each icon of next 5 hrs using temp data.
  
    let nextfive = await getCityLiveTemp("city");
    for (var i = 0; i < 5; i++) {
      var city = `citytemp${i + 1}`;
      var tempNextFiveHr = nextfive[i];
      city = parseInt(tempNextFiveHr);

      if (city < 18) {
        updateUIWithGivenAttributeValue(`imgcloud${i + 1}`, "src", `./assets/rainyIcon.svg`);
      };
      if (city >= 18 && city <= 22) {
        updateUIWithGivenAttributeValue(`imgcloud${i + 1}`, "src", `./assets/windyIcon.svg`);
      };
      if (city >= 23 && city <= 29) {
        updateUIWithGivenAttributeValue(`imgcloud${i + 1}`, "src", `./assets/cloudyIcon.svg`);
      };
      if (city > 29) {
        updateUIWithGivenAttributeValue(`imgcloud${i + 1}`, "src", `./assets/sunnyIconBlack.svg`);
      };
      updateUIWithGivenAttributeValue(`temp${i + 1}`, "innerHTML", `${city}`);
    }

  }

  /**
   *change now temp image based on input city's temperature.
   *
   * @memberof updateSelectedCityData
   */
  updateNowTempImgBasedOnInput() {
    var citytemp = parseInt(selectedCityData.gettemperature());
    if (citytemp < 18) {
      updateUIWithGivenAttributeValue('imgcloud', "src", `./assets/rainyIcon.svg`);
    };
    if (citytemp >= 18 && citytemp <= 22) {
      updateUIWithGivenAttributeValue('imgcloud', "src", `./assets/windyIcon.svg`);
    };
    if (citytemp >= 23 && citytemp <= 29) {
      updateUIWithGivenAttributeValue('imgcloud', "src", `./assets/cloudyIcon.svg`);
    };
    if (citytemp > 29) {
      updateUIWithGivenAttributeValue('imgcloud', "src", `./assets/sunnyIconBlack.svg`);

    };
    updateUIWithGivenAttributeValue("nowtemp", "innerHTML", `${citytemp}`);
  }
}



/**
 *check the input is valid or not and execute the corresponding statements.
 *create object for the class.
 */
function updateSelectedCityBasedOnInput() {
  let cityselected = document.getElementById("city").value;
  selectedCityData = new updateSelectedCityData(cityselected.toLowerCase());


  // if condition to check if the input is valid city or not 
  var isValidCity = data.hasOwnProperty(cityselected.toLowerCase());
  // if isValidCity is true, then this code is executed 
  if (isValidCity) {
    selectedCityData.updateIconBasedOnInput();
    selectedCityData.updateDateTimeBasedOnInput();
    setInterval(selectedCityData.updateFutureHrsTempImgBasedOnInput(),3600000);
    selectedCityData.updateNowTempImgBasedOnInput();
    selectedCityData.updateTempBasedOnInput();
  }
  // if isValidCity is false, then this code is executed 
  else {
    selectedCityData.setNilForInvalidCitySelection();
    clearInterval(interval);
  }
}


//change the values when selected a city from datalist/
document.getElementById("city").addEventListener("change", updateSelectedCityBasedOnInput);



/**
 *
 * inherits the parent class features and has some variables.
 * @class updateCityCards
 * @extends {updateSelectedCityData}
 */
class updateCityCards extends updateSelectedCityData {
  ALLCITIES = [];
  sunnycities = [];
  coldcities = [];
  rainycities = [];
  continents = [];
  continentslist = [];
  selectedWeatherIcon;
  constructor() {
    super(document.getElementById("city").value);
  };
  /**
   *update carousel when resolution decreases.
   *
   */
   addCarouselForCardOverflow() {
    var scrollButton = document.getElementsByClassName("display-button");
    var card = document.getElementById("cards-container");
    for (let i = 0; i < scrollButton.length; i++) {
      if (card.scrollWidth > card.clientWidth) {
        scrollButton[i].style.display = "block";
      } else {
        scrollButton[i].style.display = "none";
      }
      
    }
  }
  
  /**
   *split country and continent name and store in a 2d array.
   *
   * @memberof updateCityCards
   */
  splitContinentNames() {
    let allcity;
    
    /* loop to enter each value of city inside cities array  */
    for (allcity in data) {

      updateCardDetails.continents.push(data[allcity].timeZone);
    }
    
    //Map function to split each input in continents array with "/".
    updateCardDetails.continentslist = updateCardDetails.continents.map(updateCardDetails.splitWithSlash);

  };

  /**
   *
   *sort the cities based on given category.
   * @param {array} city citi names
   * @param {string} category feature of each city like humidity,precipitation
   * @memberof updateCityCards
   */
  functionToSortEachCategoryCities(city, category) {

    city.sort(function (a, b) { return parseInt(data[b][category]) - parseInt(data[a][category]); });
  }

  /**
   *update each category with filtered city features.
   *
   * @memberof updateCityCards
   */
  updateCityCategories() {

    for (let allcity in data) {
      this.ALLCITIES.push(allcity);
    }

    updateCardDetails.sunnycities = this.ALLCITIES.filter(sunny);
    function sunny(city) {
      return parseInt(data[city].temperature) > 29 && parseInt(data[city].humidity) < 50 && parseInt(data[city].precipitation) >= 50;
    }
    updateCardDetails.coldcities = this.ALLCITIES.filter(cold);
    function cold(city) {
      return parseInt(data[city].temperature) <= 28 && parseInt(data[city].temperature) >= 20 && parseInt(data[city].humidity) > 50 && parseInt(data[city].precipitation) < 50;
    }
    updateCardDetails.rainycities = this.ALLCITIES.filter(rainy);
    function rainy(city) {
      return parseInt(data[city].temperature) < 20 && parseInt(data[city].humidity) >= 50;
    }
    updateCardDetails.functionToSortEachCategoryCities(updateCardDetails.sunnycities, "temperature");
    updateCardDetails.functionToSortEachCategoryCities(updateCardDetails.coldcities, "precipitation");
    updateCardDetails.functionToSortEachCategoryCities(updateCardDetails.rainycities, "humidity");

  }

  /**
   *display sunny cities when it is clicked.
   *
   * @memberof updateCityCards
   */
  displaySunnyCities() {
    updateCardDetails.selectedWeatherIcon = "sunnyIcon";
    updateCardDetails.setBorderBottomForEachCategories("sunnyiconimg");
    var cardsContainer = document.getElementById('cards-container');
    cardsContainer.replaceChildren();
    if (updateCardDetails.sunnycities.length >= 3) {
      updateCardDetails.displayDefaultCards(updateCardDetails.sunnycities, 3);
    }
    else {
      updateCardDetails.displayDefaultCards(updateCardDetails.sunnycities, updateCardDetails.sunnycities.length);
    }
    document.getElementById("quantity").value = "3";

    document.getElementById("quantity").removeEventListener("change", updateCardDetails.UpdateNoOfRainyCities);
    document.getElementById("quantity").addEventListener("change", updateCardDetails.UpdateNoOfSunnyCities);
    document.getElementById("quantity").removeEventListener("change", updateCardDetails.UpdateNoOfColdCities);
 
  }

  /**
   * change the display of sunny cards when spinner number changes.
   *
   * @memberof updateCityCards
   */
  UpdateNoOfSunnyCities() {
    var noOfCities = document.getElementById("quantity").value;
    var cardsContainer = document.getElementById('cards-container');
    cardsContainer.replaceChildren();
    if (noOfCities < 3) {
      noOfCities = 3;
      document.getElementById("quantity").value = "3";
    }
    else if (noOfCities > 10) {
      noOfCities = 10;
      document.getElementById("quantity").value = "10";
    }
    else {
      for (let i = 0; i < noOfCities && i < updateCardDetails.sunnycities.length; i++) {
        updateCardDetails.createCard(updateCardDetails.sunnycities[i]);
      }
    }

  }
  /**
   *
   *set border bottom for each icon when it is clicked.
   * @param {string} iconimg name of icon image
   * @memberof updateCityCards
   */
  setBorderBottomForEachCategories(iconimg) {
    if (iconimg == "sunnyiconimg") {
      updateUIWithGivenAttributeValue("sunnyiconimg", "borderBottom", "2px solid skyblue");
      updateUIWithGivenAttributeValue("rainyiconimg", "borderBottom", "none");
      updateUIWithGivenAttributeValue("coldiconimg", "borderBottom", "none");
    }
    else if (iconimg == "coldiconimg") {
      updateUIWithGivenAttributeValue("coldiconimg", "borderBottom", "2px solid skyblue");
      updateUIWithGivenAttributeValue("sunnyiconimg", "borderBottom", "none");
      updateUIWithGivenAttributeValue("rainyiconimg", "borderBottom", "none");
    }
    else if (iconimg = "rainyiconimg") {
      updateUIWithGivenAttributeValue("rainyiconimg", "borderBottom", "2px solid skyblue");
      updateUIWithGivenAttributeValue("sunnyiconimg", "borderBottom", "none");
      updateUIWithGivenAttributeValue("coldiconimg", "borderBottom", "none");
    }
  }

  /**
   *display cold cities when it is clicked.
   *
   * @memberof updateCityCards
   */
  displayColdCities() {
    updateCardDetails.selectedWeatherIcon = "snowflakeIcon";
    updateCardDetails.setBorderBottomForEachCategories("coldiconimg");
    var cardsContainer = document.getElementById('cards-container');
    cardsContainer.replaceChildren();
    if (updateCardDetails.coldcities.length >= 3) {
      updateCardDetails.displayDefaultCards(updateCardDetails.coldcities, 3);
    }
    else {
      updateCardDetails.displayDefaultCards(updateCardDetails.coldcities, updateCardDetails.coldcities.length);
    }

    document.getElementById("quantity").value = "3";

    document.getElementById("quantity").removeEventListener("change", updateCardDetails.UpdateNoOfRainyCities);
    document.getElementById("quantity").addEventListener("change", updateCardDetails.UpdateNoOfColdCities);
    document.getElementById("quantity").removeEventListener("change", updateCardDetails.UpdateNoOfSunnyCities);

  }

  /**
   *change the display of cold city cards when spinner number changes.
   *
   * @memberof updateCityCards
   */
  UpdateNoOfColdCities() {
    var noOfCities = document.getElementById("quantity").value;
    var cardsContainer = document.getElementById('cards-container');
    cardsContainer.replaceChildren();
    /*If the spinner count is less than 3.*/
    if (noOfCities < 3) {
      noOfCities = 3;
      document.getElementById("quantity").value = "3";
    }

    else if (noOfCities > 10) {
      noOfCities = 10;
      document.getElementById("quantity").value = "10";
    }
    else {

      for (let i = 0; i < noOfCities && i < updateCardDetails.coldcities.length; i++) {
        updateCardDetails.createCard(updateCardDetails.coldcities[i]);
      }

    }

  }

  /**
   *display rainy cities when it is clicked.
   *
   * @memberof updateCityCards
   */
  displayRainyCities() {
    updateCardDetails.selectedWeatherIcon = "rainyIcon";
    updateCardDetails.setBorderBottomForEachCategories("rainyiconimg");
    var cardsContainer = document.getElementById('cards-container');
    cardsContainer.replaceChildren();
    if (updateCardDetails.rainycities.length >= 3) {
      updateCardDetails.displayDefaultCards(updateCardDetails.rainycities, 3);
    }
    else {
      updateCardDetails.displayDefaultCards(updateCardDetails.rainycities, updateCardDetails.rainycities.length);
    }

    document.getElementById("quantity").value = "3";
    document.getElementById("quantity").addEventListener("change", updateCardDetails.UpdateNoOfRainyCities);
    document.getElementById("quantity").removeEventListener("change", updateCardDetails.UpdateNoOfColdCities);
    document.getElementById("quantity").removeEventListener("change", updateCardDetails.UpdateNoOfSunnyCities);

  }

  /**
   *display rainy cities in all corner cases while changing spinner number.
   *
   * @memberof updateCityCards
   */
  UpdateNoOfRainyCities() {
    var noOfCities = document.getElementById("quantity").value;
    var cardsContainer = document.getElementById('cards-container');
    cardsContainer.replaceChildren();

    if (noOfCities < 3) {
      noOfCities = 3;
      document.getElementById("quantity").value = "3";
    }

    else if (noOfCities > 10) {
      noOfCities = 10;
      document.getElementById("quantity").value = "10";
    }
    else {
      for (let i = 0; i < noOfCities && i < updateCardDetails.rainycities.length; i++) {
        updateCardDetails.createCard(updateCardDetails.rainycities[i]);
      }

    }

  }

  /**
   *
   *update live date and time for each city card.
   * @param {string} inputcity input city name.
   * @param {id} cityTime id of city card.
   * @param {id} cityDate id of city card.
   * @memberof updateCityCards
   */
  updateLiveDateTimeForCity(inputcity, cityTime, cityDate) {
    var time = new Date().toLocaleString("en-US", {
      timeZone: data[inputcity].timeZone,
    });
    var day = new Date(time).getDate();
    var prefixzeroaddedday = selectedCityData.prefixZero(day);
    var month = new Date(time).toLocaleString("en-US", { month: 'short' });
    var hour = new Date(time).getHours();
    var min = new Date(time).getMinutes();
    var year = new Date(time).getFullYear();
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const zeroaddedhour = { timePart: hour };
    const zeroaddedmin = { timePart: min };
    const cityUpdatedTime = {
      UpdatedTimeOfEachCity: function () {
        return this.cityHour + ":" + this.cityMin + " " + this.cityAmPm;
      }
    };
    const zeroaddedasprefix = {
      zeroPrefix: function () {
        this.timePart = this.timePart < 10 ? '0' + this.timePart : this.timePart;
        return this.timePart;
      }
    }
    /**
     * call method to add zero as prefix to each date and month of each city.
     */
    const updatedHourMinAmPm = {
      cityHour: `${zeroaddedasprefix.zeroPrefix.call(zeroaddedhour)}`,
      cityMin: `${zeroaddedasprefix.zeroPrefix.call(zeroaddedmin)}`,
      cityAmPm: `${ampm}`
    };
    const cityGetDate = {
      cityDate: "01",
      cityMonth: "01",
      cityYear: "0000",
      getDate: function () {
        return this.cityDate + "-" + this.cityMonth + "-" + this.cityYear;
      }
    }
    const cityDayMonthYear = {
      cityDate: `${prefixzeroaddedday.timePart}`,
      cityMonth: `${month}`,
      cityYear: `${year}`,
    };
    /**
     * *Bind method to update live date of each city.
     */
    let cityDateMonthYear = cityGetDate.getDate.bind(cityDayMonthYear);
    cityTime.innerHTML = `${cityUpdatedTime.UpdatedTimeOfEachCity.call(updatedHourMinAmPm)}`;
    cityDate.innerHTML = cityDateMonthYear();
  }
  /**
   *
   *display default cards when it is called.
   * @param {array} cityCategory category of cities.
   * @param {int} noOfCards the number of cards we have to display.
   * @memberof updateCityCards
   */
  displayDefaultCards(cityCategory, noOfCards) {
    for (var i = 0; i < noOfCards; i++) {
      updateCardDetails.createCard(cityCategory[i]);
    }
  }

  /**
   *
   *create city card for given input city name.
   * @param {string} inputcity name of input city.
   * @memberof updateCityCards
   */
  createCard(inputcity) {
    var cardsContainer = document.getElementById('cards-container');
    var cardsDiv = document.createElement('div');
    updateCardDetails.updateCardBackground(cardsDiv, inputcity);
    cardsContainer.appendChild(cardsDiv);
    updateCardDetails.updateCardNameTempAndClimate(cardsDiv, inputcity);
    updateCardDetails.updateCityLiveTimeAndDate(cardsDiv, inputcity);
    updateCardDetails.updateCityHumidity(cardsDiv, inputcity);
    updateCardDetails.updateCityPrecipitation(cardsDiv, inputcity);
  }

  /**
   *
   *set humidity icon and value for each city card.
   * @param {id} cardsDiv id of city card.
   * @param {string} inputcity city in card.
   * @memberof updateCityCards
   */
  updateCityHumidity(cardsDiv, inputcity) {
    var cityHumidity = document.createElement('div');
    cardsDiv.appendChild(cityHumidity);
    cityHumidity.classList.add('drop', 'flexrow');
    var cityHumidityimg = document.createElement('div');
    cityHumidity.appendChild(cityHumidityimg);
    var cityHumidityimgdrop = document.createElement('img');
    cityHumidityimgdrop.src = './assets/humidityIcon.svg';
    cityHumidityimgdrop.setAttribute('class', 'drop-img');
    cityHumidityimg.appendChild(cityHumidityimgdrop);
    var cityHumidityvalue = document.createElement('div');
    cityHumidity.appendChild(cityHumidityvalue);
    var cityHumidityvaluepercent = document.createTextNode(`${data[inputcity].humidity}`);
    cityHumidityvalue.appendChild(cityHumidityvaluepercent);

  }

  /**
   *set precipitation icon and value for each city card.
   *
   * @param {id} cardsDiv id of city card.
   * @param {string} inputcity city in card.
   * @memberof updateCityCards
   */
  updateCityPrecipitation(cardsDiv, inputcity) {
    var cityPrecipitation = document.createElement('div');
    cardsDiv.appendChild(cityPrecipitation);
    cityPrecipitation.classList.add('cloud', 'flexrow');
    var cityPrecipitationimg = document.createElement('div');
    cityPrecipitation.appendChild(cityPrecipitationimg);
    var cityPrecipitationimgdrop = document.createElement('img');
    cityPrecipitationimgdrop.src = './assets/precipitationIcon.svg';
    cityPrecipitationimgdrop.setAttribute('class', 'drop-img');
    cityPrecipitationimg.appendChild(cityPrecipitationimgdrop);
    var cityPrecipitationvalue = document.createElement('div');

    cityPrecipitation.appendChild(cityPrecipitationvalue);
    var cityPrecipitationvaluepercent = document.createTextNode(`${data[inputcity].precipitation}`);

    cityPrecipitationvalue.appendChild(cityPrecipitationvaluepercent);

  }

  /**
   *call live date and time at regular intervals and set them in each city card.
   *
   * @param {id} cardsDiv id of city card.
   * @param {string} inputcity city of card.
   * @memberof updateCityCards
   */
  updateCityLiveTimeAndDate(cardsDiv, inputcity) {
    var cityTime = document.createElement('div');
    cardsDiv.appendChild(cityTime);
    cityTime.setAttribute('class', 'time');
    var cityTimeValue = document.createTextNode('10 am');
    cityTime.appendChild(cityTimeValue);
    var cityDate = document.createElement('div');
    cardsDiv.appendChild(cityDate);
    cityDate.setAttribute('class', 'date');
    var cityDateValue = document.createTextNode('2 mar');
    cityDate.appendChild(cityDateValue);
    setInterval(updateCardDetails.updateLiveDateTimeForCity, 1, inputcity, cityTime, cityDate);
  }

  /**
   *update background image for each city card.
   *
   * @param {id} cardsDiv id of city card.
   * @param {string} inputcity city of card.
   * @memberof updateCityCards
   */
  updateCardBackground(cardsDiv, inputcity) {

    cardsDiv.style.background = `rgb(35 34 34) url(./assets/${data[inputcity].cityName}.svg) no-repeat bottom right`;
    cardsDiv.style.backgroundSize = "9em";
    cardsDiv.classList.add('flexcol', "card");
  }

  /**
   *
   *update name,temperature and climate for each city card.
   * @param {id} cardsDiv id of city card.
   * @param {string} inputcity city of card.
   * @memberof updateCityCards
   */
  updateCardNameTempAndClimate(cardsDiv, inputcity) {
    var cityDiv = document.createElement('div');
    cardsDiv.appendChild(cityDiv);
    cityDiv.classList.add('city', "flexrow");
    updateCardDetails.updateCardName(cityDiv, inputcity);
    updateCardDetails.updateCardClimate(cityDiv, inputcity);
    updateCardDetails.updateCardTemperature(cityDiv, inputcity);
  }

  /**
   *update city card name.
   *
   * @param {id} cityDiv id of card div.
   * @param {string} inputcity city of card.
   * @memberof updateCityCards
   */
  updateCardName(cityDiv, inputcity) {
    var cityNameDiv = document.createElement('div');
    var cityNameDivText = document.createTextNode(`${data[inputcity].cityName}`);
    cityNameDiv.appendChild(cityNameDivText);
    cityDiv.appendChild(cityNameDiv);
    cityNameDiv.classList.add('city-name', "animate-zoom");
  }

  /**
   * update card climae.
   *
   * @param {id} cityDiv id of card div.
   * @param {string} inputcity city of card.
   * @memberof updateCityCards
   */
  updateCardClimate(cityDiv, inputcity) {
    var cityClimate = document.createElement('div');
    cityClimate.classList.add('climate-condition');
    cityDiv.appendChild(cityClimate);
    var cityClimateimg = document.createElement('img');
    cityClimateimg.src = `./assets/${updateCardDetails.selectedWeatherIcon}.svg`;
    cityClimateimg.setAttribute('class', 'climate-condition-img ');
    cityClimate.setAttribute('id', 'climateimg');
    cityClimate.appendChild(cityClimateimg);

  }
  /**
   * update card temperature.
   *
   * @param {id} cityDiv id of card div.
   * @param {string} inputcity city of card.
   * @memberof updateCityCards
   */
  updateCardTemperature(cityDiv, inputcity) {
    var cityTemp = document.createElement('div');
    cityDiv.appendChild(cityTemp);
    cityTemp.setAttribute('class', 'temperature');
    var cityTempValue = document.createTextNode(`${parseInt(data[inputcity].temperature) } ℃`);
    cityTemp.appendChild(cityTempValue);
  }



  /**
   *update heading for middle section after certain seconds.
   *
   * @memberof updateCityCards
   */
  updateCardsHeading() {
    var heading = document.getElementById('cards-heading');
    setTimeout(function updateHeadingText() {
      heading.innerHTML = "Top cities around world";
    }, 1500);
  }


  /**
   *
   *create a continent card.
   * 
   * @param {string} continentnameText name of continent
   * @param {string} countryname name of country
   * @param {string} countrytempText temperature of country
   * @memberof updateCityCards
   */
  createContinentCard(continentnameText, countryname, countrytempText) {
    var continentlist = document.getElementById('cities-grid');
    var continentlistCard = document.createElement("div");
    continentlist.appendChild(continentlistCard);
    continentlistCard.setAttribute("Class", "grid-item");
    updateCardDetails.updateContinentName(continentnameText, continentlistCard);
    updateCardDetails.updateCountryTemperature(countrytempText, continentlistCard);
    var countrytime = document.createElement("div");
    countrytime.setAttribute("Class", "country-time");
    continentlistCard.appendChild(countrytime);
    setInterval(updateCardDetails.updateLiveTimeForEachCityList, 1, `${countryname}`, countrytime);
    updateCardDetails.updateHumidityIconAndValueForEachCityList(continentlistCard);
  }

  /**
   *fetch  and set live time. 
   * add zero as prefix for single digits of each card.
   * @param {string} name name of input city
   * @param {id} countrytime id of card
   * @memberof updateCityCards
   */
  updateLiveTimeForEachCityList(name, countrytime) {
    var time = new Date().toLocaleString("en-US", {
      timeZone: data[name.toLowerCase()].timeZone,
    });
    var hour = new Date(time).getHours();
    var min = new Date(time).getMinutes();
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    var prefixzeroaddedhour = selectedCityData.prefixZero(hour);
    var prefixzeroaddedmin = selectedCityData.prefixZero(min);
    var countrylisttime = `${prefixzeroaddedhour.timePart}:${prefixzeroaddedmin.timePart} ${ampm}`;
    var countrylivetime = `${name}, ${countrylisttime}`;
    countrytime.innerHTML = `${countrylivetime}`;
  }

  /**
   *set temperature for each country in each card.
   *
   * @param {string} countrytempText temperature of input city.
   * @param {id} continentlistCard id of card.
   * @memberof updateCityCards
   */
  updateCountryTemperature(countrytempText, continentlistCard) {
    var countrytemp = document.createElement("div");
    countrytemp.setAttribute("Class", "country-temp");
    countrytemp.textContent = `${countrytempText} ℃`;
    continentlistCard.appendChild(countrytemp);
  }

  /**
   *
   *set continent name for each card.
   *
   * @param {string} continentnameText continent name
   * @param {id} continentlistCard id of card
   * @memberof updateCityCards
   */
  updateContinentName(continentnameText, continentlistCard) {
    var continentname = document.createElement("div");
    continentname.setAttribute("Class", "country");
    continentlistCard.appendChild(continentname);
    continentname.textContent = `${continentnameText}`;
  }

  /**
   *set humidity icon and value for each card.
   * @param {id} continentlistCard id of card
   * @memberof updateCityCards
   */
  updateHumidityIconAndValueForEachCityList(continentlistCard) {
    var countryhumidity = document.createElement("div");
    countryhumidity.setAttribute("class", "country-humidity");
    continentlistCard.appendChild(countryhumidity);
    let countryhumidityicon = document.createElement("img");
    countryhumidityicon.src = "./assets/humidityIcon.svg";
    countryhumidityicon.class = "country-humidity-icon";
    let textSpan = document.createElement("span");
    textSpan.class = "country-humidity";
    textSpan.style.padding = "10px";
    textSpan.innerHTML = "53%";
    countryhumidity.append(countryhumidityicon);
    countryhumidity.append(textSpan);
  }
  /**
   *split each input in continents array with.
   *
   * @param {array} city array with continent and country names.
   * @return {array} 
   * @memberof updateCityCards
   */
  splitWithSlash(city) {
    return city.split("/");
  }

  /**
   *
   *fectches the arrow type and returns the state of the arrow, weather its placed up or down.
   * @param {string} arrow name of arrow.
   * @return {string} direction of arrow.
   * @memberof updateCityCards
   */
  fetchArrowDirection(arrow) {
    if (arrow == "temp") {
      var tempArrowSrc = tempArrow.src;
      tempArrowSrc = tempArrowSrc.split("/");
      var arrowToSortTemp = tempArrowSrc[4].slice(0, -4);
      return arrowToSortTemp;
    }
    else if (arrow == "name") {
      var nameArrowSrc = nameArrow.src;
      nameArrowSrc = nameArrowSrc.split("/");
      var arrowToSortName = nameArrowSrc[4].slice(0, -4);
      return arrowToSortName;
    }
  }

  /**
   *checks if the arrow is up or down.
   *
   * @memberof updateCityCards
   */
  sortContinentsBasedOnConditions() {
    var arrowToSortName = updateCardDetails.fetchArrowDirection("name");
    let citiesList = document.getElementById('cities-grid');
    citiesList.replaceChildren();
    if (arrowToSortName == "arrowDown") {
      updateCardDetails.sortCitiesInAscendingAndDescending("ascending");
      updateCardDetails.createCardWithGivenConditions();
    }
    if (arrowToSortName == "arrowUp") {
      updateCardDetails.sortCitiesInAscendingAndDescending("descending");
      updateCardDetails.createCardWithGivenConditions();
    }
  }

  /**
   *set city name, temperature and continent name for each card.
   *
   * @memberof updateCityCards
   */
  createCardWithGivenConditions() {

    for (var i = 0; i < 12; i++) {
      updateCardDetails.createContinentCard(`${updateCardDetails.continentslist[i][0]}`, `${data[updateCardDetails.continentslist[i][1].replace("_", "").toLowerCase()].cityName}`, `${parseInt(data[updateCardDetails.continentslist[i][1].replace("_", "").toLowerCase()].temperature)}`);
    }
  }

  /**
   *sorts the cotinents in ascending and descending according to the arrow clicked. 
   * sorts the continents in temperature wise with cards belonging to same continents.
   * @param {array} continentslist array of unique continents
   * @param {string} order order of sorting
   * @memberof updateCityCards
   */
  sortCitiesInAscendingAndDescending(order) {
    var arrowToSortTemp = updateCardDetails.fetchArrowDirection("temp");
    updateCardDetails.continentslist.sort(function (a, b) {
      if (order == "ascending") {
        if (a[0] < b[0])
          return -1;
        if (a[0] > b[0])
          return 1;
      }
      else if (order == "descending") {
        if (a[0] > b[0])
          return -1;
        if (a[0] < b[0])
          return 1;
      }
      var previousCityTemperature = parseInt(data[a[1].replace("_", "").toLowerCase()].temperature);
      var currentCityTemperature = parseInt(data[b[1].replace("_", "").toLowerCase()].temperature);
      if (arrowToSortTemp == "arrowUp") {
        if (previousCityTemperature < currentCityTemperature)
          return 1;
        if (previousCityTemperature > currentCityTemperature)
          return -1;
      }
      if (arrowToSortTemp == "arrowDown") {
        if (previousCityTemperature > currentCityTemperature)
          return 1;
        if (previousCityTemperature < currentCityTemperature)
          return -1;
      }
    });
  }
};
/**
 *create objects for classes.
 *call default functions to be executed.
 */
function updateCityCardDataOnClick() {
  updateCardDetails = new updateCityCards();

  updateCardDetails.splitContinentNames();

  var nameArrow = document.getElementById('nameArrow');
  var tempArrow = document.getElementById('tempArrow');

  // A onclick function to trigger sortContinentsBasedOnConditions() based on the arrow we click.
  nameArrow.addEventListener("click", () => {
    var arrowToSortName = updateCardDetails.fetchArrowDirection("name");
    nameArrow.src = (arrowToSortName == "arrowDown") ? "./assets/arrowUp.svg" : "./assets/arrowDown.svg";
    updateCardDetails.sortContinentsBasedOnConditions();
  });
  tempArrow.addEventListener("click", () => {
    var arrowToSortTemp = updateCardDetails.fetchArrowDirection("temp");
    tempArrow.src = (arrowToSortTemp == "arrowDown") ? "./assets/arrowUp.svg" : "./assets/arrowDown.svg";
    updateCardDetails.sortContinentsBasedOnConditions();
  });


  //Default sorting order is taken on page load.
  updateCardDetails.sortContinentsBasedOnConditions();

  updateCardDetails.updateCityCategories();
  document.getElementById("sunnyiconbtn").addEventListener("click", updateCardDetails.displaySunnyCities);
  document.getElementById("coldiconbtn").addEventListener("click", updateCardDetails.displayColdCities);
  document.getElementById("rainyiconbtn").addEventListener("click", updateCardDetails.displayRainyCities);

  updateCardDetails.displaySunnyCities();
  updateCardDetails.updateCardsHeading();
  setInterval(updateCardDetails.addCarouselForCardOverflow, 1);
  var card = document.getElementById("cards-container");
  document.getElementById('backwardArrow').addEventListener("click",()=>{card.scrollLeft -= 600;})
  document.getElementById('forwardArrow').addEventListener("click",()=>{card.scrollLeft += 600;})
};















