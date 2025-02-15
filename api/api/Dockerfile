# Backend (Django)
FROM python:3.12.4-slim-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Set working directory
WORKDIR /app

# Copy backend files
COPY . /app/

# Install dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Migrate database
RUN python manage.py makemigrations --noinput \
    && python manage.py migrate --noinput

# Expose backend port
EXPOSE 8080

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "api.wsgi:application"]
