import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
});

const AddDiary = mongoose.model("Diary", diarySchema);
export default AddDiary;
