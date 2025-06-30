# Use official Node.js LTS image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 