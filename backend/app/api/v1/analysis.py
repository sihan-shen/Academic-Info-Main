from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_service import resume_service
from app.utils import success_response, error_response

router = APIRouter()

@router.post("/upload", summary="上传简历并分析", description="上传图片或PDF格式的简历，提取文字并分析研究方向和学术背景")
async def upload_resume(file: UploadFile = File(...)):
    try:
        # 1. 读取文件内容
        content = await file.read()
        
        # 2. 根据类型提取文字
        text = ""
        if file.content_type == "application/pdf":
            text = await resume_service.extract_text_from_pdf(content)
        elif file.content_type.startswith("image/"):
            text = await resume_service.extract_text_from_image(content)
        else:
            return error_response(message="Unsupported file type. Please upload PDF or Image.")
            
        if not text:
             return error_response(message="Failed to extract text from the file.")

        # 3. LLM 分析
        result = await resume_service.analyze_resume_text(text)
        
        return success_response(data=result, message="Analysis completed successfully")
        
    except Exception as e:
        print(f"Error processing resume: {str(e)}")
        return error_response(message=f"Internal server error: {str(e)}")
