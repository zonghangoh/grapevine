# Use Node.js LTS version as base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy source code (excluding node_modules)
COPY . .
RUN rm -rf node_modules/

# Install dependencies
RUN npm install

# Build TypeScript code
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run migrations and start server
CMD ["node", "dist/index.js"]