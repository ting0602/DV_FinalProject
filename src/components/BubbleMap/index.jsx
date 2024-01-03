import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import './BubbleMap.css';

const BubbleMap = (props) => {
    const { selectedDate1, selectedDate2, selectedCities, sliderValue } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue);

    const [csvData, setCsvData] = useState([]);

    // FIXME: del this function
    const getRandomCoordinate = () => {
        // Generate random coordinates within Taiwan bounds
        const minLatitude = 20.5;
        const maxLatitude = 25.5;
        const minLongitude = 119.18;
        const maxLongitude = 124.5;
      
        const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
        const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;
      
        return [latitude, longitude];
    };
    // TODO: Optimize this function
    const normalizePeople = (value) => {
        // HINT: MinValue radius can't be 0!!!
        return Math.sqrt(value - 1000) / 1000;
        // return Math.log(value - 1000 + 1)/3;
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/data_with_addresses.csv');
                const text = await response.text();
                const result = Papa.parse(text, { header: true });
                setCsvData(result.data);
            } catch (error) {
                console.error('Error fetching CSV:', error);
            }
        };
    
        fetchData();
    }, []);

    console.log('CSV Data:', csvData.slice(0, 100));

    const bubbleChartData = csvData.slice(0, 100).map((data, index) => ({
        id: index + 1,
        title: data['遊憩據點'],
        county: data['縣市'],
        // FIXME: use real location
        location: getRandomCoordinate(),
        // FIXME: count the avg
        people: normalizePeople(parseInt(data['小計'], 10)), // Assuming '小計' is the field for people and needs to be converted to an integer
      }));

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

        bubbleChartData.forEach((bubble) => {
            L.circleMarker(bubble.location, {
                radius: bubble.people, // Adjust the scaling factor as needed
                color: 'blue',
                fillOpacity: 0.5
            }).addTo(map).bindPopup(`<strong>${bubble.title}</strong><br />People: ${bubble.people}`);
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
