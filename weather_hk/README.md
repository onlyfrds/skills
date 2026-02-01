# Hong Kong Weather Skill

An enhanced weather skill specifically designed to check for chance of rain and humidity in Hong Kong.

## Features

- Get current weather conditions in Hong Kong
- Check chance of rain for the next 24 hours
- Detailed humidity information (current and average)
- Rainfall data for Hong Kong
- UV index information
- 24-hour weather forecast with 3-hour intervals

## Installation

1. Place the `weather_hk` folder in your OpenClaw skills directory
2. Install dependencies: `pip install requests`
3. Optionally configure with an OpenWeatherMap API key for higher rate limits

## Configuration

The skill can be configured with the following options:

- `api_key`: (Optional) OpenWeatherMap API key for better rate limits and additional features

## Usage Examples

- "What's the chance of rain in Hong Kong?"
- "Check humidity levels in Hong Kong"
- "Will it rain in Hong Kong today?"
- "Get Hong Kong weather forecast"

## API Sources

- Primary: OpenWeatherMap API (free tier supported)
- Secondary: Hong Kong Observatory data (for Hong Kong-specific information)

## Supported Operations

- `get_current_weather`: Get current weather conditions
- `get_rain_chance_and_humidity`: Get detailed rain chance and humidity info
- `get_forecast`: Get 24-hour weather forecast

## Data Provided

The skill provides comprehensive rain and humidity data including:
- Current humidity percentage
- Average humidity for next 24 hours
- Chance of rain in next 24 hours
- Today's rainfall amount
- Current temperature and feels-like temperature
- UV index information