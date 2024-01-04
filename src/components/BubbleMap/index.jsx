import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import './BubbleMap.css';
import ChartPage from '../ChartPage';
import { renderToString } from 'react-dom/server';



const BubbleMap = (props) => {
    const { selectedDate1, selectedDate2, selectedCities, sliderValue, selectedLabels } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue, selectedLabels);

    const [csvData, setCsvData] = useState([]);
    

    // TODO: Optimize this function
    const normalizePeople = (value) => {
        // HINT: MinValue radius can't be 0!!!
        // return value / 10000;
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
        
        // Calculate the average and total
        const calc_total = () => {
            let year = +selectedDate1.split('/')[0], month = +selectedDate1.split('/')[1];
            const end_year = +selectedDate2.split('/')[0], end_month = +selectedDate2.split('/')[1];
            let total = 0, count = 0;
            let people_list = [];
            while(true) {
                const now = +data[`${year}/${String(month).padStart(2, '0')}`];
                if(now != 0) {total += now; count += 1; people_list.push(now)}
                if(year == end_year && month == end_month) break;
                month += 1;
                if(month > 12) { year += 1; month = 1;}
            }
            // console.log('total:', total);
            return [total, Math.round(total / count), people_list];
        }
        const people = calc_total();
        return ({
        id: index + 1,
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
        // selectedDate1: String,
        // selectedDate2: String,
        // selectedIndexes: Array,
        selectedDate1: "2018/01",
        selectedDate2: "2020/06",
        selectedIndexes: [0, 22, 33, 99],
    });

    const CustomPopUp = ({title, avg, data}) => {
        const add_line = () => {
            console.log('yo')
            if(CompareData.selectedDate1 == selectedDate1 && CompareData.selectedDate2 == selectedDate2) {

            }else { // date is updated
                console.log('date is updated');
                setCompareData({
                    selectedDate1: selectedDate1,
                    selectedDate2: selectedDate2,
                    selectedIndexes: data,
                })
            }
        }
        return (
            <div>
                <strong>{title}</strong>
                <button onClick={() => {
                    console.log('yo')
                    if(CompareData.selectedDate1 == selectedDate1 && CompareData.selectedDate2 == selectedDate2) {
        
                    }else { // date is updated
                        console.log('date is updated');
                        setCompareData({
                            selectedDate1: selectedDate1,
                            selectedDate2: selectedDate2,
                            selectedIndexes: data,
                        })
                    }
                }}>+</button>
                    <br />
                avg people: {avg}
            </div>
        )
    }

    useEffect(() => {
        const map = L.map('bubble-map').setView([23.69781, 120.96052], 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors'
        }).addTo(map);

        let filtered_data = bubbleChartData;
        if(selectedLabels != undefined) {
            filtered_data = bubbleChartData.filter((value) => {
                return (value.avg > sliderValue[0] && value.avg < sliderValue[1]);
            })
            .filter(value => {return selectedCities.includes(value.county)})
            .filter(value => {return selectedLabels.includes(value.category)})
        }

        filtered_data.forEach((bubble) => {
            L.circleMarker(bubble.location, {
                radius: normalizePeople(bubble.people), // Adjust the scaling factor as needed
                color: bubble.color,
                fillOpacity: 0.5,
                weight: 1 // stroke width
            }).addTo(map).bindPopup(renderToString(<CustomPopUp title={bubble.title} avg={bubble.avg} data={bubble.people_list}/>));
        });
        map.setMinZoom(7);
        return () => {
            // Clean up when the component unmounts
            map.remove();
        };
    }, [bubbleChartData, selectedCities, sliderValue]);

    

    return (
    <div id="bubble-map-div">
        <div id="bubble-map"></div>
        <ChartPage data={CompareData} />
    </div>
    );
};

export default BubbleMap;
