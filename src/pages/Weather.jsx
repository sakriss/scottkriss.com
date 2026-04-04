import { useState, useEffect, useCallback } from 'react'
import styles from '../styles/Weather.module.css'

const STATION_ID = 99507
const TOKEN = import.meta.env.VITE_TEMPEST_TOKEN

// Convert Celsius to Fahrenheit
function toF(c) {
  return (c * 9) / 5 + 32
}

// Wind direction degrees -> cardinal
function degreesToCardinal(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

// Simple heat index / feels like (Steadman formula approximation)
function feelsLike(tempF, humidity, windMph) {
  if (tempF >= 80) {
    const hi =
      -42.379 +
      2.04901523 * tempF +
      10.14333127 * humidity -
      0.22475541 * tempF * humidity -
      0.00683783 * tempF * tempF -
      0.05481717 * humidity * humidity +
      0.00122874 * tempF * tempF * humidity +
      0.00085282 * tempF * humidity * humidity -
      0.00000199 * tempF * tempF * humidity * humidity
    return hi
  }
  // Wind chill for cold temps
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

function mpsToMph(mps) {
  return mps * 2.237
}

function mbToInHg(mb) {
  return mb * 0.02953
}

function mmToIn(mm) {
  return mm * 0.03937
}

function formatTime(epoch) {
  if (!epoch) return '—'
  return new Date(epoch * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function uvLabel(uv) {
  if (uv === null || uv === undefined) return '—'
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}

function uvColor(uv) {
  if (!uv) return 'var(--text-muted)'
  if (uv < 3) return 'var(--success)'
  if (uv < 6) return 'var(--warning)'
  if (uv < 8) return '#e06c00'
  return 'var(--danger)'
}

function pressureTrendLabel(trend) {
  if (!trend) return ''
  const t = trend.toLowerCase()
  if (t.includes('falling')) return '↓ Falling'
  if (t.includes('rising')) return '↑ Rising'
  return '→ Steady'
}

export default function Weather() {
  const [data, setData] = useState(null)
  const [stationMeta, setStationMeta] = useState(null)
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

      const res = await fetch(
        `https://swd.weatherflow.com/swd/rest/observations/station/${STATION_ID}?token=${TOKEN}`
      )

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const json = await res.json()
      const obs = json.obs?.[0]
      const station = json.station_meta || json.station_name

      if (!obs) throw new Error('No observation data returned')

      setData(obs)
      setStationMeta({ name: json.public_name || `Station ${STATION_ID}`, meta: station })
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
            <button onClick={fetchData} className={styles.refreshBtn}>
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const tempF = toF(data.air_temperature)
  const windMph = mpsToMph(data.wind_avg ?? 0)
  const gustMph = mpsToMph(data.wind_gust ?? 0)
  const feelF = feelsLike(tempF, data.relative_humidity ?? 50, windMph)
  const pressureInHg = mbToInHg(data.sea_level_pressure ?? data.station_pressure ?? 0)
  const rainIn = mmToIn(data.precip_accum_local_day ?? 0)

  const cards = [
    {
      label: 'Temperature',
      value: `${tempF.toFixed(1)}°F`,
      sub: `Feels like ${feelF.toFixed(1)}°F`,
      icon: '🌡',
    },
    {
      label: 'Humidity',
      value: `${data.relative_humidity ?? '—'}%`,
      icon: '💧',
    },
    {
      label: 'Wind',
      value: `${windMph.toFixed(1)} mph`,
      sub: data.wind_direction != null
        ? `${degreesToCardinal(data.wind_direction)} (${data.wind_direction}°)`
        : undefined,
      icon: '💨',
    },
    {
      label: 'Wind Gust',
      value: `${gustMph.toFixed(1)} mph`,
      icon: '🌬',
    },
    {
      label: 'Pressure',
      value: `${pressureInHg.toFixed(2)} inHg`,
      sub: pressureTrendLabel(data.pressure_trend),
      icon: '🔵',
    },
    {
      label: 'UV Index',
      value: data.uv != null ? data.uv.toFixed(1) : '—',
      sub: uvLabel(data.uv),
      subColor: uvColor(data.uv),
      icon: '☀️',
    },
    {
      label: 'Solar Radiation',
      value: data.solar_radiation != null ? `${data.solar_radiation} W/m²` : '—',
      icon: '🌤',
    },
    {
      label: 'Rain Today',
      value: `${rainIn.toFixed(3)}"`,
      icon: '🌧',
    },
    {
      label: 'Lightning',
      value: data.lightning_strike_count != null ? `${data.lightning_strike_count} strikes` : '—',
      sub: data.lightning_strike_last_epoch
        ? `Last: ${formatTime(data.lightning_strike_last_epoch)}`
        : undefined,
      icon: '⚡',
    },
    {
      label: 'Brightness',
      value: data.brightness != null ? `${data.brightness.toLocaleString()} lux` : '—',
      icon: '💡',
    },
  ]

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Weather Station</h1>
            <p className={styles.subtitle}>
              {stationMeta?.name} &nbsp;·&nbsp; Bonney Lake, WA
            </p>
          </div>
          <div className={styles.headerRight}>
            {lastUpdated && (
              <p className={styles.updated}>
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            <button onClick={fetchData} className={styles.refreshBtn}>
              Refresh
            </button>
          </div>
        </div>

        {/* Observation time */}
        {data.timestamp && (
          <p className={styles.obsTime}>
            Observation time: {new Date(data.timestamp * 1000).toLocaleString()}
          </p>
        )}

        {/* Cards */}
        <div className={styles.grid}>
          {cards.map(({ label, value, sub, subColor, icon }) => (
            <div key={label} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{icon}</span>
                <span className={styles.cardLabel}>{label}</span>
              </div>
              <div className={styles.cardValue}>{value}</div>
              {sub && (
                <div
                  className={styles.cardSub}
                  style={subColor ? { color: subColor } : undefined}
                >
                  {sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Attribution */}
        <p className={styles.attribution}>
          Data from{' '}
          <a
            href={`https://tempestwx.com/station/${STATION_ID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tempest Weather System
          </a>{' '}
          via the WeatherFlow Tempest API.
        </p>
      </div>
    </div>
  )
}
