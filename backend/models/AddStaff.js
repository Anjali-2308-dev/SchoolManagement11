import mongoose  from "mongoose";
const StaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true
    },
    role: {
      type: String,
      require: true,
        enum: [
        'Mathematics Teacher',
        'English Teacher',
        'Science Teacher',
        'Art Teacher',
        'Physical Education Teacher',
        'Librarian',
        'Lab Assistant'
      ],
    },
    subjects:{
        type:[String],
        require:true
    },
    classes:{
        type:[String],
        default: ['TBD']
    },
    joinDate:{
       type: String, 
      required: true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase: true,
      match: [/^[a-zA-Z0-9_]+@gmail\.com$/, 'is invalid email']
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Phone number must be 10 digits'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  });

export const AddStaff = mongoose.model('Staff', StaffSchema);
