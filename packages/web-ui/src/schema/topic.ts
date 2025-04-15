import Joi from 'joi'

const MIN_TITLE_LENGTH = 10
const MAX_TITLE_LENGTH = 100
const MIN_DESCRIPTION_LENGTH = 4
const MAX_DESCRIPTION_LENGTH = 340
const MIN_NUMBER_OF_CHOICES = 4
const MAX_NUMBER_OF_CHOICES = 128
export const MAX_CHOICE_NAME_LENGTH = 40

export const topicSchema = Joi.object({
  name: Joi.string()
    .empty()
    .min(MIN_TITLE_LENGTH)
    .max(MAX_TITLE_LENGTH)
    .messages({
      'string.empty': '🌟 Give your topic a memorable title',
      'string.min': `🤔 The title seems too short to be descriptive (Min: ${MIN_TITLE_LENGTH} characters)`,
      'string.max': `💥 Title is too long! (Max: ${MAX_TITLE_LENGTH} characters)`,
    }),
  description: Joi.string()
    .empty()
    .min(MIN_DESCRIPTION_LENGTH)
    .max(MAX_DESCRIPTION_LENGTH)
    .messages({
      'string.empty':
        '📝 Give your topic an in-depth description, such as specific picking criteria, or caveats',
      'string.min': `🤔 The description seems too short to be informative (Min: ${MIN_DESCRIPTION_LENGTH} characters)`,
      'string.max': `💥 Description is too long! (Max: ${MAX_DESCRIPTION_LENGTH} characters)`,
    }),
  choices: Joi.array()
    .min(MIN_NUMBER_OF_CHOICES)
    .max(MAX_NUMBER_OF_CHOICES)
    .messages({
      'array.min': `😊 Add at least ${MIN_NUMBER_OF_CHOICES} choices to make it a fun game`,
      'array.max': `💥 Too many choices! (Max: ${MAX_NUMBER_OF_CHOICES})`,
    }),
  choiceName: Joi.string().max(MAX_CHOICE_NAME_LENGTH).allow(null, ''),
})
