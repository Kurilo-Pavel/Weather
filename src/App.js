import React, {Component} from 'react';
import {DateTime} from 'luxon';

import './App.css';

const API_URL = 'https://api.openweathermap.org/data/2.5/';
const API_KEY = process.env.REACT_APP_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      weather: null,
      isLoading: false,
      isText: false,
    };
  }

  handleSearchChange = (e) => {
    this.setState({
      searchQuery: e.target.value,
    });
  };

  sendRequest = () => {
    const {searchQuery} = this.state;

    fetch(`${API_URL}weather?q=${searchQuery}&appid=${API_KEY}&units=metric`,
    )
      .then((response) => response.json())
      .then((response) =>
        this.setState({
          weather: response,
          isLoading: false,
        })
      );
  };

  handleSearchSubmit = (e) => {
    if (e.key !== 'Enter') {
      return;
    }

    this.setState({
      isLoading: true,
    }, this.sendRequest);

  };

  textTime = () => {
    this.state.isText ?
      this.setState({
        isText: false,
      }) :
      this.setState({
        isText: true,
      })
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState.weather !== null) {
      if (nextState.weather.name === undefined) {
        this.textTime();
        setTimeout(this.textTime, 2000)
        this.setState({
          searchQuery: '',
          isLoading: false,
          weather: null,
        })
        return false
      }
    }
    return true
  }

  render() {
    const {searchQuery, weather, isLoading, isText} = this.state;

    return (
      <div
        className={
          weather && weather.main.temp < 0 ? 'container cold' : 'container'
        }
      >
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchQuery}
          onChange={this.handleSearchChange}
          onKeyDown={this.handleSearchSubmit}
          disabled={isLoading === true}
        />

        {isLoading ? <div className="loader">
          <div className="dot1"/>
          <div className="dot2"/>
          <div className="dot3"/>
          <div className="dot4"/>
          <div className="dot5"/>
          <div className="dot6"/>
          <div className="dot7"/>
        </div> : null}

        {weather ? (
          <div>
            <div className="location-wrapper">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">
                {DateTime.fromSeconds(weather.dt).toLocaleString(
                  DateTime.DATE_HUGE
                )}
              </div>
            </div>
            <div className="weather-wrapper">
              <div className="temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : null}
        {isText ? <div className="text">"There is no such city"</div> : null}
      </div>
    );
  }
}

export default App;
