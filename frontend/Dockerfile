# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy source code (excluding node_modules)
COPY . .
RUN rm -rf node_modules/

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3001 to match docker-compose
EXPOSE 3001

# Start nginx
CMD ["nginx", "-g", "daemon off;"]