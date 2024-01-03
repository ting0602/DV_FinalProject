import React, { useState } from 'react';
import ReactSvgZoomMap from 'react-svg-zoom-map';
import './Map.css';

const Map = (props) => {
    const [area, setArea] = useState(['', '', '']);
    const { selectedDate1, selectedDate2, selectedCities, sliderValue } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue);

    // Sample data for bubble chart (replace this with your actual data)
    const bubbleChartData = [
        { id: 1, title: '台北101', county: '臺北市', town: '信義區', village: '西村里', location: [25.034000, 121.564670], people: 1000 },
        { id: 2, title: '台灣最南點', county: '屏東縣', town: '恆春鎮', village: '鵝鑾里', location: [21.897750, 120.857921], people: 50 },
        { id: 3, title: '貓鼻頭燈塔', county: '新北市', town: '瑞芳區', village: '鼻頭里', location: [25.129217, 121.923449], people: 75 }
    ];

    // Sort the bubble chart data based on the number of people in descending order
    const sortedBubbleChartData = bubbleChartData.sort((a, b) => b.people - a.people);

    return (
        <div id="map">

            <ReactSvgZoomMap
                countyJsonSrc="https://cybermumu.github.io/react-svg-zoom-map/example/topojsons/taiwan-county.json"
                townJsonSrc="https://cybermumu.github.io/react-svg-zoom-map/example/topojsons/taiwan-town.json"
                villageJsonSrc="https://cybermumu.github.io/react-svg-zoom-map/example/topojsons/taiwan-village.json"
                county={area[0]}
                town={area[1]}
                village={area[2]}
                onAreaClick={(newArea, e) => setArea(newArea)}
                onPinClick={console.log}
                pins={sortedBubbleChartData.map((bubble) => ({
                    id: bubble.id,
                    title: bubble.title,
                    county: bubble.county,
                    town: bubble.town,
                    village: bubble.village,
                    location: bubble.location,
                    // Customized bubble properties (size, color, etc.) based on the number of people
                    bubble: {
                        size: bubble.people, // Use the number of people for the bubble size
                        color: 'blue' // You can customize the color based on your needs
                    }
                }))}
            />

        </div>
    );
};

export default Map;
