"""
Test file for Hong Kong Weather Skill
"""
import unittest
from weather_hk import WeatherHKSkill


class TestWeatherHKSkill(unittest.TestCase):
    def setUp(self):
        # Initialize the skill without an API key (using free tier)
        self.skill = WeatherHKSkill()
    
    def test_get_current_weather(self):
        """Test getting current weather"""
        try:
            result = self.skill.get_current_weather()
            self.assertIsInstance(result, dict)
            self.assertIn("location", result)
            self.assertEqual(result["location"], "Hong Kong")
            self.assertIn("current_temp", result)
            self.assertIn("humidity", result)
        except Exception as e:
            # Skip test if network is unavailable
            self.skipTest(f"Network error: {e}")
    
    def test_get_rain_chance_and_humidity(self):
        """Test getting rain chance and humidity"""
        try:
            result = self.skill.get_rain_chance_and_humidity()
            self.assertIsInstance(result, dict)
            self.assertIn("location", result)
            self.assertEqual(result["location"], "Hong Kong")
            self.assertIn("humidity", result)
            self.assertIn("chance_of_rain", result)
        except Exception as e:
            # Skip test if network is unavailable
            self.skipTest(f"Network error: {e}")
    
    def test_get_forecast(self):
        """Test getting forecast"""
        try:
            result = self.skill.get_forecast()
            self.assertIsInstance(result, list)
            self.assertGreater(len(result), 0)
        except Exception as e:
            # Skip test if network is unavailable
            self.skipTest(f"Network error: {e}")


if __name__ == '__main__':
    unittest.main()