"""
Enhanced Weather Skill for Hong Kong
Specifically checks for chance of rain and humidity in Hong Kong
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Optional, Union


class WeatherHKSkill:
    """
    A skill to get enhanced weather information for Hong Kong,
    focusing on chance of rain and humidity.
    Uses the OpenWeatherMap API and Hong Kong Observatory data.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize the Hong Kong Weather skill
        
        Args:
            api_key: OpenWeatherMap API key (optional, will use free tier without key)
        """
        self.api_key = api_key
        self.base_url = "http://api.openweathermap.org/data/2.5"
        self.hko_base_url = "https://data.weather.gov.hk/weatherAPI/opendata/"
        
        # Hong Kong coordinates
        self.hk_lat = 22.3964
        self.hk_lon = 114.1095
        
    def _make_request(self, url: str, params: dict = None) -> dict:
        """
        Make a request to the weather API
        
        Args:
            url: API endpoint URL
            params: Query parameters
            
        Returns:
            Response JSON data
        """
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error making request to weather API: {str(e)}")
    
    def get_current_weather(self) -> dict:
        """
        Get current weather in Hong Kong
        
        Returns:
            Dictionary with current weather information
        """
        endpoint = f"{self.base_url}/weather"
        params = {
            "lat": self.hk_lat,
            "lon": self.hk_lon,
            "appid": self.api_key if self.api_key else "",
            "units": "metric"
        }
        
        data = self._make_request(endpoint, params)
        
        # Extract relevant information
        result = {
            "location": "Hong Kong",
            "current_temp": round(data["main"]["temp"], 1),
            "feels_like": round(data["main"]["feels_like"], 1),
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "description": data["weather"][0]["description"],
            "wind_speed": data["wind"]["speed"],
            "cloudiness": data["clouds"]["all"],
            "timestamp": datetime.fromtimestamp(data["dt"]).strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return result
    
    def get_rain_chance_and_humidity(self) -> dict:
        """
        Get chance of rain and humidity for Hong Kong
        
        Returns:
            Dictionary with rain chance and humidity information
        """
        # Get current weather
        current_weather = self.get_current_weather()
        
        # Get forecast for next 5 days to calculate rain chance
        forecast = self.get_forecast()
        
        # Calculate chance of rain from forecast
        rain_periods = 0
        total_periods = len(forecast)
        
        for period in forecast:
            if "rain" in period and period["rain"].get("3h", 0) > 0:
                rain_periods += 1
        
        rain_chance_percent = (rain_periods / total_periods) * 100 if total_periods > 0 else 0
        
        # Extract detailed humidity info
        avg_humidity = sum([period["main"]["humidity"] for period in forecast]) / len(forecast) if forecast else current_weather["humidity"]
        
        # Try to get more accurate Hong Kong-specific data from HKO
        hko_data = self._get_hko_weather_data()
        
        result = {
            "location": "Hong Kong",
            "current_temp": current_weather["current_temp"],
            "humidity": {
                "current": current_weather["humidity"],
                "average_next_24h": round(avg_humidity, 1),
                "unit": "%"
            },
            "chance_of_rain": {
                "next_hour": hko_data.get("chance_of_rain_1hr", "N/A"),
                "next_24_hours": round(rain_chance_percent, 1),
                "unit": "%"
            },
            "rainfall": {
                "today": hko_data.get("today_rainfall", "N/A"),
                "unit": "mm"
            },
            "uv_index": hko_data.get("uv_index", "N/A"),
            "update_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return result
    
    def get_forecast(self) -> List[dict]:
        """
        Get weather forecast for Hong Kong
        
        Returns:
            List of forecast periods
        """
        endpoint = f"{self.base_url}/forecast"
        params = {
            "lat": self.hk_lat,
            "lon": self.hk_lon,
            "appid": self.api_key if self.api_key else "",
            "units": "metric"
        }
        
        data = self._make_request(endpoint, params)
        return data["list"][:8]  # Next 8 periods (approx 24 hours)
    
    def _get_hko_weather_data(self) -> dict:
        """
        Get Hong Kong specific weather data from Hong Kong Observatory
        
        Returns:
            Dictionary with HKO weather information
        """
        try:
            # Get current weather report
            weather_url = f"{self.hko_base_url}weather.php?dataType=rhb&lang=en"
            weather_data = self._make_request(weather_url)
            
            # Get rainfall data
            rainfall_url = f"{self.hko_base_url}weather.php?dataType=hrf&lang=en"
            rainfall_data = self._make_request(rainfall_url)
            
            result = {
                "chance_of_rain_1hr": "N/A",  # Would need specific API for this
                "today_rainfall": self._parse_today_rainfall(rainfall_data),
                "uv_index": weather_data.get("uvindex", [{}])[0].get("value") if weather_data.get("uvindex") else "N/A"
            }
            
            return result
        except Exception as e:
            print(f"Could not fetch HKO data: {e}")
            return {
                "chance_of_rain_1hr": "N/A",
                "today_rainfall": "N/A",
                "uv_index": "N/A"
            }
    
    def _parse_today_rainfall(self, rainfall_data) -> Union[float, str]:
        """
        Parse today's rainfall from HKO data
        
        Args:
            rainfall_data: Raw rainfall data from HKO API
            
        Returns:
            Today's rainfall in mm or 'N/A' if unavailable
        """
        try:
            # Look for today's rainfall summary
            if isinstance(rainfall_data, dict) and "rainfallLast60Minutes" in rainfall_data:
                # Calculate total rainfall for today
                hourly_rain = rainfall_data["rainfallLast60Minutes"]
                return sum(float(obs.get("amount", 0)) for obs in hourly_rain if obs.get("amount"))
            return "N/A"
        except:
            return "N/A"


# Example usage and helper functions for OpenClaw
def initialize_skill(config: dict) -> WeatherHKSkill:
    """
    Initialize the Hong Kong Weather skill with configuration
    
    Args:
        config: Configuration dictionary containing 'api_key' (optional)
        
    Returns:
        Initialized WeatherHKSkill instance
    """
    api_key = config.get('api_key')  # Optional OpenWeatherMap API key
    
    return WeatherHKSkill(api_key=api_key)


def get_supported_operations():
    """
    Return a list of supported operations for this skill
    """
    return [
        "get_current_weather",
        "get_rain_chance_and_humidity", 
        "get_forecast"
    ]


# Example commands that could be used in OpenClaw
EXAMPLE_COMMANDS = {
    "weather": [
        "What's the chance of rain in Hong Kong?",
        "Check humidity levels in Hong Kong",
        "Get Hong Kong weather forecast",
        "Will it rain in Hong Kong today?",
        "What's the humidity like in Hong Kong right now?"
    ]
}