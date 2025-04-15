import Joi from 'joi'

const minNameLength = 2
const maxNameLength = 15

const minBodyLength = 8
const maxBodyLength = 120

export const commentSchema = Joi.object({
  name: Joi.string()
    .min(minNameLength)
    .max(maxNameLength)
    .messages({
      'string.empty': `Name must be more than ${minNameLength} characters and less than ${maxNameLength} characters.`,
      'string.min': `Name must be more than ${minNameLength} characters.`,
      'string.max': `Name must be less than ${maxNameLength} characters.`,
    }),
  body: Joi.string()
    .min(minBodyLength)
    .max(maxBodyLength)
    .messages({
      'string.empty': `Comment body must be more than ${minBodyLength} characters and less than ${maxBodyLength} characters.`,
      'string.min': `Comment body must be more than ${minBodyLength} characters.`,
      'string.max': `Comment body must be less than ${maxBodyLength} characters.`,
    }),
})
