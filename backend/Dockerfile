# syntax=docker/dockerfile:1
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Install pip and uv (for PEP 621/pyproject.toml)
RUN pip install --upgrade pip && pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv pip install --system .

# Copy application code
COPY ./app ./app

# Expose port for FastAPI
EXPOSE 8000

# Run the FastAPI app with uvicorn
CMD ["uv", "run", "fastapi", "run", "app/main.py", "--port", "8000"]

