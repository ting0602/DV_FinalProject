import './MainPage.css';
import React, {useState} from 'react';
import Header from '../Header';
import BubbleMap from '../BubbleMap';

const MainPage = () => {
    const [SelectedData, setSelectedData] = useState({
        selectedDate1: String,
        selectedDate2: String,
        selectedCities: Array,
        sliderValue: Array,
        selectedLabels: Array
    });

    const handleSearchClick = (searchData) => {
        setSelectedData(searchData)
    };

    return (
        <div id="main">
            <Header onSearchClick={handleSearchClick} />
            <BubbleMap data={SelectedData} />
        </div>
    )
}

export default MainPage