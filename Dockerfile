#
# 🧑‍💻 Development
#
FROM node:18-alpine as dev

# Create app folder
WORKDIR /app

# Copy source code into app folder
COPY --chown=node:node . .

# Install dependencies
RUN npm ci

# Set Docker as a non-root user
USER node

#
# 🏡 Production Build
#
FROM node:18-alpine as build

WORKDIR /app

# In order to run `yarn build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
# Copy source code
COPY --chown=node:node . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN npm run build

# Install only the production dependencies and clean cache to optimize image size.
RUN npm ci --omit=dev && npm cache clean --force

# Set Docker as a non-root user
USER node

#
# 🚀 Production Server
#
FROM node:18-alpine as prod

WORKDIR /app

# Copy only the necessary files
COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules

# Set Docker as non-root user
USER node

# Expose the port on which the app will run
EXPOSE 8080

# Start the server using the production build
CMD ["node", "dist/main.js"]

