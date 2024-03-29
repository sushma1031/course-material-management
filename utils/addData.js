const pool = require("../database/cm_database.js");

const addDepartment = async ({ code, name }) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO departments
        VALUES (null, ?, ?)`,
      [code, name]
    );
    return JSON.stringify({status: "success" });
  } catch (err) {
    throw new Error(err.message);
  }
}

const addSyllabus = async ({ deptID, semester, scheme, pdfLink }) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO syllabuses
        VALUES (null, ?, ?, ?, ?)`,
      [semester, deptID, scheme, pdfLink]
    );
    return JSON.stringify({status: "success" });
  } catch (err) {
    throw new Error(err.message);
  }
};

const addSubject = async ({code, name, semester, syllabusID, offeringDeptIDs}) => {
  // id, code, semester, name, syllabus
  let subjectID;
  try {
    const [result] = await pool.query(
      `INSERT INTO subjects
        VALUES (null, ?, ?, ?, ?)`,
      [code, semester, name, syllabusID]
    );
    subjectID = result.insertId;
  } catch (err) {
    throw new Error(err.message);
  }

  //add entries into dept_subs, depts here are ids
  try {
    for (var i = 0; i < offeringDeptIDs.length; i++) {
      const [result] = await pool.query(
        `INSERT INTO department_subjects
          VALUES (?, ?)`,
        [offeringDeptIDs[i], subjectID]
      );
    }
    return JSON.stringify({ status: "success" });
  } catch (err) {
    throw new Error(err.message);
  }
}


module.exports = { addDepartment, addSubject, addSyllabus };