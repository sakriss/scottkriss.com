import { useState, useEffect, useCallback } from 'react'
import styles from '../styles/Weather.module.css'

const STATION_ID = 99507
const TOKEN = import.meta.env.VITE_TEMPEST_TOKEN

function toF(c) {
  return (c * 9) / 5 + 32
}

function mpsToMph(mps) {
  return mps * 2.237
}

function mbToInHg(mb) {
  return mb * 0.02953
}

function mmToIn(mm) {
  return mm * 0.03937
}

function degreesToCardinal(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

function feelsLike(tempF, humidity, windMph) {
  if (tempF >= 80) {
    return (
      -42.379 +
      2.04901523 * tempF +
      10.14333127 * humidity -
      0.22475541 * tempF * humidity -
      0.00683783 * tempF * tempF -
      0.05481717 * humidity * humidity +
      0.00122874 * tempF * tempF * humidity +
      0.00085282 * tempF * humidity * humidity -
      0.00000199 * tempF * tempF * humidity * humidity
    )
  }
  if (tempF <= 50 && windMph > 3) {
    return (
      35.74 +
      0.6215 * tempF -
      35.75 * Math.pow(windMph, 0.16) +
      0.4275 * tempF * Math.pow(windMph, 0.16)
    )
  }
  return tempF
}

function formatHour(epoch) {
  const h = new Date(epoch * 1000).getHours()
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

function formatDay(epoch) {
  return new Date(epoch * 1000).toLocaleDateString([], { weekday: 'short' })
}

function weatherIcon(icon) {
  const map = {
    'clear-day': '☀️',
    'clear-night': '🌙',
    'cloudy': '☁️',
    'partly-cloudy-day': '⛅',
    'partly-cloudy-night': '🌥',
    'possibly-rainy-day': '🌦',
    'possibly-rainy-night': '🌦',
    'rainy': '🌧',
    'rain': '🌧',
    'possibly-snow-day': '🌨',
    'possibly-snow-night': '🌨',
    'snow': '❄️',
    'snowy': '❄️',
    'sleet': '🌨',
    'thunderstorm': '⛈',
    'possibly-thunderstorm-day': '⛈',
    'possibly-thunderstorm-night': '⛈',
    'fog': '🌫',
    'windy': '💨',
    'tornado': '🌪',
  }
  return map[icon] || '🌡'
}

function uvLabel(uv) {
  if (uv == null) return '—'
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}

function pressureTrend(trend) {
  if (!trend) return ''
  const t = trend.toLowerCase()
  if (t.includes('falling')) return '↓ Falling'
  if (t.includes('rising')) return '↑ Rising'
  return '→ Steady'
}

export default function Weather() {
  const [obs, setObs] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [stationName, setStationName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async () => {
    if (!TOKEN) {
      setError('No Tempest API token configured. Add VITE_TEMPEST_TOKEN to .env.local.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [obsRes, fcRes] = await Promise.all([
        fetch(`https://swd.weatherflow.com/swd/rest/observations/station/${STATION_ID}?token=${TOKEN}`),
        fetch(`https://swd.weatherflow.com/swd/rest/better_forecast?station_id=${STATION_ID}&token=${TOKEN}&units_temp=f&units_wind=mph&units_precip=in&units_pressure=inhg`),
      ])

      if (!obsRes.ok) throw new Error(`Observations API error: ${obsRes.status}`)

      const obsJson = await obsRes.json()
      const obsData = obsJson.obs?.[0]
      if (!obsData) throw new Error('No observation data returned')

      setObs(obsData)
      setStationName(obsJson.public_name || `Station ${STATION_ID}`)

      if (fcRes.ok) {
        const fcJson = await fcRes.json()
        setForecast(fcJson.forecast)
      }

      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Fetching weather data…</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.errorBox}>
            <h2>Could not load weather data</h2>
            <p>{error}</p>
            <button onClick={fetchData} className={styles.refreshBtn}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const tempF = toF(obs.air_temperature)
  const windMph = mpsToMph(obs.wind_avg ?? 0)
  const gustMph = mpsToMph(obs.wind_gust ?? 0)
  const feelF = feelsLike(tempF, obs.relative_humidity ?? 50, windMph)
  const pressureInHg = mbToInHg(obs.sea_level_pressure ?? obs.station_pressure ?? 0)
  const rainIn = mmToIn(obs.precip_accum_local_day ?? 0)

  const today = forecast?.daily?.[0]
  const currentConditions = forecast?.hourly?.[0]?.conditions || ''
  const currentIcon = forecast?.hourly?.[0]?.icon || 'clear-day'
  const hourly = forecast?.hourly?.slice(0, 24) || []
  const daily = forecast?.daily?.slice(0, 7) || []

  const allLows = daily.map(d => d.air_temp_low).filter(v => v != null)
  const allHighs = daily.map(d => d.air_temp_high).filter(v => v != null)
  const minTemp = allLows.length ? Math.min(...allLows) : 0
  const maxTemp = allHighs.length ? Math.max(...allHighs) : 100
  const tempRange = maxTemp - minTemp || 1

  return (
    <div className="page">
      <div className="container">

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroLocation}>
            {stationName} &nbsp;·&nbsp; Bonney Lake, WA
          </div>
          <div className={styles.heroTemp}>{Math.round(tempF)}°</div>
          <div className={styles.heroConditions}>
            <span>{weatherIcon(currentIcon)}</span>
            <span>{currentConditions || 'Current Conditions'}</span>
          </div>
          <div className={styles.heroMeta}>
            Feels like {Math.round(feelF)}°
            {today?.air_temp_high != null && today?.air_temp_low != null && (
              <>&nbsp;·&nbsp; H:{Math.round(today.air_temp_high)}° &nbsp;L:{Math.round(today.air_temp_low)}°</>
            )}
          </div>
          <div className={styles.heroFooter}>
            {lastUpdated && (
              <span className={styles.updated}>
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button onClick={fetchData} className={styles.refreshBtn}>↻ Refresh</button>
          </div>
        </div>

        {/* Hourly Forecast */}
        {hourly.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Hourly Forecast</div>
            <div className={styles.hourlyScroll}>
              {hourly.map((h, i) => (
                <div key={h.time} className={styles.hourlyItem}>
                  <div className={styles.hourlyTime}>{i === 0 ? 'Now' : formatHour(h.time)}</div>
                  <div className={styles.hourlyIcon}>{weatherIcon(h.icon)}</div>
                  {h.precip_probability > 10 && (
                    <div className={styles.hourlyPrecip}>{h.precip_probability}%</div>
                  )}
                  <div className={styles.hourlyTemp}>{Math.round(h.air_temperature)}°</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {daily.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>7-Day Forecast</div>
            <div className={styles.dailyList}>
              {daily.map((d, i) => {
                const lowPct = ((d.air_temp_low - minTemp) / tempRange) * 100
                const highPct = ((d.air_temp_high - minTemp) / tempRange) * 100
                return (
                  <div key={d.day_start_local} className={styles.dailyRow}>
                    <div className={styles.dailyDay}>{i === 0 ? 'Today' : formatDay(d.day_start_local)}</div>
                    <div className={styles.dailyIcon}>{weatherIcon(d.icon)}</div>
                    <div className={styles.dailyPrecip}>
                      {d.precip_probability > 0 ? `${d.precip_probability}%` : ''}
                    </div>
                    <div className={styles.dailyRange}>
                      <span className={styles.dailyLow}>{Math.round(d.air_temp_low)}°</span>
                      <div className={styles.dailyBar}>
                        <div
                          className={styles.dailyBarFill}
                          style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
                        />
                      </div>
                      <span className={styles.dailyHigh}>{Math.round(d.air_temp_high)}°</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Conditions Detail */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Conditions</div>
          <div className={styles.detailGrid}>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>💧 Humidity</div>
              <div className={styles.detailValue}>{obs.relative_humidity ?? '—'}%</div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>💨 Wind</div>
              <div className={styles.detailValue}>{windMph.toFixed(1)} mph</div>
              <div className={styles.detailSub}>
                {obs.wind_direction != null ? `${degreesToCardinal(obs.wind_direction)} · ` : ''}
                Gusts {gustMph.toFixed(1)} mph
              </div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>🔵 Pressure</div>
              <div className={styles.detailValue}>{pressureInHg.toFixed(2)} inHg</div>
              <div className={styles.detailSub}>{pressureTrend(obs.pressure_trend)}</div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>☀️ UV Index</div>
              <div className={styles.detailValue}>{obs.uv != null ? obs.uv.toFixed(1) : '—'}</div>
              <div className={styles.detailSub}>{uvLabel(obs.uv)}</div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>🌧 Rain Today</div>
              <div className={styles.detailValue}>{rainIn.toFixed(3)}"</div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>🌤 Solar Radiation</div>
              <div className={styles.detailValue}>
                {obs.solar_radiation != null ? `${obs.solar_radiation} W/m²` : '—'}
              </div>
            </div>
            {obs.lightning_strike_count != null && (
              <div className={styles.detailCard}>
                <div className={styles.detailLabel}>⚡ Lightning</div>
                <div className={styles.detailValue}>{obs.lightning_strike_count} strikes</div>
              </div>
            )}
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>💡 Brightness</div>
              <div className={styles.detailValue}>
                {obs.brightness != null ? `${obs.brightness.toLocaleString()} lux` : '—'}
              </div>
            </div>
          </div>
        </div>

        <p className={styles.attribution}>
          Data from{' '}
          <a href={`https://tempestwx.com/station/${STATION_ID}`} target="_blank" rel="noopener noreferrer">
            Tempest Weather System
          </a>{' '}
          via WeatherFlow Tempest API
        </p>
      </div>
    </div>
  )
}
