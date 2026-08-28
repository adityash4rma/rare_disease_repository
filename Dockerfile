# Python Dockerfile for Backend and Federated Learning nodes
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

# Copy and install python dependencies using lightweight CPU wheels
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy project source code
COPY . /app/

# Expose FastAPI (8000) and Flower FL gRPC (8090)
EXPOSE 8000 8090

# Default command: FastAPI API backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
