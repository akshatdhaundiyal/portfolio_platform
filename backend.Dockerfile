# Use official Python 3.12 slim image
FROM python:3.12-slim

# Install system dependencies required for compilation (e.g. psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv (blazing fast python package manager)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set working directory
WORKDIR /app

# Copy pyproject.toml and uv.lock first to leverage Docker cache
COPY pyproject.toml uv.lock ./

# Install dependencies into the system environment to avoid virtualenv overhead in Docker
RUN uv pip install --system -r pyproject.toml

# Copy the actual backend code
COPY backend ./backend

# Expose backend port
EXPOSE 8000

# Start FastAPI via uvicorn
CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8000"]
