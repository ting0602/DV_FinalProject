import React from 'react';
// import {ExpandMoreIcon, SearchRoundedIcon} from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, Box, FormControlLabel, Checkbox, Slider, TextField , IconButton } from '@mui/material';
// import DatePicker from '@mui/lab/DatePicker';
// import { DatePicker } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './Header.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const Header = () => {
    const cityList = { 
        "北部地區" :["臺北市", "新北市", "桃園市", "新竹縣", "新竹市", "基隆市", "宜蘭縣"], 
        "中部地區":["苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣"],
        "南部地區":["嘉義縣", "嘉義市", "臺南市", "高雄市", "屏東縣"],
        "東部地區":["花蓮縣", "臺東縣"],
        "離島地區":["澎湖縣", "金門縣", "連江縣"]}
    // const cityList = { 
    //     "北部地區" :["臺北市", "新北市", "桃園市", "新竹縣", "新竹市", "基隆市", "宜蘭縣"], 
    //     "中部地區":["苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣"],}
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
    
            // 更新地區的勾選狀態
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
    

    const [SliderValue, setSliderValue] = React.useState([100000, 1000000]);
    const [Date1value, setDate1value] = React.useState(new Date('2022-09-01'));
    const [Date2value, setDate2value] = React.useState(new Date('2023-09-01'));

    const handleChange = (event, newValue) => {
        setSliderValue(newValue);
    };
    // const marks = [
    //     {value: 0, label: '0',},
    //     {value: 2000000, label: '1',},
    //     {value: 4000000, label: '2',},
    //   ];

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
                        <span>日期：99/09 ~ 112/09</span>
                        <span>縣市：高雄市 台南市 新竹市 苗栗縣</span>
                        <span>人數：100 ~ 100000</span>
                    </div>
                </AccordionSummary>
                <AccordionDetails className='header-details'>
                    <div className='header-date-slider'>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        {/* <Box className="area-group">
                        {Object.entries(cityList).map(([region, cities]) => (
                            <FormControlLabel
                                key={region}
                                label={region}
                                control={
                                <Checkbox
                                    checked={cities.every((city) => checked.cityChecklist[city])}
                                    indeterminate={
                                        cities.some((city) => checked.cityChecklist[city]) &&
                                        !cities.every((city) => checked.cityChecklist[city])
                                      }
                                    onChange={(event) => handleChange2(event, region)}
                                />}
                            />
                        ))}
                        {Object.values(cityList).flat().map((city) => (
                            <FormControlLabel
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
                        </Box> */}
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
                        <IconButton aria-label="search" size="large">
                            <SearchRoundedIcon />
                        </IconButton>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default Header;
