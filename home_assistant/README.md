# Home Assistant Skill

This skill allows control of Home Assistant devices including lights, switches, climate devices, covers, and fans.

## Configuration

The skill requires a Home Assistant URL and a long-lived access token. These are stored in:

- `/home/neo/.openclaw/config/home_assistant_config.json` - Contains the HA URL
- `/home/neo/.openclaw/secrets/home_assistant_token.txt` - Contains the access token

## Usage

After configuration, you can use commands like:
- "Turn on the light"
- "Turn off the Papa light" 
- "Set brightness to 50%"
- "Set color to red"
- "Toggle the light"

## Supported Devices

- Lights (on/off/brightness/color/temperature)
- Switches (on/off/toggle)
- Climate devices (temperature/modes/fans)
- Covers (open/close/position)
- Fans (speed/direction/oscillation)