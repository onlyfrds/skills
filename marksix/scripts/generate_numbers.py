#!/usr/bin/env python3
"""
MarkSix Number Generator
Generates 6 unique random numbers from 1 to 49 inclusive
"""

import random

def generate_marksix_numbers():
    """Generate 6 unique random numbers from 1 to 49 inclusive."""
    numbers = random.sample(range(1, 50), 6)
    return sorted(numbers)

if __name__ == "__main__":
    numbers = generate_marksix_numbers()
    print("Your Mark Six numbers are:", ", ".join(map(str, numbers)))