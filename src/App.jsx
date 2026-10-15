import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_KEY

  const capital = country.capital ? country.capital[0] : ''

  useEffect(() => {
    if (!capital || !api_key) return

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

    axios
      .get(weatherUrl)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Virhe säätietojen haussa:', error)
      })
  }, [capital, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
      />

      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>temperature {weather.main.temp} Celsius</p>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt="Weather icon" 
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const countryToShow = selectedCountry || (filteredCountries.length === 1 ? filteredCountries[0] : null)

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      {countryToShow ? (
        <CountryDetails country={countryToShow} />
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      ) : (
        search && <p>No matches found</p>
      )}
    </div>
  )
}

export default App