# Delhi beds scraper

A node.js based scraper that pulls information from the [Delhi Government COVID website](https://coronabeds.jantasamvad.org/) every four hours, and stores in the `data/beds` folder in the repository.

Combined time series for all hospitals is at `data/beds-by-hospital-timeseries.csv`. Combined time series for the entire city total is at `data/beds-total-timeseries.csv` 

Time format is Year-Month-Date-Hour-Minute.

## Running the code

Run `npm install` and then `npm run scrape` to pull the latest data.