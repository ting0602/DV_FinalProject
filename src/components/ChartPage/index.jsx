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
import ColorLensIcon from '@mui/icons-material/ColorLens';
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
    const [realColor, setIsRealColor] = useState(true);

    const handleScreen = () => {
        setIsFullscreen((prev) => !prev);
    };
  
    const handleColorList = () => {
        setIsRealColor((prev) => !prev);
    }
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
            const updatedTargetData = selectedData.map(item => {

                const filteredItem = {
                    "縣市": item["縣市"],
                    "類型": item["類型"],
                    "遊憩據點": item["遊憩據點"],
                    "id": item["id"],
                };
                const startDate = new Date(selectedDate1);
                const endDate = new Date(selectedDate2);

                for (const key in item) {
                    const currentDate = new Date(key);
                    if (currentDate >= startDate && currentDate <= endDate) {
                        filteredItem[key] = item[key];
                    }
                }

                return filteredItem;
            });
            const sortedSelectedColor = [...selectedColor].sort((a, b) => a[0] - b[0]);
            setColorMap(sortedSelectedColor.map(item => item[1]));
            const sortedTargetData = [...updatedTargetData].sort((a, b) => a.id - b.id);

            setTargetData(sortedTargetData);
        } else {
            console.log("selectedData is empty");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [csvData, props, selectedDate1, selectedDate2, selectedIndexes]);

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
    
    const xAxisDate = createDateArray(selectedDate1, selectedDate2);
    
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
                    {isFullscreen ? <FullscreenExitIcon fontSize="medium" /> : <FullscreenIcon fontSize="medium" />}
                </IconButton>
                <IconButton
                    size="medium"
                    aria-label="screen"
                    onClick={handleColorList}
                    className='chart-screen-btn'
                >
                    <ColorLensIcon fontSize="small" />
                </IconButton>
            </div>
            <LineChart
                xAxis={[{ scaleType: 'point', data: xAxisDate }]}
                series={targetData.map((item, index) => ({
                    curve: 'linear',
                    data: xAxisDate.map(date => item[date] || 0), 
                    label: item['遊憩據點'], 
                    id: item['遊憩據點'], 
                }))}
                {...(realColor ? { colors: colorMap } : {})}
                width={isFullscreen ? 1450 : 700}
                height={isFullscreen ? 520 : 450}
                margin={{ top: 120, right: 50, bottom: 50, left: 100 }}
                position="top"
                slots={{
                    popper: CustomPopperRoot,
                }}
                sx={{
                    '.MuiMarkElement-root': {
                      scale: '0.6', 
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