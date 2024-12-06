const express = require("express");
const router = express.Router();
const ManagerControllers = require("../controllers/manager");
const authMiddleware = require("../middlewares/isAuth");
const isAllowed = require("../middlewares/isAllowed");

// Create
router.post(
  "/employee",
  authMiddleware,
  isAllowed("create_employees"),
  ManagerControllers.createEmployee
);
router.post(
  "/project",
  authMiddleware,
  isAllowed("create_projects"),
  ManagerControllers.createProject
);
router.post(
  "/task",
  authMiddleware,
  isAllowed("create_tasks"),
  ManagerControllers.createTask
);
router.post(
  "/milestone",
  authMiddleware,
  isAllowed("create_milestones"),
  ManagerControllers.createMilestone
);

// Update
router.put(
  "/project/:id",
  authMiddleware,
  isAllowed("edit_projects"),
  ManagerControllers.updateProjectDetails
);
router.put(
  "/task/:id",
  authMiddleware,
  isAllowed("edit_tasks"),
  ManagerControllers.updateTaskDetails
);
router.put(
  "/milestone/:id",
  authMiddleware,
  isAllowed("edit_milestones"),
  ManagerControllers.updateMilestoneDetails
);

// Delete
router.delete(
  "/employee/:id",
  authMiddleware,
  isAllowed("delete_employees"),
  ManagerControllers.deleteEmployee
);
router.delete(
  "/project/:id",
  authMiddleware,
  isAllowed("delete_projects"),
  ManagerControllers.deleteProject
);
router.delete(
  "/task/:id",
  authMiddleware,
  isAllowed("delete_tasks"),
  ManagerControllers.deleteTask
);
router.delete(
  "/milestone/:id",
  authMiddleware,
  isAllowed("delete_milestones"),
  ManagerControllers.deleteMilestone
);

// Fetch All Data
router.get("/employees", authMiddleware, ManagerControllers.fetchEmployees);
router.get("/projects", authMiddleware, ManagerControllers.fetchProjects);
router.get("/tasks/:projectId", authMiddleware, ManagerControllers.fetchTasks);
router.get(
  "/milestones/:projectId",
  authMiddleware,
  ManagerControllers.fetchMilestones
);

// Fetch Single Record
router.get("/employee/:id", authMiddleware, ManagerControllers.fetchEmployee);
router.get("/project/:id", authMiddleware, ManagerControllers.fetchProject);
router.get("/task/:id", authMiddleware, ManagerControllers.fetchTask);
router.get("/milestone/:id", authMiddleware, ManagerControllers.fetchMilestone);

// Permission Management
router.get(
  "/permissions/:userId/:projectId",
  authMiddleware,
  isAllowed("view_permissions"),
  ManagerControllers.fetchPermissions
);

router.post(
  "/permissions/global/:userId",
  authMiddleware,
  isAllowed("assign_permissions"),
  ManagerControllers.assignGlobalPermission
);

router.post(
  "/permissions/:userId/:projectId",
  authMiddleware,
  isAllowed("assign_permissions"),
  ManagerControllers.assignPermission
);

module.exports = router;
