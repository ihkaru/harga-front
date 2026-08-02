FROM node:20-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose Quasar dev server port
EXPOSE 9100

ENV HOST=0.0.0.0
ENV PORT=9100

CMD ["npx", "quasar", "dev", "-H", "0.0.0.0", "-p", "9100"]
