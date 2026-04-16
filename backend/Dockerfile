# Stage 1: Builder (Compilation & Dependency Resolution)
# Standardizes the build environment to ensure consistent compilation of binary drivers.
FROM python:3.12-slim as builder


# Install system dependencies required for compilation (e.g. psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv (blazing fast python package manager)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Copy pyproject.toml and uv.lock first to leverage Docker cache
COPY pyproject.toml uv.lock ./

# Install dependencies into a localized virtual environment.
# --frozen: ensures the exact lockfile versions are used.
# --no-dev: excludes development tools (pytest, etc.) to minimize image size.
RUN uv sync --frozen --no-dev --no-install-project


# Stage 2: Runtime (Final hardened image)
FROM python:3.12-slim as runtime

# Install ONLY the runtime shared library for PostgreSQL (no compilers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-privileged user for security hardening
RUN groupadd -r app && useradd -r -g app app

WORKDIR /app

# Copy only the pre-compiled virtual environment from the builder stage.
# This "surgical" extraction throws away the 'build-essential' compilers and uv tool.
COPY --from=builder /app/.venv /app/.venv


# Copy the actual backend code with correct ownership
COPY --chown=app:app . .

# Set environment to use the virtualenv automatically
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Ensure images directory exists and is writable by the app user
RUN mkdir -p images && chown app:app images

# Switch to the non-privileged user
USER app

EXPOSE 8000

# Start FastAPI via uvicorn
CMD uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}
