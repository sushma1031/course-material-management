const pool = require("../database/cm_database.js");

const addBookmark = async (req, res) => {
  // req.query = {uid: _, nid: _}
  let status = 'undefined';
  const userId = Number(req.query.uid);
  const noteId = Number(req.query.nid);
  if (!userId || !noteId) {
    res.sendStatus(400);
  }
  if (userId != req.session.userId) {
    console.log("Danger: User trying to create bookmark for another user");
    return res.redirect("/");
  }
  try {
    const [result] = await pool.query(`
    INSERT IGNORE INTO bookmarks VALUES (?, ?)`, [userId, noteId]);
    status = "success";
  } catch (error) {
    return res.json({ "status": "failure", "message":error.message });
  }
  res.redirect(`/u/${userId}/profile`);
}

const deleteBookmark = async (req, res) => {
  let status = 'undefined';
  const userId = Number(req.query.uid);
  const noteId = Number(req.query.nid);
  if (!userId || !noteId) {
    res.sendStatus(400);
  }
  if (userId != req.session.userId) {
    console.log("Danger: User trying to delete another user's bookmark");
    return res.redirect("/");
  }
  try {
    const [result] = await pool.query(`
    DELETE FROM bookmarks WHERE user_id = ? AND note_id = ?`, [userId, noteId]);
    status = "success";
  } catch (error) {
    return res.json({ "status": "failure", "message":error.message });
  }
  res.redirect(`/u/${userId}/profile`);
}
module.exports = { addBookmark, deleteBookmark };