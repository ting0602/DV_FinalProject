import React from 'react';
import './Map.css';

const Map = (props) => {
    const { selectedDate1, selectedDate2, selectedCities, sliderValue } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue)
    return (
        <div id="map">
            {selectedDate1}<br />{selectedDate2}<br />{selectedCities}<br />{sliderValue}
        </div>
    );
};

export default Map;
