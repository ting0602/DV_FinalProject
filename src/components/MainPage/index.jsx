import './MainPage.css';
import React from 'react';
import Header from '../Header';
import Map from '../Map';

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
            <Map data={SelectedData} />
            {/* <div>Padding</div> */}
            {/* <div>
                HELLO 嗨嗨
            </div> */}
        </div>
    )
}

export default MainPage