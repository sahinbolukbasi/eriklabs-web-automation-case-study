# Use the official Playwright image which includes Node.js and browser binaries
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
# We use npm ci for a clean, reproducible build
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project files
COPY . .

# Create directories for artifacts if they don't exist
RUN mkdir -p allure-results allure-report videos screenshots traces

# Set default environment variables (can be overridden at runtime)
ENV HEADLESS=true
ENV CI=true

# Command to run tests (parallel by default)
CMD ["npm", "run", "test:parallel"]
