// Regex from https://gist.github.com/stewartduffy/481f21ea4906e611d934
const extensionRegex = /\.[^/.]+$/

// Given 'testImage.jpg', returns testImage
export const removeExtension = (fileName: string) =>
  fileName.replace(extensionRegex, '')

// Given 'image/jpeg', returns 'jpeg'
export const getExtensionOnlyFromFileType = (fileType: string) =>
  fileType.replace(/(.*)\//g, '')
