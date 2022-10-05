import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import { useEffect, useState } from 'react';


function App() {
  const [dataApi, setDataApi] = useState('')
  const [Ip, setIp] = useState('')

  useEffect(() => {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${Ip && '38.29.142.180'}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    },).then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(data => {
        setDataApi(data)

        let current_lat = data.location.lat
        let current_long = data.location.lng
        let current_zoom = 11;
        let center_lat = current_lat;
        let center_long = current_long;
        let center_zoom = current_zoom;

        // Before initializing map check for is the map is already initiated or not
        const container = L.DomUtil.get('map');
        if (container != null) {
          container._leaflet_id = null;
        }
        // The <div id="map"> must be added to the dom before calling L.map('map')
        let map = L.map('map', {
          center: [center_lat, center_long],
          zoom: center_zoom,
          dragging: true
        });
        map.setMaxBounds(null);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.circle([center_lat, center_long], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 500
        }).addTo(map);
      })

  }, [Ip])
  function handleChange(e) {
    e.preventDefault()
  }
  function handleSubmit(e) {
    e.preventDefault()
    setIp(e.target.value)
  }

  return (
    <>
      <div className="App">
        <div className="title">
          <h1>IP Adress Tracker</h1>
          <form onSubmit={handleSubmit} >
            <input type="text" value={Ip}
              placeholder='Search for any IP adress or domain' />
            <button type="submit" >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="25"><path fill="none" stroke="#FFF" strokeWidth="2" d="M2 1l6 6-6 6" /></svg>
            </button>
          </form>
        </div>
        <div className="info">
          <div className="ip">
            <div className="smallCont">
              IP Address</div>
            {dataApi?.ip}</div>
            <div class="vl"></div>

          <div className="location"><div className="smallCont">
            Location</div>{dataApi?.location?.city}</div>
            <div class="vl"></div>

          <div className="timezone"><div className="smallCont">
            Timezone</div>UTC {dataApi?.location?.timezone}</div>
            <div class="vl"></div>
          <div className="isp"><div className="smallCont">
            ISP</div>{dataApi?.isp}</div>
        </div>


        <div id="map" >

        </div>
      </div>


    </>
  );
}

export default App;
