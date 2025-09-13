#!/usr/bin/env python3
"""
Setup script for Your E2B Clone SDK - Python
"""

from setuptools import setup, find_packages
import os

# Read the README file
def read_readme():
    readme_path = os.path.join(os.path.dirname(__file__), '..', 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path, 'r', encoding='utf-8') as f:
            return f.read()
    return "Your E2B Clone SDK - Python"

# Read version from __init__.py
def get_version():
    init_path = os.path.join(os.path.dirname(__file__), 'your_e2b_clone.py')
    with open(init_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('__version__'):
                return line.split('=')[1].strip().strip('"\'')
    return '1.0.0'

setup(
    name='bettere2b',
    version=get_version(),
    author='Your Name',
    author_email='your.email@example.com',
    description='BetterE2B - Drop-in replacement for e2b-code-interpreter with dynamic subdomain support',
    long_description=read_readme(),
    long_description_content_type='text/markdown',
    url='https://github.com/yourusername/bettere2b',
    project_urls={
        'Bug Reports': 'https://github.com/yourusername/bettere2b/issues',
        'Source': 'https://github.com/yourusername/bettere2b',
        'Documentation': 'https://github.com/yourusername/bettere2b#readme',
    },
    py_modules=['your_e2b_clone'],
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Programming Language :: Python :: 3.12',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Software Development :: Testing',
        'Topic :: System :: Distributed Computing',
    ],
    python_requires='>=3.8',
    install_requires=[
        'requests>=2.25.0',
    ],
    extras_require={
        'dev': [
            'pytest>=6.0',
            'pytest-asyncio>=0.18.0',
            'black>=21.0',
            'flake8>=3.9',
            'mypy>=0.910',
        ],
        'test': [
            'pytest>=6.0',
            'pytest-asyncio>=0.18.0',
        ],
    },
    keywords=[
        'e2b',
        'sandbox',
        'code-execution',
        'docker',
        'subdomain',
        'dynamic',
        'sdk',
        'api',
        'python',
    ],
    entry_points={
        'console_scripts': [
            'bettere2b=your_e2b_clone:main',
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
