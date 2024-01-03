import './MainPage.css';
import React from 'react';
import Header from '../Header';
// import Map from '../Map';
import BubbleMap from '../BubbleMap';
import ChartPage from '../ChartPage';

const MainPage = () => {
    const [SelectedData, setSelectedData] = React.useState({
        selectedDate1: String,
        selectedDate2: String,
        selectedCities: Array,
        sliderValue: Array,
    });
    const handleSearchClick = (searchData) => {
        console.log('Received searchData in MainPage:', searchData);
        setSelectedData(searchData)
    };
    return (
        <div id="main">
            <Header  onSearchClick={handleSearchClick} />
            <BubbleMap data={SelectedData} />
            <ChartPage />
        </div>
    )
}

export default MainPage