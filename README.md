# Pickr

Pickr is a monorepo

## Monorepo initial setup

1. Nodejs (version specified in .nvmrc) and relatively new versions of npm and python must be installed on the system
2. Ensure yarn (`yarn --version`) is installed (`npm install --global yarn`)
3. In the root directory of the project, run `yarn install && yarn build`

## Setup backend

The backend extensively uses serverless, and infrastructre-as-code.

1. In `packages/data-api` run `yarn deploy --stage=${desiredStage}`
2. Note the outputs on the console, to be populated as environment variables for the frontend (alternatively, refer to the CloudFormation console for the deployed resources)

## Setup frontend

The frontend is a un-ejected [CRA](https://create-react-app.dev/) app.

1. `cd packages/web-ui`
2. Create a new `.env` file, and populate it by referencing `.env.example` and the outputs from the serverless deployment.
3. Run `yarn start` to start the local development server

## Setup notifications (optional)

We use ntfy.sh for push notifications to our personal devices. Our space name is [pickr](https://ntfy.sh/pickr).

1. [Download](https://ntfy.sh/) the ntfy app on your personal mobile device.
2. From the app, select add new topic
3. Add the topic, `pickr`
4. Optional: send a test notification to verify you are receiving push notifications

## Tech debt

### CORS issue for images on canvas (for topic history)

For Canvas CORS resources such as images from S3, the header `Access-Control-Allow-Origin` must be present in the resource, or else it won't be loaded, or taint the canvas.

Therefore, the steps from https://aws.amazon.com/premiumsupport/knowledge-center/no-access-control-allow-origin-error/ must be taken so that the appropriate headers are forwarded. However, this was done in the AWS console and not in `serverless.yml` for the S3 and CloudFront resources, which is not ideal. In other words, this CORS setting was not done in code.

Secondly, there's another issue with S3 and Chrome where Chrome caches the images separately from the CORS context. See https://stackoverflow.com/questions/44865121/canvas-tainted-by-cors-data-and-s3. Therefore, the caching needs to be disabled for S3 images entirely.

![CORS config on AWS console](/docs/cloudfront-cors/CORS_setting_2022-04-25_at_1.16.18_AM.png)

This is the setting that was required in order to bypass the CORS issues.

Ideally, all of these configurations would be done in code, and we should return from cache images that aren't being used for the canvas.
