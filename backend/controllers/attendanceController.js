import Student from "../models/AddAttendence.js"

// GET students for a class
exports.getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.query;
    const students = await Student.find({ class: className });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// POST save bulk attendance
exports.saveBulkAttendance = async (req, res) => {
  try {
    const payload = req.body; // Array of students with attendance

    for (const studentData of payload) {
      const { name, rollNo, className, date, present } = studentData;

      let student = await Student.findOne({ rollNo });

      if (!student) {
        // New student
        student = new Student({
          name,
          rollNo,
          class: className,
          attendance: [{ date, present }]
        });
      } else {
        // Existing student: update or add attendance for date
        const existingDate = student.attendance.find(a => a.date === date);
        if (existingDate) {
          existingDate.present = present;
        } else {
          student.attendance.push({ date, present });
        }
      }

      await student.save();
    }

    res.status(200).json({ message: 'Attendance saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving attendance' });
  }
};

export 
