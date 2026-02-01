import json
import requests
from pathlib import Path

def load_config():
    config_path = Path('/home/neo/.openclaw/config/home_assistant_config.json')
    if config_path.exists():
        return json.loads(config_path.read_text())
    else:
        raise FileNotFoundError('Home Assistant config not found')

def get_token():
    config = load_config()
    token_path = Path(config['token_file_path'])
    if token_path.exists():
        return token_path.read_text().strip()
    else:
        raise FileNotFoundError('Home Assistant token not found')

def call_home_assistant(service_domain, service, entity_id=None, data=None):
    config = load_config()
    url = f"{config['home_assistant_url']}/api/services/{service_domain}/{service}"
    
    headers = {
        'Authorization': f'Bearer {get_token()}',
        'Content-Type': 'application/json'
    }
    
    payload = {}
    if entity_id:
        payload['entity_id'] = entity_id
    if data:
        payload.update(data)
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

def get_states():
    config = load_config()
    url = f"{config['home_assistant_url']}/api/states"
    
    headers = {
        'Authorization': f'Bearer {get_token()}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def get_papa_light_entity_id():
    states = get_states()
    for entity in states:
        if 'papa_light' in entity['entity_id']:
            return entity['entity_id']
    return None

def turn_on_light(brightness_pct=None, rgb_color=None, color_temp=None):
    entity_id = get_papa_light_entity_id()
    if not entity_id:
        return {'error': 'Papa light entity not found'}
    
    data = {}
    if brightness_pct:
        data['brightness_pct'] = brightness_pct
    if rgb_color:
        data['rgb_color'] = rgb_color
    if color_temp:
        data['color_temp'] = color_temp
        
    return call_home_assistant('light', 'turn_on', entity_id, data)

def turn_off_light():
    entity_id = get_papa_light_entity_id()
    if not entity_id:
        return {'error': 'Papa light entity not found'}
    
    return call_home_assistant('light', 'turn_off', entity_id)

def toggle_light():
    entity_id = get_papa_light_entity_id()
    if not entity_id:
        return {'error': 'Papa light entity not found'}
    
    return call_home_assistant('light', 'toggle', entity_id)

def get_light_state():
    entity_id = get_papa_light_entity_id()
    if not entity_id:
        return {'error': 'Papa light entity not found'}
    
    states = get_states()
    for entity in states:
        if entity['entity_id'] == entity_id:
            return entity
    return None

def set_brightness(brightness_pct):
    entity_id = get_papa_light_entity_id()
    if not entity_id:
        return {'error': 'Papa light entity not found'}
    
    data = {'brightness_pct': brightness_pct}
    return call_home_assistant('light', 'turn_on', entity_id, data)

def set_color_temperature(color_temp):
    entity_id = get_papa_light_entity_id()
    if not entity_id:
        return {'error': 'Papa light entity not found'}
    
    data = {'color_temp': color_temp}
    return call_home_assistant('light', 'turn_on', entity_id, data)

def set_rgb_color(rgb_color):
    entity_id = get_papa_light_entity_id()
    if not entity_id:
        return {'error': 'Papa light entity not found'}
    
    data = {'rgb_color': rgb_color}
    return call_home_assistant('light', 'turn_on', entity_id, data)