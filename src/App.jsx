import React, { useState } from "react";
import { GoogleMap, LoadScript, StreetViewPanorama, Marker } from "@react-google-maps/api";

const API_KEY = process.env['API_KEY'];

const sigma = 50;
const maxRounds = 5;

function App() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [randomLocation, setRandomLocation] = useState(getRandomLocation());
  const [guessLocation, setGuessLocation] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  function getRandomLocation() {
    const lat = (Math.random() * 170) - 85;
    const lng = (Math.random() * 360) - 180;
    return { lat, lng };
  }

  function gaussianScore(distance) {
    return Math.round(1000 * Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(sigma, 2))));
  }

  function handleMapClick(event) {
    setGuessLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(randomLocation),
      event.latLng
    ) / 1000;

    const roundScore = gaussianScore(distance);
    setScore(prevScore => prevScore + roundScore);

    if (round < maxRounds) {
      setRound(prevRound => prevRound + 1);
      setGuessLocation(null);
      setRandomLocation(getRandomLocation());
    } else {
      setGameOver(true);
    }
  }

  function startNewGame() {
    setScore(0);
    setRound(1);
    setGuessLocation(null);
    setRandomLocation(getRandomLocation());
    setGameOver(false);
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: '10px', backgroundColor: '#f7f7f7', borderBottom: '1px solid #ddd' }}>
        <h1>GeoGuessr Clone</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Score: {score}</span>
          <span>Round: {round}/{maxRounds}</span>
        </div>
        <p>Click on the map where you think the Street View location is!</p>
      </header>

      <LoadScript googleMapsApiKey={API_KEY}>
        <div style={{ display: 'flex' }}>
          <StreetViewPanorama
              position={randomLocation}
              style={{ width: '50%', height: 'calc(100vh - 150px)' }}
          />

          <GoogleMap
              center={{ lat: 20, lng: 0 }}
              zoom={2}
              onClick={handleMapClick}
              style={{ width: '50%', height: 'calc(100vh - 150px)' }}
          >
              {guessLocation && <Marker position={guessLocation} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />}
          </GoogleMap>
        </div>
      </LoadScript>

      {gameOver && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Game Over! Your total score is: {score}</p>
          <button onClick={startNewGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
