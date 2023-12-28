import React from 'react';
import './Map.css';

const Map = (props) => {
    const { selectedDate1, selectedDate2, selectedCities, sliderValue } = props.data;
    console.log("input: ", selectedDate1, selectedDate2, selectedCities, sliderValue)
    return (
        <div id="map">
            {/* {SelectedDate1}, {SelectedDate2}, {selectedCities[0]}, {ShowSliderValue[0]} */}
        </div>
    );
};

export default Map;
