import httpx
from app.config import settings

UPLOAD_URL = "https://upload.uploadcare.com/base/"
API_URL    = "https://api.uploadcare.com"

def upload_file(file_bytes: bytes, filename: str) -> dict:
    """Upload bytes to Uploadcare, return {url, public_id, type}."""
    is_video = filename.lower().endswith((".mp4", ".webm", ".ogg", ".mov"))
    with httpx.Client(timeout=60) as client:
        r = client.post(
            UPLOAD_URL,
            data={"UPLOADCARE_PUB_KEY": settings.UPLOADCARE_PUBLIC_KEY, "UPLOADCARE_STORE": "1"},
            files={"file": (filename, file_bytes)},
        )
        r.raise_for_status()
        file_id = r.json()["file"]
    url = f"https://ucarecdn.com/{file_id}/-/preview/"
    return {"url": url, "public_id": file_id, "type": "video" if is_video else "image"}

def delete_file(public_id: str, **kwargs):
    """Delete a file from Uploadcare."""
    try:
        with httpx.Client(timeout=10) as client:
            client.delete(
                f"{API_URL}/files/{public_id}/",
                headers={
                    "Authorization": f"Uploadcare.Simple {settings.UPLOADCARE_PUBLIC_KEY}:{settings.UPLOADCARE_SECRET_KEY}",
                    "Accept": "application/vnd.uploadcare-v0.7+json",
                },
            )
    except Exception:
        pass  # best-effort
