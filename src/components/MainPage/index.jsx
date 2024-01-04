import './MainPage.css';
import React, {useState} from 'react';
import Header from '../Header';
// import Map from '../Map';
import BubbleMap from '../BubbleMap';
// import ChartPage from '../ChartPage';

const MainPage = () => {
    const [SelectedData, setSelectedData] = useState({
        selectedDate1: String,
        selectedDate2: String,
        selectedCities: Array,
        sliderValue: Array,
        selectedLabels: Array
    });
    // const [CompareData, setCompareData] = useState({
    //     // selectedDate1: String,
    //     // selectedDate2: String,
    //     // selectedIndexes: Array,
    //     selectedDate1: "2000/01",
    //     selectedDate2: "2018/06",
    //     selectedIndexes: [0, 22, 33, 99],
    // });

    const handleSearchClick = (searchData) => {
        console.log('Received searchData in MainPage:', searchData);
        setSelectedData(searchData)
    };

    return (
        <div id="main">
            <Header onSearchClick={handleSearchClick} />
            <BubbleMap data={SelectedData} />
            {/* <ChartPage data={CompareData} /> */}
        </div>
    )
}

export default MainPage