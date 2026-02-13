# ===============================================
# 构建阶段
# ===============================================
FROM node:22-alpine AS builder

RUN apk update && apk upgrade

# 设置时区
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata

WORKDIR /app

# 安装依赖项所需的系统包
RUN apk add --no-cache libc6-compat
RUN apk cache clean

# 先复制并安装依赖（利用 Docker 缓存层）
COPY package.json package-lock.json* ./
RUN npm install -g npm@latest
RUN npm ci && npm cache clean --force

# 复制其他文件并构建
COPY . .

# 禁用Next.js遥测
RUN npx next telemetry --disable

# 构建应用
RUN npm run build

# ===============================================
# 生产阶段
# ===============================================
FROM node:22-alpine AS runner

RUN apk update && apk upgrade

# 设置时区
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata
RUN apk cache clean

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 使用非 root 用户提升安全性
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 从构建阶段复制独立运行所需的文件
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]