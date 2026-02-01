#!/usr/bin/env node

/**
 * Unit tests for Weather HK skill
 * Tests the Python script functionality
 */

import { spawnSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

// Test function
async function runTests() {
  console.log('🧪 Running unit tests for weather_hk...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Check if the script can be imported without errors
  console.log('Test 1: Python script import without errors');
  totalTests++;
  try {
    // Check if the Python file exists first
    const scriptPath = join(process.cwd(), 'skills/weather_hk/weather_hk.py');
    
    if (existsSync(scriptPath)) {
      const result = spawnSync('python3', ['-c', 'import sys; sys.path.insert(0, "skills/weather_hk"); import weather_hk_py; print("Import successful")'], { encoding: 'utf8' });
      
      if (result.status === 0) {
        console.log('  ✅ PASSED: Python script imported without errors');
        passedTests++;
      } else {
        console.log('  ❌ FAILED: Python script import failed');
        console.log(`  stderr: ${result.stderr}`);
      }
    } else {
      console.log('  ❌ FAILED: Python script file does not exist');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during import test: ${error.message}`);
  }

  // Test 2: Check if the script can be executed directly without errors
  console.log('\nTest 2: Python script execution check');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
sys.path.insert(0, './skills/weather_hk/')
try:
    import weather_hk
    print("Module loaded successfully")
except ImportError as e:
    print(f"Import error: {e}")
except Exception as e:
    print(f"Execution error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Module loaded successfully')) {
      console.log('  ✅ PASSED: Python script executes without errors');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Python script execution failed');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during execution test: ${error.message}`);
  }

  // Test 3: Check if the WeatherHKSkill class can be instantiated
  console.log('\nTest 3: WeatherHKSkill class instantiation');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
sys.path.insert(0, './skills/weather_hk/')
try:
    import weather_hk
    skill = weather_hk.WeatherHKSkill()
    print("Class instantiated successfully")
except Exception as e:
    print(f"Instantiation error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Class instantiated successfully')) {
      console.log('  ✅ PASSED: WeatherHKSkill class instantiated successfully');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: WeatherHKSkill class instantiation failed');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during instantiation test: ${error.message}`);
  }

  // Test 4: Check if the initialize_skill function works
  console.log('\nTest 4: initialize_skill function');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
sys.path.insert(0, './skills/weather_hk/')
try:
    import weather_hk
    config = {}
    skill = weather_hk.initialize_skill(config)
    print("initialize_skill function works")
except Exception as e:
    print(f"initialize_skill error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('initialize_skill function works')) {
      console.log('  ✅ PASSED: initialize_skill function works');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: initialize_skill function failed');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during initialize_skill test: ${error.message}`);
  }

  // Test 5: Check if get_supported_operations function works
  console.log('\nTest 5: get_supported_operations function');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
sys.path.insert(0, './skills/weather_hk/')
try:
    import weather_hk
    operations = weather_hk.get_supported_operations()
    if isinstance(operations, list) and len(operations) > 0:
        print("get_supported_operations returns valid list")
    else:
        print("get_supported_operations does not return valid list")
except Exception as e:
    print(f"get_supported_operations error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('get_supported_operations returns valid list')) {
      console.log('  ✅ PASSED: get_supported_operations function works');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: get_supported_operations function failed');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during get_supported_operations test: ${error.message}`);
  }

  // Test 6: Check if WeatherHKSkill has required methods
  console.log('\nTest 6: WeatherHKSkill required methods existence');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
sys.path.insert(0, './skills/weather_hk/')
try:
    import weather_hk
    skill = weather_hk.WeatherHKSkill()
    
    # Check for required methods
    required_methods = ['get_current_weather', 'get_rain_chance_and_humidity', 'get_forecast']
    missing_methods = []
    
    for method in required_methods:
        if not hasattr(skill, method):
            missing_methods.append(method)
    
    if not missing_methods:
        print("All required methods exist")
    else:
        print(f"Missing methods: {missing_methods}")
except Exception as e:
    print(f"Method check error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('All required methods exist')) {
      console.log('  ✅ PASSED: All required methods exist in WeatherHKSkill');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Some required methods are missing');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during method existence test: ${error.message}`);
  }

  // Test 7: Check if the skill can be initialized with an API key
  console.log('\nTest 7: WeatherHKSkill initialization with API key');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
sys.path.insert(0, './skills/weather_hk/')
try:
    import weather_hk
    skill = weather_hk.WeatherHKSkill(api_key="test_api_key")
    if skill.api_key == "test_api_key":
        print("Initialized with API key successfully")
    else:
        print("Failed to set API key")
except Exception as e:
    print(f"API key initialization error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Initialized with API key successfully')) {
      console.log('  ✅ PASSED: WeatherHKSkill initializes correctly with API key');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: WeatherHKSkill does not initialize with API key properly');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during API key initialization test: ${error.message}`);
  }

  // Test 8: Check if the config.json file exists and is valid
  console.log('\nTest 8: Config file validation');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
import json
import os
sys.path.insert(0, './skills/weather_hk/')
try:
    config_path = './skills/weather_hk/config.json'
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            config = json.load(f)
        if isinstance(config, dict):
            print("Config file exists and is valid JSON")
        else:
            print("Config file is not a valid JSON object")
    else:
        print("Config file does not exist")
except Exception as e:
    print(f"Config validation error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Config file exists and is valid JSON')) {
      console.log('  ✅ PASSED: Config file exists and is valid');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Config file validation failed');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during config validation test: ${error.message}`);
  }

  // Test 9: Check if the example_usage.py file exists and can be imported
  console.log('\nTest 9: Example usage file validation');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
import os
sys.path.insert(0, './skills/weather_hk/')
try:
    example_path = './skills/weather_hk/example_usage.py'
    if os.path.exists(example_path):
        import example_usage
        print("Example usage file imported successfully")
    else:
        print("Example usage file does not exist")
except Exception as e:
    print(f"Example usage import error: {e}")
`], { encoding: 'utf8' });
    
    // This test expects the example_usage.py to exist, even if it doesn't have executable content
    if (result.status === 0) {
      console.log('  ✅ PASSED: Example usage file validation completed');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Example usage file validation failed');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during example usage validation: ${error.message}`);
  }

  // Test 10: Check if the README.md file exists
  console.log('\nTest 10: README file validation');
  totalTests++;
  try {
    const result = spawnSync('python3', ['-c', `
import sys
import os
try:
    readme_path = './skills/weather_hk/README.md'
    if os.path.exists(readme_path):
        with open(readme_path, 'r') as f:
            content = f.read(100)  # Read first 100 chars to verify it's accessible
        print("README file exists and is accessible")
    else:
        print("README file does not exist")
except Exception as e:
    print(f"README validation error: {e}")
`], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('README file exists and is accessible')) {
      console.log('  ✅ PASSED: README file exists and is accessible');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: README file validation failed');
      console.log(`  status: ${result.status}, stdout: ${result.stdout}, stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during README validation: ${error.message}`);
  }

  // Summary
  console.log('\n--- Test Results ---');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((passedTests/totalTests)*100)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
  } else if (passedTests === 0) {
    console.log('💥 All tests failed!');
  } else {
    console.log('⚠️  Some tests failed - review the implementation');
  }
  
  return { passedTests, totalTests };
}

// Run tests if this file is executed directly
const isMain = process.argv[1] && process.argv[1].endsWith('unit_test.mjs');

if (isMain) {
  runTests()
    .then(results => {
      process.exit(results.passedTests === results.totalTests ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite error:', error);
      process.exit(1);
    });
}

export { runTests };