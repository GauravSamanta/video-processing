# Use the official Bun image
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . ./

# Run the app
USER bun
EXPOSE 3000

# Generate drizzle-kit files before starting the app
RUN bunx drizzle-kit generate

# Set entrypoint to run migrations and then start the application
ENTRYPOINT ["sh", "-c", "bunx drizzle-kit migrate && bun run dev"]
