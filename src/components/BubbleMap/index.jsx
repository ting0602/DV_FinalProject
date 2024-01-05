import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import './BubbleMap.css';
import ChartPage from '../ChartPage';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

var selectedTarget = {
    '國家公園': [],
    '博物館': [],
    '國家級風景特定區': [],
    '直轄市及縣(市)級風景特定區': [],
    '森林遊樂區': [],
    '宗教場所': [],
    '休閒農業區及休閒農場': [],
    '觀光地區': [],
    '其他': [],
}
const color_map = {
    '國家公園': 'rgb(255, 120, 0)',
    '博物館': 'rgb(255, 250, 150)',
    '國家級風景特定區': 'rgb(150, 240, 255)',
    '直轄市及縣(市)級風景特定區': 'rgb(100, 200, 100)',
    '森林遊樂區': 'rgb(170, 255, 150)',
    '宗教場所': 'rgb(255, 150, 150)',
    '休閒農業區及休閒農場': 'rgb(220, 148, 255)',
    '觀光地區': 'rgb(165,130,90)',
    '其他': 'rgb(120, 175, 200)',
}
const multi_color_map = {
    '國家公園': [
        'rgb(255, 120, 0)',
        'rgb(255, 100, 80)',
        'rgb(255, 80, 160)',
        'rgb(255, 75, 200)',
        'rgb(255, 50, 240)',
        'rgb(255, 40, 200)',
        'rgb(255, 30, 160)',
        'rgb(255, 20, 120)',
        'rgb(255, 10, 80)',
        'rgb(255, 0, 40)',
    ],
    '博物館': [
        'rgb(255, 245, 133)',
        'rgb(255, 240, 117)',
        'rgb(255, 235, 100)',
        'rgb(255, 230, 84)',
        'rgb(255, 225, 68)',
        'rgb(255, 220, 51)',
        'rgb(255, 215, 35)',
        'rgb(255, 210, 19)',
        'rgb(255, 205, 3)',
        'rgb(255, 200, 0)',
    ],
    '國家級風景特定區' : [
        'rgb(150, 225, 255)',
        'rgb(150, 205, 230)',
        'rgb(150, 180, 255)',
        'rgb(150, 160, 230)',
        'rgb(150, 140, 255)',
        'rgb(150, 120, 230)',
        'rgb(150, 100, 255)',
        'rgb(150, 80, 230)',
        'rgb(150, 60, 255)',
        'rgb(150, 40, 230)'
    ],
    '直轄市及縣(市)級風景特定區' : [
        'rgb(100, 185, 100)',
        'rgb(100, 170, 100)',
        'rgb(100, 155, 100)',
        'rgb(100, 140, 100)',
        'rgb(100, 125, 100)',
        'rgb(100, 110, 100)',
        'rgb(100, 95, 100)',
        'rgb(100, 80, 100)',
        'rgb(100, 65, 100)',
        'rgb(100, 50, 100)'
    ],
    '森林遊樂區' : [
        'rgb(170, 240, 150)',
        'rgb(170, 225, 150)',
        'rgb(170, 210, 150)',
        'rgb(170, 195, 150)',
        'rgb(170, 180, 150)',
        'rgb(170, 165, 150)',
        'rgb(170, 150, 150)',
        'rgb(170, 135, 150)',
        'rgb(170, 120, 150)',
        'rgb(170, 105, 150)',
    ],
    '宗教場所' : [
        'rgb(255, 133, 133)',
        'rgb(255, 117, 117)',
        'rgb(255, 100, 100)',
        'rgb(255, 84, 84)',
        'rgb(255, 68, 68)',
        'rgb(255, 51, 51)',
        'rgb(255, 35, 35)',
        'rgb(255, 19, 19)',
        'rgb(255, 3, 3)',
        'rgb(255, 0, 0)',
    ],
    '休閒農業區及休閒農場' : [
        'rgb(220, 133, 255)',
        'rgb(200, 118, 255)',
        'rgb(220, 103, 235)',
        'rgb(200, 88, 200)',
        'rgb(220, 73, 255)',
        'rgb(200, 58, 200)',
        'rgb(220, 43, 200)',
        'rgb(200, 28, 255)',
        'rgb(220, 13, 220)',
        'rgb(200, 0, 255)',
    ],
    '觀光地區' : [
        'rgb(165, 130, 75)',
        'rgb(165, 130, 60)',
        'rgb(165, 130, 45)',
        'rgb(165, 130, 30)',
        'rgb(165, 130, 15)',
        'rgb(165, 130, 0)',
        'rgb(165, 130, 0)',
        'rgb(165, 130, 0)',
        'rgb(165, 130, 0)',
        'rgb(165, 130, 0)',
    ],
    '其他': [
        'rgb(120, 160, 200)',
        'rgb(100, 140, 220)',
        'rgb(120, 120, 240)',
        'rgb(100, 100, 220)',
        'rgb(120, 80, 200)',
        'rgb(100, 60, 220)',
        'rgb(120, 40, 240)',
        'rgb(100, 25, 220)',
        'rgb(120, 10, 200)',
        'rgb(100, 5, 220)'
    ],
}
var colorList = []
var colorMap
const BubbleMap = (props) => {
    const { selectedDate1, selectedDate2, selectedCities, sliderValue, selectedLabels } = props.data;

    const [csvData, setCsvData] = useState([]);
    // const [colorListIndex, setColorListIndex] = useState(0);

    const normalizePeople = (value) => {
        return Math.min(Math.max(Math.sqrt(value) / 67000 * (initialMapSettings.zoom **3), 3), 40);
        // return (Math.log(value**3)/20) * initialMapSettings.zoom ;
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
        console.log('fetch data.')
    }, []);

    const bubbleChartData = csvData.map((data, index) => {
        
        // Calculate the average and total
        const calc_total = () => {
            let year = +selectedDate1.split('/')[0], month = +selectedDate1.split('/')[1];
            const end_year = +selectedDate2.split('/')[0], end_month = +selectedDate2.split('/')[1];
            let total = 0, count = 0;
            // let people_list = [];
            while(true) {
                const now = +data[`${year}/${String(month).padStart(2, '0')}`];
                if(now !== 0) {total += now; count += 1;}
                if(year === end_year && month === end_month) break;
                month += 1;
                if(month > 12) { year += 1; month = 1;}
            }
            return [total, Math.round(total / count)];
        }
        const people = calc_total();
        return ({
        id: index,
        title: data['遊憩據點'],
        county: data['縣市'],
        category: data['類型'],
        color: color_map[data['類型']],

        location: [data['緯度'], data['經度']],
        avg: people[1],
        people: people[0],
      })});

    const [CompareData, setCompareData] = useState({
        selectedDate1: selectedDate1,
        selectedDate2: selectedDate1,
        selectedIndexes: [],
        selectedColor: [],
    });

    const removeData = (category, id) => {
        var id_list = CompareData.selectedIndexes
        id_list = id_list.filter(item => item !== id);
        selectedTarget = {
            ...selectedTarget,
            [category]: selectedTarget[category].filter(([i, _]) => i !== id),
        };

        colorList = []
        Object.entries(selectedTarget).forEach(([currentCategory, categoryData]) => {
            // 遍歷選擇的索引
            id_list.forEach(id => {
                const colorIndex = categoryData.findIndex(([i, _]) => i === id);
                if (colorIndex !== -1) {
                    colorList.push([id, multi_color_map[currentCategory][colorIndex]]);
                }
            });
        });
        setCompareData((prevCompareData) => ({
            ...prevCompareData,
            selectedIndexes: id_list,
            selectedColor: colorList,
        }));
        colorMap = new Map(colorList);

    }


    // Popup block
    const costumPopup = (title, avg, id, category) => {
        let line_chart_id = CompareData.selectedIndexes;
        const div = document.createElement("div");
        div.style.fontFamily = "'Noto Sans TC', sans-serif";
        div.innerHTML = `<strong>${title}</strong><br />月均人數: ${avg}`;
        const img_cnt = document.createElement("div");
        img_cnt.className = 'img_cnt';
        img_cnt.style.height = 'auto';
        let img = document.createElement("img");
        img.src = `/images/${id}.jpg`;
        img.style.maxWidth = '200px';
        img.style.maxHeight = '110px';
        img.onerror = function() {
            this.onerror=null;
            this.src='';
        }
        img_cnt.appendChild(img);

        const url = (`https://www.google.com/maps/search/?` +
            new URLSearchParams({
                api: 1,
                map_action: 'map',
                query: title,
            }).toString()
        ) 
        let map_img_cnt = document.createElement("a");
        map_img_cnt.href = url;
        map_img_cnt.target = '_blank';
        map_img_cnt.className = 'map_img_cnt';
        let map_img = document.createElement("img");
        map_img.src = `/images/map.png`;
        map_img.width = 20;
        map_img_cnt.appendChild(map_img);
        img_cnt.appendChild(map_img_cnt);

        div.appendChild(img_cnt);

        const iconButton = document.createElement("div");
        const icon = document.createElement("span");
        iconButton.style.cursor = "pointer";
    
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
            } else if (line_chart_id.length === 10) {
                alert('無法新增: 最多只能比較10項景點');

            } else {
                // If not present, add it
                line_chart_id.push(id);
                selectedTarget[category].push([id,title]);

                console.log("selectedTarget", selectedTarget)
            }

            line_chart_id = [...line_chart_id].sort((a, b) => a - b);
            colorList = [];
            
            // 遍歷所有類別
            Object.entries(selectedTarget).forEach(([currentCategory, categoryData]) => {
              // 遍歷選擇的索引
                line_chart_id.forEach(id => {
                    const colorIndex = categoryData.findIndex(([i, _]) => i === id);
                    if (colorIndex !== -1) {
                        colorList.push([id, multi_color_map[currentCategory][colorIndex]]);
                    }
                });
            });

            setCompareData({
                selectedDate1: selectedDate1,
                selectedDate2: selectedDate2,
                selectedIndexes: line_chart_id,
                selectedColor: colorList,
            });
            colorMap = new Map(colorList);
            console.log("colorMapcolorMap", colorMap)
            console.log('id:', line_chart_id);
        };
    
        div.appendChild(iconButton);
        return div;
    };
    
    const initMapValue = { center: [23.69781, 120.96052], zoom: 7 };
    const [initialMapSettings, setInitialMapSettings] = useState({
        center: [23.69781, 120.96052],
        zoom: 7,
    });

    useEffect(() => {
        setCompareData((prevCompareData) => ({
            ...prevCompareData,
            selectedDate1: selectedDate1,
            selectedDate2: selectedDate2,
        }));
    }, [selectedDate1, selectedDate2])

    useEffect(() => {
        var map = L.map('bubble-map').setView(initialMapSettings.center, initialMapSettings.zoom);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors'
        }).addTo(map);

        // Listen to map events to update initialMapSettings
        map.on('moveend', () => {
            const newCenter = map.getCenter();
            const newZoom = map.getZoom();

            setInitialMapSettings({
                center: [newCenter.lat, newCenter.lng],
                zoom: newZoom,
            });
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

            marker.bindPopup(costumPopup(bubble.title, bubble.avg, bubble.id, bubble.category));
        });
        map.setMinZoom(7);
        return () => {
            // Clean up when the component unmounts
            if (map) {
                map.remove();
            }
        };
    // }, [bubbleChartData, selectedCities, sliderValue]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bubbleChartData, selectedCities, sliderValue, initialMapSettings, CompareData, selectedLabels]);

    const setInitView = () => {
        setInitialMapSettings({
            center: [initMapValue.center[0], initMapValue.center[1]],
            zoom: initMapValue.zoom,
        });
    }

    return (
    <div id="bubble-map-div">
        <div id="bubble-map"></div>
        <IconButton aria-label="home" size="large" className='home-btn' onClick={setInitView} >
            <HomeOutlinedIcon color="action" />
        </IconButton>
        <div className='bubble-map-legend'>
        {Object.entries(color_map).map(([category, color], index) => (
            <div key={index} className='legend-item'>
                <div style={{ height: '1rem', width: '1rem', backgroundColor: color }}></div>
                <span>&nbsp;{category}</span>
            </div>
        ))}
        </div>
        <div className='bubble-map-selector'>
            {Object.entries(selectedTarget).map(([category, data]) => (
                Object.entries(data).map(([_, content], index) => {
                    return(
                        <div className='selector-container'>
                        <IconButton
                            size="small"
                            aria-label="remove"
                            onClick={() => removeData(category, content[0])}
                            className='selector-remove-btn'
                            style={{ width:'.8rem', height:'.8rem' }}
                        >
                            <HighlightOffIcon fontSize="small" sx={{ backgroundColor: multi_color_map[category][index], borderRadius: 100}} />
                            {/* <HighlightOffIcon fontSize="small" sx={{ backgroundColor: colorMap[content[0]], borderRadius: 100}} /> */}
                        </IconButton> 
                        <div className='selector-remove-text'>
                            {content[1]}
                        </div>
                    </div>
                    )
                })
            ))}
        </div>
        {CompareData.selectedIndexes.length && <ChartPage data={CompareData} />}
    </div>
    );
};

export default BubbleMap;
