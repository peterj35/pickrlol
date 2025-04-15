import Joi from 'joi'

const minNameLength = 2
const maxNameLength = 15

const regex = new RegExp('^[a-z]+(-[a-z]+)*$')

export const tagSchema = Joi.object({
  name: Joi.string()
    .min(minNameLength)
    .max(maxNameLength)
    .regex(regex)
    .messages({
      'string.empty': `Name must be more than ${minNameLength} characters and less than ${maxNameLength} characters.`,
      'string.min': `Name must be more than ${minNameLength} characters.`,
      'string.max': `Name must be less than ${maxNameLength} characters.`,
    }),
})
