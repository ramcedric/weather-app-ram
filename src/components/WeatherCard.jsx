import React, { useState, useEffect , useCallback } from 'react';
import '../assets/styles/WeatherCard.css';

import { DropDown } from './DropDown';


import islands from '../data/Island.js';
import weatherCode from '../data/WeatherCode.js';


import sunny from '../assets/images/sunny.png';
import cloudy from '../assets/images/cloudy.png';
import rainy from '../assets/images/rainy.png';
import snowy from '../assets/images/snowy.png';
import loading from '../assets/images/loading.gif'

export const WeatherCard = () => {

    //Default Set
    const islandsList = Object.keys(islands);
    const [island, setIsland] = useState(islandsList[0] || '');
    const [province, setProvince] = useState(islands["Luzon"][0]);

    // Set Data After Loading
    const [provinceList, setProvinceList] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [coordinates, setCoordinates] = useState({ lat: 17.0727, lon: 120.6126 });


    // When We choose Island it will update province list
    useEffect(() => {
        if (island) {
            const provinces = islands[island].map(p => p.name);
            setProvinceList(provinces);
        }
    }, [island]);

    // When We choose Island it will update province List
    useEffect(() => {
        if (province) {
            const provinceData = islands[island].find(p => p.name === province);
            if (provinceData) {
                console.log(provinceData);
                setCoordinates({ lat: provinceData.lat, lon: provinceData.lon });
            }
        }
    }, [province,provinceList,island]);

    useEffect(() => {
        fetchWeather();

        console.log(coordinates)
    }, [coordinates]);





 






 






    const fetchWeather = useCallback(async () => {
        try {
        
          const { lat, lon } = province;
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,is_day,rain,weather_code,wind_speed_10m`
          );
          const data = await weatherResponse.json();    
          setWeatherData(data);
        } catch (err) {
          console.error("Error fetching weather data:", err);
        }  
      }, [province]);

 

    function formatDate(datetimeString) {
        const date = new Date(datetimeString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    }

    function getWeatherDetails(code) {
        if (code == null || code == undefined) {
            return {description: '', tooltip: ''}
        }
        else{
            return weatherCode[code];
        }
    }

    
    let weatherImage = sunny;
    function WeatherIcon(code) {
    
        if ([0, 1].includes(code)) {
            return sunny;
        } else if ([2, 3].includes(code)) {
            return  cloudy;
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
            return  rainy;
        } else if ([85, 86].includes(code)) {
            return  snowy;
        } else {
            return null; // or set a default image if needed
        }
    }
 

     


    return (
        <div className="container">
            <div className="weather-app">
                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">{island}</div>
                    </div>
                    <div className='search-dropdown'>
                        <DropDown heading="Island" Options={islandsList} setValue={setIsland} />
                        <DropDown heading="Province" Options={provinceList} setValue={setProvince} />
                    </div>
                </div>
                <div className="weather">
                    <img src={WeatherIcon(weatherData?.current?.weather_code)} alt="sunny" />
                    <div className="weather-type">{getWeatherDetails(weatherData?.current?.weather_code).description}</div>
                    <div className="temp">{weatherData?.current?.temperature_2m}°</div>
                </div>
                <div className="weather-date">
                    <p>{formatDate(weatherData?.current?.time)}</p>
                </div>
                <div className="weather-data">
                    <div className="humidity">
                        <div className="data-name">Humidity</div>
                        <i className="fa-solid fa-droplet"></i>
                        <div className="data">{weatherData?.current?.relative_humidity_2m}%</div>
                    </div>
                    <div className="wind">
                        <div className="data-name">Wind</div>
                        <i className="fa-solid fa-wind"></i>
                        <div className="data">{weatherData?.current?.wind_speed_10m} km/h</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
