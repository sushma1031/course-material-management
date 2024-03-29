const pool = require("../database/cm_database.js");

const getAllDepartments = async () => {
  try {
    const [departments] = await pool.query(
      `SELECT id, code, name FROM departments`
    );
    return departments;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllSyllabuses = async () => {
  try {
    const [syllabuses] = await pool.query(
      `SELECT s.id, d.code, s.semester, s.scheme, s.pdf_link FROM syllabuses s, departments d
        WHERE s.dept_id = d.id`);
    return syllabuses;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUsernames = async () => {
  try {
    const [usernames] = await pool.query(
      `SELECT username FROM users`
    );
    return usernames;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllNotes = async () => {
  try {
    const [notes] = await pool.query(
      `SELECT n.id, n.title, s.code, n.module_no, n.link FROM notes n, subjects s
          WHERE n.subject_id = s.id`
    );
    return notes;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllQPs = async () => {
  try {
    const [qps] = await pool.query(
      `SELECT qp.*, s.code FROM question_papers qp, subjects s
          WHERE qp.subject_id = s.id`
    );
    return qps;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllTestQPs = async () => {
  try {
    const [qps] = await pool.query(
      `SELECT tp.*, s.code AS subject, d.code AS dept
        FROM test_papers tp, subjects s, departments d
          WHERE tp.subject_id = s.id AND tp.dept_id = d.id`
    );
    return qps;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllUsers = async () => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.username, u.email, r.name as role FROM users u, roles r
          WHERE u.role_id = r.role_id`
    );
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getUserBookmarks = async (userId) => {
  try {
    const [bookmarks] = await pool.query(
      `SELECT n.* FROM notes n, bookmarks b
        WHERE b.note_id = n.id
          AND b.user_id = ?
    `,
    [userId]);
    return bookmarks;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllSubjects = async (deptId = null) => {
  if (!deptId) {
    try {
      const [subjects] = await pool.query(
        `SELECT id, code, name, semester FROM subjects`,
      );
      return subjects;
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    try {
      const [subjects] = await pool.query(
        `SELECT s.name, s.code, s.id FROM subjects s, department_subjects ds
          WHERE s.id = ds.subject_id AND ds.dept_id = ?`, [deptId]
      );
      return subjects;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const getReqdDeptDetails = (type, depts) => {
  depts.forEach((_, i, depts) => depts[i]["links"] = []);
  switch (type) {
    case "search":
      depts.forEach((dept, i, depts) => {
        depts[i].links.push(["Search Notes", `/departments/${dept.code.toLowerCase()}/notes/search`])
        depts[i].links.push(["Search Question Papers", `/departments/${dept.code.toLowerCase()}/question-papers/search`])
      });
      return depts;
      break;
    case "add":
      depts.forEach((dept, i, depts) => {
        depts[i].links.push(["Add Notes", `/departments/${dept.code.toLowerCase()}/notes/add`])
        depts[i].links.push(["Add Exam Papers", `/departments/${dept.code.toLowerCase()}/question-papers/add`])
        depts[i].links.push(["Add IA Papers", `/departments/${dept.code.toLowerCase()}/ia-papers/add`])
      });
      return depts;
      break;
    default:
      return depts;
  }
}

module.exports = {
  getAllDepartments, getAllSyllabuses, getAllSubjects, getUserBookmarks,
  getAllUsernames, getReqdDeptDetails, getAllNotes, getAllQPs, getAllTestQPs, getAllUsers
};