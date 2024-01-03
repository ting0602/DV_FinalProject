import './ChartPage.css';
import React, { useState, useEffect } from 'react';
import { Popper } from "@mui/base/Popper";
import { LineChart } from '@mui/x-charts';
import { Snackbar  } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
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
    const { selectedDate1, selectedDate2, selectedIndexes } = props.data;

    const [targetData, setTargetData] = useState([]);
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
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/data_with_addresses.csv');
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
        setTargetData(selectedIndexes.map(index => csvData[index]));
    }, [csvData, props, selectedIndexes]);

    console.log('CSV Data From chart:', csvData.slice(0, 100));
    console.log('target data:', targetData);
    // console.log("csvData[0]", csvData[0])
    // console.log(csvData[2])


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
    
    const action = (
        <div className='chart-windows' >
            <IconButton
                size="small"
                aria-label="close"
                onClick={handleClose}
                className='chart-close-btn'
            >
                <CloseIcon fontSize="small" />
            </IconButton>
            
            <LineChart
                xAxis={[{ scaleType: 'point', data: xAxisData }]}
                series={[
                { curve: "linear", data: [0, 5, 2, 6, 3, 9.3], label: '11', id: '11' },
                { curve: "linear", data: [6, 3, 7, 9.5, 4, 2], label: '22', id: '22' },
                { curve: "linear", data: [3, 6, 3, 13.5, 8, 3], label: '33', id: '33' },
                ]}
                width={500}
                height={300}
                position="top"
                slots={{
                    popper: CustomPopperRoot,
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