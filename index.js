let form = document.querySelector('form')
let input = document.querySelector('#ip-field')
let ipField = document.querySelector('#ip-address')
let locationField = document.querySelector('#location')
let timeZoneField = document.querySelector('#timezone')
let ispField = document.querySelector('#isp')

const mymap = L.map('map')

const getIpAddress = async () => {
    let API_KEY = process.env.LEAFLET_API_KEY
    let IP_ADDRESS = input.value
    let URL = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${IP_ADDRESS}`
    let response = await fetch(URL)
    let data = await response.json()

    return data
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    getIpAddress().then(data => {
        console.log(data)
        mymap.setView([data.location.lat, data.location.lng], 13)

        ipField.innerHTML = `${data.ip}`
        locationField.innerHTML = `${data.location.country}, ${data.location.city}, ${data.location.region}`
        timeZoneField.innerHTML = `UTC ${data.location.timezone}`
        ispField.innerHTML = `${data.isp}`

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.MAPBOX_ACCESS_TOKEN
        }).addTo(mymap);

        let marker = L.marker([data.location.lat, data.location.lng]).addTo(mymap);
        marker.bindPopup(`${data.location.country}, ${data.location.city}, ${data.location.region}`).openPopup();
    })
})