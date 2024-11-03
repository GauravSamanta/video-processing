# Use the Bun base image
FROM oven/bun:1

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
    
COPY package.json bun.lockb ./

ENV  DATABASE_URL=postgres://user:password@db:5432/video-proc

    # Install dependencies
RUN bun install

# Set the working directory
WORKDIR /app


# Copy your app files
COPY . .
RUN bun install drizzle-kit
RUN bunx drizzle-kit generate

