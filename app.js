require("dotenv").config();
const ejs = require("ejs");
const express = require("express");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const options = {
  connectionLimit: 10,
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  createDatabaseTable: false,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
  endConnectionOnClose: true,
};
const sessionStore = new mysqlStore(options);
const TWELVE_HOURS = 1000 * 60 * 60 * 12;

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
      maxAge: TWELVE_HOURS,
    },
  })
);

const PORT = 3000;

const getDepartments = require("./controllers/departmentsController.js");
const getSemesterSubjectsContoller = require("./controllers/semesterController.js");
const getSubjectMaterialsController = require("./controllers/subjectController.js");

const getSearchNotesController = require("./controllers/getSearchNotesController.js");
const postSearchNotesController = require("./controllers/postSearchNotesController.js");
const getSearchQPsController = require("./controllers/getSearchQPsController.js");
const postSearchQPsController = require("./controllers/postSearchQPsController.js");

const getRegisterController = require("./controllers/registerController.js");
const registerGet = getRegisterController.registerUserGet;
const registerPost = getRegisterController.registerUserPost;
const getLoginController = require('./controllers/loginController.js');
const getLoginUser = getLoginController.getLoginUser;
const postLoginUser = getLoginController.postLoginUser;

const getHomePage = require('./controllers/homeController.js');

const addNote = require('./controllers/addNoteController.js');
const getAddController = addNote.getController;
const postAddController = addNote.postController;

const addQP = require("./controllers/addQPController.js");
const getAddQP = addQP.getController;
const postAddQP = addQP.postController;

const IAController = require('./controllers/iaPapersContoller.js');

const editNote = require("./controllers/editNoteController.js");
const getEditNote = editNote.getController;
const putEditNote = editNote.putController;

const editQP = require("./controllers/editQPController.js");
const getEditQP = editQP.getController;
const putEditQP = editQP.putController;

const getAdd = require('./controllers/add.js').getController;
const postAdd = require("./controllers/add.js").postController;
const getEdit = require("./controllers/edit.js").getController;
const postEdit = require("./controllers/edit.js").postController;

const deleteDeptController = require("./controllers/deleteDeptController.js");
const deleteSubjectController = require("./controllers/deleteSubjectController.js");
const deleteSyllabusController = require("./controllers/deleteSyllabus.js");
const deleteNoteController = require("./controllers/deleteNoteController.js");
const deleteQPController = require("./controllers/deleteQPController.js");

const getProfileController = require("./controllers/getProfile.js");
const logoutUserController = require('./controllers/logoutUserController.js');
const deleteUserController = require("./controllers/deleteUserController.js");
const addBookmark = require("./controllers/bookmarkController.js").addBookmark;
const deleteBookmark = require("./controllers/bookmarkController.js").deleteBookmark;

const adminTools = require("./controllers/adminTools.js");

const { redirectIfAuthenticated, authenticate, authoriseTeacher, authoriseAdmin } = require('./controllers/middleware.js');

app.use(function (req, res, next) {
  res.locals = {
    authId: req.session.userId,
    authRole: req.session.role,
  };
  next();
});

app.get("/", getHomePage);
app.get("/departments/:code/semesters/:semester", getSemesterSubjectsContoller);
app.get("/subjects/:subjectCode", authenticate, getSubjectMaterialsController);

app.get("/search", authenticate, getDepartments.searchDepts);
app.get("/departments/:code/notes/search", authenticate, getSearchNotesController);
app.post("/departments/:code/notes/search", authenticate, postSearchNotesController);
app.get("/departments/:code/question-papers/search", authenticate, getSearchQPsController);
app.post("/departments/:code/question-papers/search", authenticate, postSearchQPsController);

app.get("/register", redirectIfAuthenticated, registerGet);
app.post("/register", redirectIfAuthenticated, registerPost);
app.get("/login", redirectIfAuthenticated, getLoginUser);
app.post("/login", redirectIfAuthenticated, postLoginUser);

app.get("/add-material", authenticate, authoriseTeacher, getDepartments.addMaterialDepts);
app.get("/departments/:code/notes/add", authenticate, authoriseTeacher, getAddController);
app.post("/departments/:code/notes/add", authenticate, authoriseTeacher, postAddController);
app.get("/departments/:code/question-papers/add", authenticate, authoriseTeacher, getAddQP);
app.post("/departments/:code/question-papers/add", authenticate, authoriseTeacher, postAddQP);
app.get("/departments/:code/ia-papers/add", authenticate, authoriseTeacher, IAController.get);
app.post("/departments/:code/ia-papers/add", authenticate, authoriseTeacher, IAController.post);

app.use("/manage", authenticate, authoriseTeacher, adminTools);

app.get("/notes/edit", authenticate, authoriseTeacher, getEditNote);
app.post("/notes/edit", authoriseTeacher, putEditNote);

app.get("/question-papers/edit", authenticate, authoriseTeacher, getEditQP);
app.post("/question-papers/edit", authenticate, authoriseTeacher, putEditQP);

app.get("/add", authenticate, authoriseTeacher, getAdd);
app.post("/add", authenticate, authoriseTeacher, postAdd);
app.get("/edit", authenticate, authoriseTeacher, getEdit);
app.post("/edit", authenticate, authoriseTeacher, postEdit);

app.get("/departments/delete/:code", authenticate, authoriseAdmin, deleteDeptController);
app.get("/subjects/delete/:id", authenticate, authoriseAdmin, deleteSubjectController);
app.get("/syllabuses/delete/:id", authenticate, authoriseAdmin, deleteSyllabusController);
app.get("/notes/delete", authenticate, authoriseAdmin, deleteNoteController);
app.get("/question-papers/delete", authenticate, authoriseAdmin, deleteQPController);
app.get("/ia-papers/delete", authenticate, authoriseAdmin, IAController.del);

app.get("/u/bookmarks/add", authenticate, addBookmark);
app.get("/u/bookmarks/delete", authenticate, deleteBookmark);

app.get("/u/:userId/profile", authenticate, getProfileController);
app.get("/u/:userId/logout", authenticate, logoutUserController);
app.get("/u/:userId/delete", authenticate, deleteUserController);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
