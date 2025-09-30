# Use official Node.js runtime as base image
FROM node:18-alpine

# Install curl (for healthcheck)
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from project root
COPY ../package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the whole node-part-2 folder (not just src)
COPY node-part-2 ./node-part-2

# Create logs directory and fix permissions
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app


# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 -G nodejs nodejs
USER nodejs

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Start app
CMD ["npm", "start"]

