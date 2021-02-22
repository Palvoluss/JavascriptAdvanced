import _ from 'lodash'
import './styles.css'

// --------- API TOKEN ---------

const api = {
  token: process.env.API_KEY,
  base: 'https://api.waqi.info'
}

// --------- GEOLOCATION CHECK ---------

if ('geolocation' in navigator) {
  console.log('geolocation serviece available')
  window.alert('This app use Geolocation service')
} else {
  console.log('geolocation serviece not available')
  window.alert("Part of this app use Geolocation service, your geolocation service aren't available, active them or continue by using the search bar")
  document.querySelector('.geo_btn').style.visibility = 'hidden'
}

// --------- GET GEOLOCATION  ---------
const useGeolocation = document.querySelector('.geo_btn')
useGeolocation.addEventListener('click', userGeo)

function userGeo () {
  navigator.geolocation.getCurrentPosition(function (position) {
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    getCoords(latitude, longitude)
  })
}

function getCoords () {
  fetch(`${api.base}/feed/geo:${latitude};${longitude}/?token=${api.token}`)
    .then(datasetgeo => {
      return datasetgeo.json()
    }).then(nearCity)
}

// --------- FIND NEAREST CITY ---------

function nearCity (datasetgeo) {
  getResults(datasetgeo.data.city.name)
}

// --------- SEARCH BAR ---------

const searchCity = document.querySelector('.search_city')
searchCity.addEventListener('keypress', setQuery)

function setQuery (evt) {
  if (evt.keyCode === 13) {
    getResults(searchCity.value)
  }
}

function getResults (query) {
  fetch(`${api.base}/search/?token=${api.token}&keyword=${query}`)
    .then(dataset => {
      return dataset.json()
    }).then(displayResults)
}

// --------- DISPLAY RESULTS SEARCH BAR ---------

function displayResults (dataset) {
  if (dataset.data.length === 0) {
    window.alert('Can\'t handle the request, probably you misspelled the name of your city, or if you used the geolocation it took too much time to handle the request. Please try again!')
    document.querySelector('.geo_btn').click()
    return null
  } else {
    const city = document.querySelector('.location')
    city.innerText = dataset.data[0].station.name

    const update = document.querySelector('h3.update')
    update.innerText = 'Last update: ' + `${dataset.data[0].time.stime}`

    const index = document.querySelector('.index')
    const indexValue = (`${dataset.data[0].aqi}`)
    index.innerText = indexValue

    let commentText
    let image
    let warning
    switch (true) {
      case (indexValue < 50):
        commentText = 'Air quality is Good'
        image = 'Good.png'
        warning = 'Air quality is considered satisfactory, and air pollution poses little or no risk'
        // background = ''
        break
      case (indexValue < 100):
        commentText = 'Air quality is Moderate'
        image = 'Moderate.png'
        warning = 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.'
        // background = ''
        break
      case (indexValue < 150):
        commentText = 'Air quality is Unhealthy for Sensitive Groups'
        image = 'Unhealthy.png'
        warning = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.'
        // background = ''
        break
      case (indexValue < 200):
        commentText = 'Air quality is Unhealthy'
        image = 'UnhealthyRisk.png'
        warning = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects'
        // background = ''
        break
      case (indexValue < 300):
        commentText = 'Air quality is Very Unhealthy'
        image = 'VeryUnhealthy'
        warning = 'Health warnings of emergency conditions. The entire population is more likely to be affected.'
        // background = ''
        break
      case (indexValue < 999):
        commentText = 'Air quality is Hazardous'
        image = 'Hazardous.png'
        warning = 'Health alert: everyone may experience more serious health effects'
        // background = ''
        break
    }

    const comment = document.querySelector('.comment')
    comment.innerText = commentText

    const png = document.querySelector('td.png')
    png.innerHTML = "<img src='../src/img/" + image + "' width='140px' height='auto'>"

    const hint = document.querySelector('td.hint')
    hint.innerText = warning
  }
}

// --------- CHANGING PAGE JQUERY ---------

$(document).ready(function () {
  $('.search_city').on('keypress', function (e) {
    if (e.which == 13) {
      $(this).toggleClass('on')
      $('#selector').toggleClass('active')
      $('#information').toggleClass('active')
    }
  })

  $('.geo_btn').click(function () {
    $(this).toggleClass('on')
    $('#selector').toggleClass('active')
    $('#information').toggleClass('active')
  })

  $('#rty_btn').click(function () {
    $(this).toggleClass('on')
    $('#information').toggleClass('active')
    $('#selector').toggleClass('active')
  })
})
