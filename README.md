# DV_FinalProject
**2023 NYCU Data Visualization and Visual Analytics Final Project**
## Introduction
In this assignment, our emphasis will be on how to quickly and intuitively analyze the popularity trends of Taiwan's tourist attractions over the years. Therefore, we have chosen to utilize a dataset containing statistics on the number of visitors to Taiwan's tourist spots over the years. Additionally, we will incorporate geographical information visualization to enhance the user's ability to analyze the data more effectively.

## Dataset
* [交通部觀光署觀光統計資料庫 - 觀光遊憩據點人次統計](https://stat.taiwan.net.tw/scenicSpot)
* Employing web scraping and the Google Maps API to acquire relevant information
  * Attraction addresses
  * Latitude and longitude coordinates
  * Photos
## Implementation Methods:
### 1. Main Presentation:
 * We present the data on a map of Taiwan combined with a bubble chart. The bubble's position represents the actual location of the attraction, its size indicates the average monthly visitor count, and its color corresponds to the type of attraction.
 ![image](https://github.com/ting0602/DV_FinalProject/blob/master/overview.png)
### 2. Data Filtering:
 * Users can perform preliminary filtering of the data on the map based on date, visitor count range, county, and attraction type.
 ![image](https://github.com/ting0602/DV_FinalProject/blob/master/demo2.png)
### 3. In-Depth Analysis:
  * Clicking on a bubble reveals the monthly average visitor count, attraction photos, and provides a link to the attraction's location on Google Maps.
  * Users can click on bubbles to add attractions to a line chart comparing the historical visitor counts of up to ten attractions. There is a limit on the number of selected attractions to maintain the readability of the line chart.
  * Selected attractions on the line chart share the same color scheme to facilitate comparison of trends. Users can also switch to random colors for better distinction between attractions.
  ![image](https://github.com/ting0602/DV_FinalProject/blob/master/demo1.png)
## Usage: Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts
First, you should run:

```
git clone https://github.com/ting0602/DV_FinalProject.git
```


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
