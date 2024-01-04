import './ChartPage.css';
import React, { useState, useEffect } from 'react';
import { Popper } from "@mui/base/Popper";
import { LineChart } from '@mui/x-charts';
import { Snackbar  } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Papa from 'papaparse';
const CustomPopperRoot = (props) => (
    <Popper
      {...props}
      anchorEl={{
        getBoundingClientRect: () => ({
          ...props.anchorEl?.getBoundingClientRect(),
          y: 250,
          top: 250,
        }),
      }}
    //   style={{ zIndex: 1500 }}
    />
  );

const ChartPage = (props) => {
    const { selectedDate1, selectedDate2, selectedIndexes, selectedColor } = props.data;

    const [targetData, setTargetData] = useState([]);
    const [colorMap, setColorMap] = useState([])
    // target_array = [0, 2, 100, 55]

    const [open, setOpen] = useState(false);
    const [csvData, setCsvData] = useState([]);

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleScreen = () => {
      setIsFullscreen((prev) => !prev);
    };
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/data_with_id.csv');
                const text = await response.text();
                const result = Papa.parse(text, { header: true });
                setCsvData(result.data);
            } catch (error) {
                console.error('Error fetching CSV:', error);
            }
        };
    
        fetchData();
    }, []);
    useEffect(() => {
        // Update target data when props.data changes
        const selectedData = (selectedIndexes.map(index => csvData[index]));

        if (selectedData.length > 0 && selectedData[0]) {
            console.log("selectedData not none", selectedData)
            const updatedTargetData = selectedData.map(item => {
                // 保留需要的列
                console.log("item", item)
                const filteredItem = {
                    "縣市": item["縣市"],
                    "類型": item["類型"],
                    "遊憩據點": item["遊憩據點"],
                    "id": item["id"],
                };
                const startDate = new Date(selectedDate1);
                const endDate = new Date(selectedDate2);
                // 提取所选日期范围的数据
                for (const key in item) {
                    const currentDate = new Date(key);
                    if (currentDate >= startDate && currentDate <= endDate) {
                        filteredItem[key] = item[key];
                    }
                }

                return filteredItem;
            });
            
            // const colorMap = new Map(selectedColor);
            const sortedSelectedColor = [...selectedColor].sort((a, b) => a[0] - b[0]);
            setColorMap(sortedSelectedColor.map(item => item[1]));

            // 根據 updatedTargetData 的每個項目，從 colorMap 中取得對應的顏色
            // const colorList = updatedTargetData.map(item => colorMap.get(item.id));
            const sortedTargetData = [...updatedTargetData].sort((a, b) => a.id - b.id);

            // colorList 將是一個包含對應顏色的陣列，順序與 updatedTargetData 一致
            // console.log(colorList);
            console.log("TODO:colorList", colorMap, sortedTargetData)

            setTargetData(sortedTargetData);
        } else {
            console.log("selectedData is empty");
            // Handle the case when selectedData is empty
        }
            // setTargetData(updatedTargetData);
    }, [csvData, props, selectedDate1, selectedDate2, selectedIndexes]);

    // console.log('CSV Data From chart:', csvData.slice(0, 100));
    console.log('target data:', targetData);
    console.log('select data:', selectedDate1, selectedDate2);


    const createDateArray = (startDate, endDate) => {
        const dateArray = [];
        let currentDate = new Date(startDate);
    
        while (currentDate <= new Date(endDate)) {
            const formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' });
            const [month, year] = formattedDate.split('/');
            const reversedDate = `${year}/${month}`;
            dateArray.push(reversedDate);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    
        return dateArray;
    };

    const date1 = '2022/08';
    const date2 = '2023/01';

    const xAxisData = createDateArray(date1, date2);
    console.log(xAxisData);
    
    const xAxisDate = createDateArray(selectedDate1, selectedDate2);
    console.log("target date for x", xAxisDate);
    
    const action = (
        <div className='chart-windows' >
            <div className='chart-btn-group'>
                <IconButton
                    size="small"
                    aria-label="close"
                    onClick={handleClose}
                    className='chart-close-btn'
                >
                    <CloseIcon fontSize="medium" />
                </IconButton>
                <IconButton
                    size="medium"
                    aria-label="screen"
                    onClick={handleScreen}
                    className='chart-screen-btn'
                >
                    {isFullscreen ? <FullscreenExitIcon fontSize="medium" /> : <FullscreenIcon fontSize="small" />}
                </IconButton>
            </div>
            <LineChart
                xAxis={[{ scaleType: 'point', data: xAxisDate }]}
                series={targetData.map((item, index) => ({
                    curve: 'linear',
                    data: xAxisDate.map(date => item[date] || 0), // Use 0 if the date is not available
                    label: item['遊憩據點'], // Assuming '類型' is the label you want to use
                    id: item['遊憩據點'], // You can adjust the ID as needed
                }))}
                colors={colorMap}
                width={isFullscreen ? 1450 : 700}
                height={isFullscreen ? 520 : 450}
                margin={{ top: 120, right: 50, bottom: 50, left: 100 }}
                position="top"
                slots={{
                    popper: CustomPopperRoot,
                }}
                sx={{
                    '.MuiMarkElement-root': {
                      scale: '0.6',  // 這裡是調整點的大小的地方
                      strokeWidth: 2,
                    },
                }}
            >
            </LineChart>
        </div>
    );

    return (
        <div id="chart-page">
            {!open && <IconButton
                size="large"
                aria-label="close"
                color="inherit"
                onClick={handleClick}
                className='chart-btn'
            >
                <InsertChartOutlinedIcon  fontSize="large" />
            </IconButton>}
            <Snackbar
                open={open}
                onClose={handleClose}
                action={action}
                className='chart-container'
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                style={{ zIndex: 0 }} 
            />
        </div>
    )
}

export default ChartPage