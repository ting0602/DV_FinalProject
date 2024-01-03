import './ChartPage.css';
import React from 'react';
import { LineChart } from '@mui/x-charts';
import { Snackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

const ChartPage = () => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
  
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
            className='line-chart'
            position="top"
          />
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
            />
        </div>
    )
}

export default ChartPage