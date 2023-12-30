import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, FormControlLabel, Checkbox, Slider, TextField , IconButton } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './Header.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const Header = ({ onSearchClick }) =>  {
    //// Area ////
    const cityList = { 
        "北部地區" :["臺北市", "新北市", "桃園市", "新竹縣", "新竹市", "基隆市", "宜蘭縣"], 
        "中部地區":["苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣"],
        "南部地區":["嘉義縣", "嘉義市", "臺南市", "高雄市", "屏東縣"],
        "東部地區":["花蓮縣", "臺東縣"],
        "離島地區":["澎湖縣", "金門縣", "連江縣"]}

    const cityArray = Object.values(cityList).flat();

    const [checked, setChecked] = React.useState({
        allCities: true,
        cityChecklist: Object.fromEntries(
            [
                ...Object.keys(cityList), 
                ...Object.values(cityList).flat(),
            ].map((item) => [item, true])
        ),
    });
 
    const handleChange1 = (event) => {
        setChecked({
            allCities: event.target.checked,
            cityChecklist: Object.fromEntries(
                [
                    ...Object.keys(cityList), 
                    ...Object.values(cityList).flat(),
                ].map((item) => [item, event.target.checked])
            ),
        });
    };
    
    const handleChange2 = (event, region) => {
        setChecked((prev) => {
            const updatedCityChecklist = { ...prev.cityChecklist };
            const citiesInRegion = cityList[region];
    
            citiesInRegion.forEach((city) => {
                updatedCityChecklist[city] = event.target.checked;
            });

            updatedCityChecklist[region] = event.target.checked;
    
            return {
                ...prev,
                cityChecklist: updatedCityChecklist,
                allCities: Object.values(updatedCityChecklist).every((city) => city),
            };
        });

    };  
    
    const handleChange3 = (event, city) => {
        setChecked((prev) => ({
            ...prev,
            cityChecklist: {
            ...prev.cityChecklist,
            [city]: event.target.checked,
            },
            allCities: false,
        }));

    };

    //// Date ////
    const [SliderValue, setSliderValue] = React.useState([100000, 1000000]);
    const [Date1value, setDate1value] = React.useState(new Date('2022-09-01'));
    const [Date2value, setDate2value] = React.useState(new Date('2023-09-01'));

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');  // 月份從0開始
        const formattedDate = `${year}/${month}`;
        return formattedDate
    }

    //// People ////
    const handleChange = (event, newValue) => {
        setSliderValue(newValue);
    };
    // const marks = [
    //     {value: 0, label: '0',},
    //     {value: 2000000, label: '1',},
    //     {value: 4000000, label: '2',},
    //   ];

    //// Search ////
    const [ShowSliderValue, setShowSliderValue] = React.useState([100000, 1000000]);
    const [CityNum, setCityNum] = React.useState(22);
    const [SelectedDate1, setSelectedDate1] = React.useState(new Date('2022-09-01'));
    const [SelectedDate2, setSelectedDate2] = React.useState(new Date('2023-09-01'));

    const [searchData, setSearchData] = React.useState({
        selectedDate1: formatDate(SelectedDate1),
        selectedDate2: formatDate(SelectedDate2),
        selectedCities: cityArray,
        sliderValue: [100000, 1000000],
    });
    const [isCityError, setIsCityError] = React.useState(false);

    // 初始時執行一次
    React.useEffect(() => {
        onSearchClick(searchData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    
    const handleSearchClick = () => {

        // 獲取選定的縣市
        const selectedCities = Object.entries(checked.cityChecklist)
            .filter(([city, isSelected]) => isSelected && city !== 'allCities' && !cityList.hasOwnProperty(city))
            .map(([city]) => city);

        console.log('選定的縣市:', selectedCities);

        if (selectedCities.length > 0) {
            setCityNum(selectedCities.length)

            // 獲取選定的日期
            if (Date1value > Date2value) {
                const tempDate = Date1value;
                setDate1value(Date2value);
                setDate2value(tempDate);
            }
            console.log('選定的日期範圍:', formatDate(Date1value), '至', formatDate(Date2value));
            setSelectedDate1(Date1value)
            setSelectedDate2(Date2value)
    
            // 獲取 Slider 範圍值
            console.log('Slider 範圍值:', SliderValue);
            setShowSliderValue(SliderValue)
    
            setSearchData({
                SelectedDate1,
                SelectedDate2,
                selectedCities,
                ShowSliderValue,
            });
            setIsCityError(false);
            
            onSearchClick(searchData);
        } else {
            setIsCityError(true);
        }

    };


    return (
        <div id="header">
            <Accordion>
                <AccordionSummary
                    style={{backgroundColor: '#ecfaff'}}
                    className='header-summary'
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <div className='header-content'>
                        <span>日期範圍：{formatDate(SelectedDate1)} ~ {formatDate(SelectedDate2)}</span>
                        <span>月均人數：{ShowSliderValue[0]} ~ {ShowSliderValue[1]}</span>
                        <span>選定縣市數：{CityNum}</span>
                    </div>
                </AccordionSummary>
                <AccordionDetails className='header-details'>
                    <div className='header-date-slider'>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div className='date-group'>
                                <span>日期範圍：</span>
                                <div className='date-selector'>
                                    <DatePicker
                                        className='selector-item'
                                        views={['year', 'month']}
                                        label="Year and Month"
                                        minDate={new Date('2008-09-01')}
                                        maxDate={new Date('2023-09-01')}
                                        value={Date1value}
                                        onChange={(newValue) => {
                                            setDate1value(newValue);
                                        }}
                                        TextFieldComponent={(props) => <TextField {...props} helperText={null} />}
                                        format="yyyy/MM"
                                    />
                                    <DatePicker
                                        className='selector-item'
                                        views={['year', 'month']}
                                        label="Year and Month"
                                        minDate={new Date('2008-09-01')}
                                        maxDate={new Date('2023-09-01')}
                                        value={Date2value}
                                        onChange={(newValue) => {
                                            setDate2value(newValue);
                                        }}
                                        TextFieldComponent={(props) => <TextField {...props} helperText={null} />}
                                        format="yyyy/MM"
                                    />
                                </div>
                            </div>
                        </LocalizationProvider>

                        <div className='slider-selector'>
                            <span>月均人數範圍：</span>
                            <Slider
                                className='slider-item '
                                getAriaLabel={() => '人數'}
                                value={SliderValue}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={4163386} 
                                step={1000}
                                // marks={marks}
                            />
                        </div>
                    </div>
                    <div className='header-area'>
                        {/* <span>地區：{isCityError && "請選擇至少一個縣市"}</span> */}
                        {isCityError && <span style={{ color: 'red' }}>地區：請選擇至少一個縣市</span>}
                        {!isCityError && <span>地區：</span>}
                        <FormControlLabel
                        label="全台"
                        control={
                            <Checkbox
                                checked={checked.allCities}
                                indeterminate={Object.values(checked.cityChecklist).some((city) => city) && !checked.allCities}
                                onChange={handleChange1}
                            />
                        }
                        />
                        <Box className="area-group">
                            {Object.entries(cityList).map(([region, cities]) => (
                                <div key={region}>
                                    <FormControlLabel 
                                        className="region-checkbox"
                                        label={region}
                                        control={
                                            <Checkbox
                                                checked={cities.every((city) => checked.cityChecklist[city])}
                                                indeterminate={
                                                    cities.some((city) => checked.cityChecklist[city]) &&
                                                    !cities.every((city) => checked.cityChecklist[city])
                                                }
                                                onChange={(event) => handleChange2(event, region)}
                                            />
                                        }
                                    />
                                    {cities.map((city) => (
                                        <FormControlLabel
                                            className="city-checkbox"
                                            key={city}
                                            label={city}
                                            control={
                                                <Checkbox
                                                    checked={checked.cityChecklist[city]}
                                                    onChange={(event) => handleChange3(event, city)}
                                                />
                                            }
                                        />
                                    ))}
                                </div>
                            ))}
                        </Box>
                    </div>
                    <div>
                        <IconButton aria-label="search" size="large" onClick={handleSearchClick}>
                            <SearchRoundedIcon />
                        </IconButton>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default Header;