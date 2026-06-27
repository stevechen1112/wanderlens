# wanderlens-media Dockerfile

FROM python:3.12-slim

WORKDIR /app

# 系統依賴（rawpy 需要 libraw）
RUN apt-get update && apt-get install -y --no-install-recommends \
    libraw-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Python 依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 原始碼
COPY . .

EXPOSE 3004

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3004"]