from pydantic_settings import BaseSettings

class ServiceSettings(BaseSettings):
    # Baidu OCR (请替换为实际 Key)
    BAIDU_API_KEY: str = "ZPA1nlXx9BmrOgTWxo70NjPW"
    BAIDU_SECRET_KEY: str = "0CVc5WM9QT4z7kVGg5plrCrvVFVVbKGv"
    
    # DeepSeek
    DEEPSEEK_API_KEY: str = "sk-e42acdb8f235474ba583c116faf8de4e"
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"

    class Config:
        env_file = ".env"

service_settings = ServiceSettings()
