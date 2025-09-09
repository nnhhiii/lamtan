// models/Position.js
const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true],
      trim: true,
    },
    description: {
      type: String, // mô tả chi tiết công việc
      required: [true],
    },
    requirements: {
      type: String, // yêu cầu ứng viên
      default: '',
    },
    benefits: {
      type: String, // quyền lợi
      default: '',
    },
    workAddress: {
      type: String, // địa điểm làm việc
      required: [true],
    },
    salary: {
      type: String, // mức lương (có thể để string để ghi "Thỏa thuận")
      default: 'Thỏa thuận',
    },
    type: {
      type: String,
      enum: ['fulltime', 'parttime', 'internship', 'contract'],
      default: 'fulltime',
    },
    status: {
      type: String,
      enum: ['open', 'closed'], // còn tuyển hay đã đóng
      default: 'open',
    },
    deadline: {
      type: Date, // hạn nộp hồ sơ
    },
  },
  { timestamps: true }
);

const Position = mongoose.model('Position', positionSchema);

module.exports = Position;
