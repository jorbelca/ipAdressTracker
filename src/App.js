import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import { useEffect, useState } from 'react';


function App() {
  const [dataApi, setDataApi] = useState('')
  const [ip, setip] = useState('38.29.142.180')
  const [newIp, setNewIp] = useState('')

  useEffect(() => {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${ip}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    },).then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(data => {
        setDataApi(data)

        let current_lat = data?.location?.lat ? data.location.lat : 51.505
        let current_long = data?.location?.lng ? data.location.lng : -0.09
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
    setNewIp('')
  }, [ip])
  function handleChange(e) {
    setNewIp(e.target.value)
  }
  function handleSubmit(e) {
    console.log('aaa');
    e.preventDefault()
    setip(newIp)
  }

  return (
    <>
      <div className="App">
        <div className="title">
          <h1>IP Adress Tracker</h1>
          <div className="form">
            <form onSubmit={handleSubmit} >
              <input type="text"
                value={newIp}
                onChange={handleChange}
                placeholder='Search for any IP adress or domain' />
              <button type="submit" >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="25"><path fill="none" stroke="#FFF" strokeWidth="2" d="M2 1l6 6-6 6" /></svg>
              </button>
            </form>
          </div>
        </div>
        <div className="info">
          <div className="ip">
            <div className="smallCont">
              IP Address</div>
            {dataApi?.ip}</div>
          <div className="vl"></div>

          <div className="location"><div className="smallCont">
            Location</div>{dataApi?.location?.city}</div>
          <div className="vl"></div>

          <div className="timezone"><div className="smallCont">
            Timezone</div>UTC {dataApi?.location?.timezone}</div>
          <div className="vl"></div>
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
