import { React, useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios'
import './App.css'
import Register from './components/Register';
import Login from './components/Login.jsx';

function App () {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
  const [ pins, setPins ] = useState( [] );
  const [ currentPlaceId, setCurrentPlaceId ] = useState( null );
  const [ newPlace, setNewPlace ] = useState( null );
  const [ title, setTitle ] = useState( null )
  const [ desc, setDesc ] = useState( null )
  const [ rating, setRating ] = useState( 0 )
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);

  const handleMarkerClick = ( id ) => {
    setCurrentPlaceId( id );
  };

  const handleAddClick = ( e ) => {
    const { lat, lng } = e.lngLat;
    setNewPlace( {
      lat: lat,
      lng: lng
    } )
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try {
      const res = await axios.post( "/pins", newPin );
      setPins( [ ...pins, res.data ] );
      setNewPlace( null );
    } catch ( err ) {
      console.log( err );
    }
  }

  useEffect( () => {
    const getPins = async () => {
      try {
        const allPins = await axios.get( "/pins" );
        setPins( allPins.data );
      } catch ( err ) {
        console.log( err );
      }
    };
    getPins();
  }, [] );

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }


  return <div className='App'>
    <Map
      initialViewState={ {
        width: "100vw",
        height: "100vh",
        longitude: 85.823450,
        latitude: 19.802970,
        zoom: 8,
        transitionDuration: "200"
      } }
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={ process.env.REACT_APP_MAPBOX }
      onDblClick={ handleAddClick }
    >
      { pins.map( p => (
        <>
          <Marker longitude={ p.long } latitude={ p.lat } anchor="bottom" >
            <LocationOnIcon style={ { fontSize: 35, color: p.username === currentUser ? "tomato" : 'slateblue', cursor: "pointer" } }
              onClick={ () => handleMarkerClick( p._id ) }
            />
          </Marker>
          { p._id === currentPlaceId && (
            <Popup
              key={ p._id }
              latitude={ p.lat }
              longitude={ p.long }
              closeButton={ true }
              closeOnClick={ false }
              onClose={ () => setCurrentPlaceId( null ) }
              anchor="left"
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{ p.title }</h4>
                <label>Review</label>
                <p className="desc">{ p.desc }</p>
                <label>Rating</label>
                <div className="stars">
                  { Array( p.rating ).fill( <StarIcon className="star" /> ) }
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{ p.username }</b>
                </span>
                <span className="date">{ p.createdAt }</span>
              </div>
            </Popup>
          ) }
        </>
      ) ) }
      { newPlace && (
        <Popup
          latitude={ newPlace.lat }
          longitude={ newPlace.lng }
          closeButton={ true }
          closeOnClick={ false }
          onClose={ () => setNewPlace( null ) }
          anchor="left"
        >
          <div>
            <form onSubmit={ handleSubmit }>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                autoFocus
                onChange={ ( e ) => setTitle( e.target.value ) }
              />
              <label>Description</label>
              <textarea
                placeholder="Say us something about this place."
                onChange={ ( e ) => setDesc( e.target.value ) }
              />
              <label>Rating</label>
              <select onChange={ ( e ) => setRating( e.target.value ) }>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="submitButton">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      ) }
      {currentUser ? (<button className='button logout' onClick={handleLogout}>Log Out</button>): (
        <div className='buttons'>
        <button className='button login' onClick={() => setShowLogin(true)}>Log in</button>
        <button className='button register' onClick={() => setShowRegister(true)}>Register</button>
      </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister}  />}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
    </Map>
  </div>
}
export default App;
