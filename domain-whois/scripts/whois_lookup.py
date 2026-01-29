#!/usr/bin/env python3
"""
Secure whois lookup script
Validates input and executes whois command safely, with fallback to python-whois library
"""

import sys
import subprocess
import re
import shlex

def validate_domain(domain):
    """
    Validates that the domain looks like a proper domain name
    Allows standard domain characters: letters, numbers, hyphens, dots
    """
    # Basic domain regex pattern
    pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$'
    return bool(re.match(pattern, domain))

def run_whois(domain):
    """Execute whois command safely after validating the domain."""
    if not validate_domain(domain):
        raise ValueError(f"Invalid domain format: {domain}")
    
    # Additional safety check - ensure the domain doesn't contain shell metacharacters
    if any(char in domain for char in [';', '&', '|', '`', '$', '(', ')', '<', '>', '*']):
        raise ValueError(f"Domain contains invalid characters: {domain}")
    
    # First, try the system whois command
    try:
        result = subprocess.run(['whois', domain], 
                              capture_output=True, 
                              text=True, 
                              timeout=30)  # 30-second timeout
        
        if result.returncode == 0:
            return result.stdout
        else:
            return f"Error executing whois: {result.stderr}"
    except subprocess.TimeoutExpired:
        return "Error: Whois command timed out after 30 seconds"
    except FileNotFoundError:
        # If system whois is not available, try python-whois library
        try:
            import whois
            
            w = whois.whois(domain)
            
            # Format the output similar to whois command
            output = f"Domain: {domain}\n"
            output += "="*50 + "\n"
            
            for key, value in w.items():
                if value is not None:
                    if isinstance(value, list):
                        output += f"{key.title()}: {', '.join(str(v) for v in value)}\n"
                    else:
                        output += f"{key.title()}: {value}\n"
            
            return output
        except ImportError:
            # Fallback message when both system whois and python-whois are not available
            return f"""Whois command not found on this system and python-whois library not available. To use this functionality:

1. Install whois on your system:
   - On Ubuntu/Debian: sudo apt-get install whois
   - On CentOS/RHEL: sudo yum install whois or sudo dnf install whois
   - On macOS: brew install whois

2. Or install python-whois: pip3 install python-whois

3. Once installed, you can run: whois {domain}

The domain '{domain}' appears to be valid based on format validation."""
        except Exception as e:
            return f"Error with python-whois library: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 whois_lookup.py <domain>")
        sys.exit(1)
    
    domain = sys.argv[1]
    result = run_whois(domain)
    print(result)