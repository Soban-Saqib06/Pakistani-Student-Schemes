import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36 "
    ),
    "Accept-Language": "en-Us,en; q=0.9"
}

def fetch_page(url:str):
    """Safely downoads a web page with error handling"""
    