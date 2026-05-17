# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the project (compiles TypeScript to dist/)
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the compiled output from build stage
COPY --from=build /app/dist ./dist

# Copy package files for production install
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
