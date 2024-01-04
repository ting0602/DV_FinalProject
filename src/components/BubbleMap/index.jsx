import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import './BubbleMap.css';
import ChartPage from '../ChartPage';


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
    const { selectedDate1, selectedDate2, selectedCities, sliderValue, selectedLabels } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue);

    const [csvData, setCsvData] = useState([]);

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
            return value === '0';
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
        people: parseInt(data['小計'], 10),
      })});

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
    }, [bubbleChartData, selectedCities, sliderValue]);

    const [CompareData, setCompareData] = useState({
        // selectedDate1: String,
        // selectedDate2: String,
        // selectedIndexes: Array,
        selectedDate1: "2018/01",
        selectedDate2: "2020/06",
        selectedIndexes: [0, 22, 33, 99],
    });

    return (
    <div id="bubble-map-div">
        <div id="bubble-map"></div>
        <ChartPage data={CompareData} />
    </div>
    );
};

export default BubbleMap;
