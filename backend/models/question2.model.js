import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    answer: String,
  },

);

const Question2 = mongoose.model("myQuestions", questionSchema, );

export default Question2;
