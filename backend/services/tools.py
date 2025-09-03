import requests

def get_weather(city: str):
    # Clean up city name input from LLM
    city = city.strip().strip("'\"")
    
    # 这里只做一个简单映射，真实项目可以用地理编码 API 获取经纬度
    city_map = {
        "北京": (39.9, 116.4),
        "上海": (31.2, 121.5),
        "广州": (23.1, 113.3),
    }

    if city not in city_map:
        return f"暂时不支持查询 {city} 的天气"

    lat, lon = city_map[city]
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    resp = requests.get(url)
    data = resp.json()

    weather = data["current_weather"]
    return f"{city}当前气温 {weather['temperature']}℃，风速 {weather['windspeed']} km/h。"