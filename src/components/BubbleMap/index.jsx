import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import './BubbleMap.css';
import ChartPage from '../ChartPage';
// import { renderToString } from 'react-dom/server';
// import {IconButton} from '@mui/material';
// import { useDateField } from '@mui/x-date-pickers/DateField/useDateField';

const BubbleMap = (props) => {
    const { selectedDate1, selectedDate2, selectedCities, sliderValue, selectedLabels } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue, selectedLabels);

    const [csvData, setCsvData] = useState([]);
    

    // TODO: Optimize this function
    const normalizePeople = (value) => {
        // HINT: MinValue radius can't be 0!!!
        // return value / 10000;
        console.log("initialMapSettings Zoom", initialMapSettings.zoom)
        return Math.sqrt(value) / 50000 * (initialMapSettings.zoom **3);
        // return (Math.log(value + 100)/20) * initialMapSettings.zoom ;
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
    const bubbleChartData = csvData.map((data, index) => {
        
        // Calculate the average and total
        const calc_total = () => {
            let year = +selectedDate1.split('/')[0], month = +selectedDate1.split('/')[1];
            const end_year = +selectedDate2.split('/')[0], end_month = +selectedDate2.split('/')[1];
            let total = 0, count = 0;
            let people_list = [];
            while(true) {
                const now = +data[`${year}/${String(month).padStart(2, '0')}`];
                if(now !== 0) {total += now; count += 1; people_list.push(now)}
                if(year === end_year && month === end_month) break;
                month += 1;
                if(month > 12) { year += 1; month = 1;}
            }
            // console.log('total:', total);
            return [total, Math.round(total / count), people_list];
        }
        const people = calc_total();
        return ({
        id: index,
        title: data['遊憩據點'],
        county: data['縣市'],
        category: data['類型'],
        color: color_map[data['類型']],
        // FIXME: use real location
        // location: getRandomCoordinate(),
        location: [data['緯度'], data['經度']],
        // FIXME: count the avg
        avg: people[1],
        people: people[0],
        people_list: people[2],
        // people: parseInt(data['小計'], 10),
      })});

    const [CompareData, setCompareData] = useState({
        selectedDate1: selectedDate1,
        selectedDate2: selectedDate1,
        selectedIndexes: [],
    });


    

    // Popup block
    const costumPopup = (title, avg, id) => {
        let line_chart_id = CompareData.selectedIndexes;
        const div = document.createElement("div");
        div.style.fontFamily = "'Noto Sans TC', sans-serif";
        div.innerHTML = `<strong>${title}</strong><br />avg people: ${avg}`;
    
        const iconButton = document.createElement("div");
        const icon = document.createElement("span");
        iconButton.style.cursor = "pointer";
    
        // You can customize the style of the IconButton as needed
        iconButton.style.marginTop = "10px";
    
        // Check if the id is in line_chart_id
        if (line_chart_id.includes(id)) {
            // Attach the IconButton with the RemoveCircleOutlinedIcon if already added
            icon.innerHTML = "<span style='display:flex;'><span style='flex:1;'></span>-<span style='flex:1;'></span></span>";
            icon.style.color = "red"; // You can customize the color
        } else {
            // Attach the IconButton with the AddCircleOutlinedIcon if not added
            icon.innerHTML = "<span style='display:flex;'><span style='flex:1;'></span>+<span style='flex:1;'></span></span>";
            icon.style.color = "blue"; // You can customize the color
        }
    
        icon.style.fontSize = "1.5rem"; // You can customize the font size
        iconButton.appendChild(icon);
    
        iconButton.onclick = function () {
            if (line_chart_id.includes(id)) {
                // If already present, remove it
                line_chart_id = line_chart_id.filter(item => item !== id);
            } else if (line_chart_id.length === 5) {
                alert('無法新增: 最多只能比較五項景點');
            } else {
                // If not present, add it
                line_chart_id.push(id);
            }
    
            setCompareData({
                selectedDate1: selectedDate1,
                selectedDate2: selectedDate2,
                selectedIndexes: line_chart_id,
            });
    
            console.log('id:', line_chart_id);
        };
    
        div.appendChild(iconButton);
        return div;
    };
    
    // const mapRef = React.useRef();
    // const isMounted = React.useRef(true);

    // const initMapValue = { center: [23.69781, 120.96052], zoom: 7 };
    const [initialMapSettings, setInitialMapSettings] = useState({
        center: [23.69781, 120.96052],
        zoom: 7,
    });


    useEffect(() => {
        var map = L.map('bubble-map').setView(initialMapSettings.center, initialMapSettings.zoom);
        // mapRef.current = map;
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors'
        }).addTo(map);

        // Listen to map events to update initialMapSettings
        map.on('moveend', () => {
            const newCenter = map.getCenter();
            const newZoom = map.getZoom();

            // Debounce the execution to avoid issues with rapid zooming
            // if (isMounted.current) {
                // setTimeout(() => {
            setInitialMapSettings({
                center: [newCenter.lat, newCenter.lng],
                zoom: newZoom,
            });
                // }, 200); // Adjust the debounce duration as needed
                // console.log("new zoom value", initialMapSettings.zoom)
                // console.log("new zoom value:", newCenter.lat, newCenter.lng)
                // console.log("new zoom value:",map)

                // setInitialMapSettings({
                //     center: [initialMapSettings.center, initialMapSettings.zoom],
                //     zoom: newZoom,
                // });
            // }
        });

        let filtered_data = bubbleChartData;
        if(selectedLabels !== undefined) {
            filtered_data = bubbleChartData
                .filter((value) => value.avg > sliderValue[0] && value.avg < sliderValue[1])
                .filter((value) => selectedCities.includes(value.county))
                .filter((value) => selectedLabels.includes(value.category));
        }

        filtered_data.forEach((bubble) => {
            const isHighlighted = CompareData.selectedIndexes?.includes(bubble.id);
            const markerOptions = {
                radius: normalizePeople(bubble.people),
                color: bubble.color,
                fillOpacity: 0.5,
                weight: 2,

            };

            // Add additional styles for highlighted circles
            if (isHighlighted) {
                markerOptions.weight = 2;
                markerOptions.stroke = true;
                markerOptions.fillOpacity = 1;
            }

            const marker = L.circleMarker(bubble.location, markerOptions).addTo(map);

            marker.bindPopup(costumPopup(bubble.title, bubble.avg, bubble.id));
        });
        map.setMinZoom(7);
        return () => {
            // Clean up when the component unmounts
            if (map) {
                map.remove();
            }
        };
    // }, [bubbleChartData, selectedCities, sliderValue]);
}, [bubbleChartData, selectedCities, sliderValue, initialMapSettings, CompareData, selectedLabels]);

    

    return (
    <div id="bubble-map-div">
        <div id="bubble-map"></div>
        {CompareData.selectedIndexes.length && <ChartPage data={CompareData} />}
    </div>
    );
};

export default BubbleMap;
