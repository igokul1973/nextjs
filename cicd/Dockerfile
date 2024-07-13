# Step 1: Get and configure yarn
FROM node:18.18-alpine AS install
# Set the working directory
WORKDIR /app
# Add the source code to app
COPY . .
# Generate the build of the application
RUN yarn config set strict-ssl false && yarn

# Step 2: Test the app
FROM install AS test
# Generate the build of the application
RUN yarn test

# Step 3: Lint the app
FROM install AS lint
# Generate the build of the application
RUN yarn lint && yarn stylelint

# Step 4: Build the app in image 'builder' for staging env
FROM install AS build-staging
# Generate the build of the application
RUN yarn build:staging

# Step 4: Build the app in image 'builder' for production env
FROM install AS build-production
# Generate the build of the application
RUN yarn build:production

# Step 5: Build base Nginx image
FROM nginx:1.25.3-alpine3.18-slim AS image-base
# Add the nginx.conf file
COPY ./cicd/nginx.conf /etc/nginx/conf.d/default.conf
# Set the working directory
WORKDIR /www/dist

# Step 6: Use build output from build-staging
FROM image-base AS image-staging
# Copy the build output to replace the default nginx contents
COPY --from=build-staging /app/dist/drp-frontend .

# Step 6: Use build output from build-production
FROM image-base AS image-production
# Copy the build output to replace the default nginx contents
COPY --from=build-production /app/dist/drp-frontend .
