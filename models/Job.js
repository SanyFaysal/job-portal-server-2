const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

const jobSchema = mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      lowercase: true,
      minLength: [3, 'Name is too small'],
    },
    applyingEmail: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Please provide a contact number'],
      validate: [
        validator.isMobilePhone,
        'Please provide a valid phone number',
      ],
    },
    jobDescription: {
      type: String,
      required: [true, 'Minimum description is required'],
    },
    workingTime: {
      type: String,
      required: [true, ' working time is required'],
    },
    salaryRange: {
      type: String,
      required: [true, 'Please provide compensation'],
    },

    skills: {
      type: Array,
      required: [true, 'Please provide job skills'],
    },
    responsibilities: {
      type: Array,
      required: [true, 'Please provide job responsibilities'],
    },
    requirements: {
      type: Array,
      required: [true, 'Please provide job requirements'],
    },

    vacancy: {
      type: String,
      required: [true, 'Please provide your job vacancy number'],
    },
    experience: {
      type: String,
      required: [true, 'Please provide experience '],
      enum: {
        values: [
          'fresher',
          '1 year experience',
          '2 - 3 years experience',
          '3 - 5 years experience',
          '5 year + experience'
        ],
        message: " Experience Can't be {VALUE}",
      },
    },
    status: {
      type: String,
      default: 'open',
      enum: {
        values: ['open', 'ended', 'closed'],
        message: "{VALUE} can't be a status",
      },
    },
    employmentType: {
      type: String,
      required: [true, 'Please provide employment type'],
      enum: {
        values: ['remote', 'on-site', 'hybrid'],
        message: " Job type must be remote/ on-site. Can't be {VALUE}",
      },
    },
    jobType: {
      type: String,
      required: [true, 'Please provide job type'],
      enum: {
        values: ['fullTime', 'partTime', 'freelance'],
        message: " Job type must be remote/ on-site. Can't be {VALUE}",
      },
    },
    location: {
      type: String,
      lowercase: true,
      required: [true, 'Please provide your job location'],
    },
    postedBy: {
      name: {
        type: String,
        lowercase: true,
        trim: true,
      },
      id: {
        type: ObjectId,
        ref: 'User',
      },
    },
    dateline: {
      type: Date,
      min: [Date.now(), 'Dateline must be greater than the time of now'],
      required: [true, 'Please provide a dateline'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      required: [true, 'Please provide a dateline'],
    },

    applicants: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],

    queries: [
      {
        question: {
          qus: String,
          createdAt: {
            type: Date,
            default: Date.now()
          },
          quesBy: {
            type: ObjectId,
            ref: 'User',
          },

        },
        answer: [
          {
            ans: String,
            createdAt: {
              type: Date,
              default: Date.now()
            },
            ansBy: {
              type: ObjectId,
              ref: 'User'
            }
          }
        ]
      }
    ]
  },
  {
    timeStamps: { createdAt: true, updatedAt: false }
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
