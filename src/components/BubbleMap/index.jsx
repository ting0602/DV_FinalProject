import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import './BubbleMap.css';

Object.filter = function(mainObject, filterFunction) {
    return Object.keys(mainObject).filter(function(ObjectKey) {
            return filterFunction(mainObject[ObjectKey])
        })
        .reduce(function(result, ObjectKey) {
            result[ObjectKey] = mainObject[ObjectKey];
            return result;
        }, {});
}

const BubbleMap = (props) => {
    const { selectedDate1, selectedDate2, selectedCities, sliderValue } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue);

    const [csvData, setCsvData] = useState([]);

    // FIXME: del this function
    // const getRandomCoordinate = () => {
    //     // Generate random coordinates within Taiwan bounds
    //     const minLatitude = 20.5;
    //     const maxLatitude = 25.5;
    //     const minLongitude = 119.18;
    //     const maxLongitude = 124.5;
      
    //     const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
    //     const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;
      
    //     return [latitude, longitude];
    // };
    // TODO: Optimize this function
    const normalizePeople = (value) => {
        // HINT: MinValue radius can't be 0!!!
        return Math.sqrt(value - 1000) / 1000 * 3;
        // return Math.log(value - 1000 + 1)/3;
      };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/data_with_id.csv');
                const text = await response.text();
                const result = Papa.parse(text, { header: true });
                console.log(result.data)
                setCsvData(result.data);
            } catch (error) {
                console.error('Error fetching CSV:', error);
            }
        };
    
        fetchData();
    }, []);

    // console.log('CSV Data:', csvData.slice(0, 100));
    const color_map = {
        '國家公園': '#ff9694',
        '博物館': '#ffe494',
        '其他': '#78afcc',
        '國家級風景特定區': '#94e6ff',
        '直轄市及縣(市)級風景特定區': '#b1cc97',
        '森林遊樂區': '#a4ff94',
        '宗教場所': '#ffc194',
        '休閒農業區及休閒農場': '#d194ff',
        '觀光地區': '#ff94cf'
    }
    const bubbleChartData = csvData.slice(0, 100).map((data, index) => {
        // Calculate the average, 181month
        const zero = Object.filter(data, function(value) {
            return value == '0';
        });
        const nonzero_size = 181 - Object.keys(zero).length;
        const avg = Math.round(+data['小計'] / nonzero_size);
        return ({
        id: index + 1,
        title: data['遊憩據點'],
        county: data['縣市'],
        color: color_map[data['類型']],
        // FIXME: use real location
        // location: getRandomCoordinate(),
        location: [data['緯度'], data['經度']],
        // FIXME: count the avg
        avg: avg,
        people: parseInt(data['小計'], 10), // Assuming '小計' is the field for people and needs to be converted to an integer
      })});

    // const bubbleChartData = [
    //     { id: 1, title: '台北101', county: '臺北市', town: '信義區', village: '西村里', location: [25.034000, 121.564670], people: 100 },
    //     { id: 2, title: '台灣最南點', county: '屏東縣', town: '恆春鎮', village: '鵝鑾里', location: [21.897750, 120.857921], people: 50 },
    //     { id: 3, title: '貓鼻頭燈塔', county: '新北市', town: '瑞芳區', village: '鼻頭里', location: [25.129217, 121.923449], people: 75 }
    // ];

    // Sort the bubble chart data based on the number of people in descending order
    // const sortedBubbleChartData = bubbleChartData.sort((a, b) => b.people - a.people);

    useEffect(() => {
        const map = L.map('bubble-map').setView([23.69781, 120.96052], 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors'
        }).addTo(map);
        const filtered_data = bubbleChartData.filter((value) => {
            // console.log('value', value.avg);
            // return false;
            // console.log("avg:", value.avg, value.avg > sliderValue[0] && value.avg < sliderValue[1])
            return (value.avg > sliderValue[0] && value.avg < sliderValue[1]);
        }).filter((value) => {
            return (selectedCities.includes(value.county));
        })
        filtered_data.forEach((bubble) => {
            L.circleMarker(bubble.location, {
                radius: normalizePeople(bubble.people), // Adjust the scaling factor as needed
                color: bubble.color,
                fillOpacity: 0.5,
                weight: 1 // stroke width
            }).addTo(map).bindPopup(`<strong>${bubble.title}</strong><br />People: ${bubble.avg}`);
        });
        map.setMinZoom(7);
        return () => {
            // Clean up when the component unmounts
            map.remove();
        };
    }, [bubbleChartData]);

    return <div id="bubble-map" />;
};

export default BubbleMap;
