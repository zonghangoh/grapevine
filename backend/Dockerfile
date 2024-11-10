# Use Node.js LTS version as base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run migrations and start server
CMD ["node", "dist/index.js"]