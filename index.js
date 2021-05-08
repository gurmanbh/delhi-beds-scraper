const covidDataURL = 'https://coronabeds.jantasamvad.org/covid-info.js'
// const covidFacilitiesURL = 'https://coronabeds.jantasamvad.org/covid-facilities.js'

const io = require('indian-ocean')
const time = require('d3-time-format')
const parse = time.timeParse('%I:%M %p, %B %e')
const format = time.timeFormat("%2021-%m-%d-%H-%M")
const parseOuter = time.timeParse('%I:%M %p, %e %B %Y')

const fetchData = require('./lib/getUrl');
const combine = require('./lib/combine');


const names = ['beds', 'icu_beds_without_ventilator', 'noncovid_icu_beds', 'ventilators', 'covid_icu_beds', 'oxygen_left_for']
const run = async() => {
	const covidData = await (fetchData(covidDataURL, 'gnctd_covid_data'))

	const beds = covidData.beds
	const icu_beds_without_ventilator = covidData.icu_beds_without_ventilator
	const noncovid_icu_beds = covidData.noncovid_icu_beds
	const ventilators = covidData.ventilators
	const covid_icu_beds = covidData.covid_icu_beds
	const oxygen_left_for = covidData.oxygen_left_for

	const mergedData = await merged([beds, icu_beds_without_ventilator, noncovid_icu_beds, ventilators, covid_icu_beds, oxygen_left_for])
	writeCSV(mergedData, covidData.last_updated_at)
}

run()

const merged = async(list) => {
  let mergedData = {}
  list.forEach(function(array, index){
  	for (var key in array) {
	    if (array.hasOwnProperty(key)) {
	    	if (!mergedData[key]){
	    		mergedData[key] = {}
	    	}
	    	
	    	mergedData[key][names[index]] = array[key]
	    	if (array[key].type){
	    		mergedData[key].props = {
	    			type: array[key].type,
	    			last_updated_at: convertTime(array[key].last_updated_at)
	    		}
	    		delete mergedData[key][names[index]].type;
	    		delete mergedData[key][names[index]].last_updated_at; 
	    	}
	    }
	}
  })
  return mergedData
};

const writeCSV = async(merged, last_updated_at) => {
	let data = []
	for (var key in merged) {
		const o = {
			name: key
		}
		for (var miniKey in merged[key]) {
			if (miniKey!='props'){
				if (names.includes(miniKey)){
					for (var typeInfo in merged[key][miniKey]){
						o[miniKey+'_'+typeInfo] = merged[key][miniKey][typeInfo]
					}
				} else {
					o[miniKey] = merged[key][miniKey]	
				}
			} else {
				for (var propKey in merged[key][miniKey]){
					o[propKey] = merged[key][miniKey][propKey]
				}
			}
		}
		if (key=='All'){
			o['last_updated_at'] = format(parseOuter(last_updated_at))
		}
		data.push(o)
	}
	
	io.writeDataSync(`data/beds/${convertTimeOuter(last_updated_at)}.csv`, data)
	combine('./data/beds/', './data/beds-by-hospital-timeseries.csv', './data/beds-total-timeseries.csv')
}

function convertTime(time){
	return format(parse(time))
}


function convertTimeOuter(time){
	return format(parseOuter(time))
}