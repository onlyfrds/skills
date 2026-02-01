"""
Example usage of the Hong Kong Weather Skill
"""
from weather_hk import WeatherHKSkill


def example_usage():
    # Initialize the skill (without API key for basic functionality)
    weather_skill = WeatherHKSkill()
    
    print("=== Hong Kong Weather Information ===\n")
    
    # Get current weather
    print("Current Weather:")
    current_weather = weather_skill.get_current_weather()
    for key, value in current_weather.items():
        print(f"  {key}: {value}")
    print()
    
    # Get rain chance and humidity (the main focus of this skill)
    print("Rain Chance and Humidity Details:")
    rain_humidity_info = weather_skill.get_rain_chance_and_humidity()
    for key, value in rain_humidity_info.items():
        if isinstance(value, dict):
            print(f"  {key}:")
            for sub_key, sub_value in value.items():
                print(f"    {sub_key}: {sub_value}")
        else:
            print(f"  {key}: {value}")
    print()
    
    # Get forecast
    print("Next 24 Hours Forecast (3-hour intervals):")
    forecast = weather_skill.get_forecast()
    for i, period in enumerate(forecast):
        time_str = period['dt_txt']
        temp = period['main']['temp']
        humidity = period['main']['humidity']
        desc = period['weather'][0]['description']
        rain_volume = period.get('rain', {}).get('3h', 0)
        print(f"  {time_str}: {temp}°C, {humidity}% humidity, {desc}, rain: {rain_volume}mm")


if __name__ == "__main__":
    example_usage()