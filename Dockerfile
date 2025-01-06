# Use a nodejs base image
FROM  node:current-alpine3.21
# Set the working directory to /app
WORKDIR  /app
# Copy package.json and package-lock.json for dependency installation
COPY  package*.json /app/
# Install dependencies
RUN npm install --production 
# Copy the rest of the application code
COPY  . /app/
# Expose the port  app runs on (default: 3000 for Express)
EXPOSE 3000
# Command to run  Express app
CMD ["node", "app.js"]