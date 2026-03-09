import base64
import json
import httpx
import fitz  # PyMuPDF
from app.core.config.services import service_settings

class ResumeService:
    def __init__(self):
        self.baidu_api_key = service_settings.BAIDU_API_KEY
        self.baidu_secret_key = service_settings.BAIDU_SECRET_KEY
        self.deepseek_api_key = service_settings.DEEPSEEK_API_KEY
        self.deepseek_base_url = service_settings.DEEPSEEK_BASE_URL
        self.baidu_token = None

    async def get_baidu_access_token(self):
        """获取百度Access Token"""
        url = "https://aip.baidubce.com/oauth/2.0/token"
        params = {
            "grant_type": "client_credentials",
            "client_id": self.baidu_api_key,
            "client_secret": self.baidu_secret_key
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, params=params)
            data = response.json()
            return data.get("access_token")

    async def extract_text_from_image(self, image_content):
        """调用百度通用文字识别接口"""
        if not self.baidu_token:
            self.baidu_token = await self.get_baidu_access_token()
        
        url = f"https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token={self.baidu_token}"
        
        # 百度OCR要求image参数为base64编码
        img_base64 = base64.b64encode(image_content).decode('utf-8')
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {"image": img_base64}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, data=data)
            result = response.json()
            
            if "words_result" in result:
                text_lines = [item["words"] for item in result["words_result"]]
                return "\n".join(text_lines)
            return ""

    async def extract_text_from_pdf(self, pdf_content):
        """将PDF转为图片并提取文字"""
        text_content = []
        
        # 使用PyMuPDF打开PDF
        doc = fitz.open(stream=pdf_content, filetype="pdf")
        
        # 限制只处理前3页
        num_pages = min(len(doc), 3)
        
        for i in range(num_pages):
            page = doc.load_page(i)
            pix = page.get_pixmap()
            img_bytes = pix.tobytes("png")
            
            page_text = await self.extract_text_from_image(img_bytes)
            text_content.append(page_text)
            
        return "\n".join(text_content)

    async def analyze_resume_text(self, text):
        """调用DeepSeek API分析简历内容"""
        headers = {
            "Authorization": f"Bearer {self.deepseek_api_key}",
            "Content-Type": "application/json"
        }
        
        prompt = """
你是一个专业的学术简历分析助手。请分析以下简历内容，提取出用户的“研究方向”和“学术背景”。
请严格按照以下 JSON 格式输出，不要包含 Markdown 格式标记（如 ```json ... ```）：
{
    "research": ["方向1", "方向2", ...],
    "background": ["学历信息", "学校名称", ...]
}
简历内容如下：
"""
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"{prompt}\n{text}"}
            ],
            "stream": False
        }
        
        async with httpx.AsyncClient() as client:
            # Note: DeepSeek API endpoints might vary, using typical chat completion endpoint
            response = await client.post(f"{self.deepseek_base_url}/chat/completions", headers=headers, json=payload, timeout=60.0)
            result = response.json()
            
            try:
                content = result["choices"][0]["message"]["content"]
                # Clean up potential markdown code blocks if the model ignores instruction
                content = content.replace("```json", "").replace("```", "").strip()
                return json.loads(content)
            except (KeyError, json.JSONDecodeError) as e:
                print(f"Error parsing DeepSeek response: {e}, Response: {result}")
                return {"research": [], "background": []}

resume_service = ResumeService()
