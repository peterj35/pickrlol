import AWS from 'aws-sdk/global'
import S3 from 'aws-sdk/clients/s3'
import { getExtensionOnlyFromFileType } from './file'
import imageCompression from 'browser-image-compression'

const awsRegion = process.env.REACT_APP_AWS_REGION
const awsIdentityPoolId = process.env.REACT_APP_AWS_IDENTITY_POOL_ID
const awsS3MediaBucket = process.env.REACT_APP_AWS_MEDIA_BUCKET
const mediaCdnUrl = process.env.REACT_APP_MEDIA_ROOT

if (typeof awsRegion !== 'string') {
  throw new Error('env var REACT_APP_AWS_REGION not defined')
}

if (typeof awsIdentityPoolId !== 'string') {
  throw new Error('env var REACT_APP_AWS_IDENTITY_POOL_ID not defined')
}

if (typeof awsS3MediaBucket !== 'string') {
  throw new Error('env var REACT_APP_AWS_MEDIA_BUCKET not defined')
}

if (!mediaCdnUrl) {
  throw new Error('undefined env var')
}

AWS.config.update({
  region: awsRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsIdentityPoolId,
  }),
  useAccelerateEndpoint: true,
  correctClockSkew: true,
  maxRetries: 100,
  retryDelayOptions: {
    base: 1000,
  },
})

/**
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html
 * @see https://github.com/aws/aws-sdk-js/issues/399#issuecomment-279812538
 */
const s3 = new S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: awsS3MediaBucket,
  },
})

// See: https://www.npmjs.com/package/browser-image-compression
const compressibleFileTypes = ['jpg', 'jpeg', 'png', 'webp']

const thumbnailImageCompressOpts = {
  maxWidthOrHeight: 400,
}

const imageCompressOpts = {
  maxSizeMB: 0.7,
  maxWidthOrHeight: 1980,
}

type UploadImageOutput = {
  largeRemoteUrl: string
  thumbRemoteUrl?: string
}

/**
 * uploadImage
 *
 * Generates two versions of the
 *
 * @param {string} id
 * @param {File} img
 * @returns Promise<uploadedLargeImagePath>
 */
export const uploadImage = async (
  id: string,
  img: File
): Promise<UploadImageOutput> => {
  let image = img
  let thumbImage = undefined
  // Compress image if compression supported
  const extension = getExtensionOnlyFromFileType(image.type)

  if (compressibleFileTypes.includes(extension)) {
    try {
      image = await imageCompression(img, imageCompressOpts)
      thumbImage = await imageCompression(img, thumbnailImageCompressOpts)
    } catch (e) {
      console.error(e)
      alert(
        `Image with name, ${image.name} could not be processed properly! Please try reuploading the topic with a different image.`
      )
      // Continue to throw
      throw e
    }
  }

  const largeImagePath = `public/${id}/`

  let thumbImagePath
  if (thumbImage) {
    thumbImagePath = `public/${id}-thumb`
  }

  // Upload to s3 with transfer acceleration and retries
  try {
    // Wait for uploads to finish
    await s3
      .upload({
        Bucket: awsS3MediaBucket,
        Key: largeImagePath,
        Body: image,
      })
      .promise()

    if (thumbImage && thumbImagePath) {
      await s3
        .upload({
          Bucket: awsS3MediaBucket,
          Key: thumbImagePath,
          Body: thumbImage,
        })
        .promise()
    }
  } catch (e) {
    // IMPROVE: should render a upload failed feedback UI to the user
    console.error('upload failed after retries, should provide user feedback')
  }

  return {
    largeRemoteUrl: largeImagePath,
    thumbRemoteUrl: thumbImagePath,
  }
}

export const isLocalImage = (mediaSrc: string) => !mediaSrc.includes('public')

/**
 * Gets the viewable media URL depending on whether it's a publically
 * hosted image or a local object URL
 *
 * @param mediaSrc Either the local objectURL of the image,
 * or the remote CDN path
 *
 * IMPROVE: in the case a local mediaSrc includes 'public', this logic
 * will be broken. Consider making the heuristic narrower, eg. mediaSrc.startsWith('/public')
 */
export const getMediaUrl = (mediaSrc: string) =>
  isLocalImage(mediaSrc) ? mediaSrc : `${mediaCdnUrl}/${mediaSrc}`
