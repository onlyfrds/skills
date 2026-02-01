#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import turn_on_light, turn_off_light, toggle_light, get_light_state, set_brightness, set_color_temperature, set_rgb_color

def main():
    if len(sys.argv) < 2:
        print("Usage: home_assistant_skill.py <action> [args]")
        sys.exit(1)
    
    action = sys.argv[1]
    
    try:
        if action == "turn_on":
            brightness = int(sys.argv[2]) if len(sys.argv) > 2 else None
            result = turn_on_light(brightness_pct=brightness)
            print(f"Turned on light: {result}")
        elif action == "turn_off":
            result = turn_off_light()
            print(f"Turned off light: {result}")
        elif action == "toggle":
            result = toggle_light()
            print(f"Toggled light: {result}")
        elif action == "status":
            state = get_light_state()
            print(f"Light state: {state}")
        elif action == "set_brightness":
            if len(sys.argv) < 3:
                print("Usage: home_assistant_skill.py set_brightness <value>")
                sys.exit(1)
            brightness = int(sys.argv[2])
            result = set_brightness(brightness)
            print(f"Set brightness to {brightness}%: {result}")
        else:
            print(f"Unknown action: {action}")
            sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()