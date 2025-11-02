# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json trước để cache layer
COPY package*.json ./

# Cài cả devDependencies để build
RUN npm install

# Copy source code
COPY . .

# Fix quyền thực thi cho tsc nếu cần
RUN chmod +x node_modules/.bin/tsc

# Build project
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./

# Cài chỉ dependencies cần cho production
RUN npm install --only=production

# Copy dist từ stage build
COPY --from=builder /app/dist ./dist

# Copy các file cấu hình cần thiết (nếu có)
# COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
