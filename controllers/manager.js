const generatePassword = require("../util/generatePassword");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const Milestone = require("../models/milestone");
const Permission = require("../models/permission");
//create controllers
exports.createEmployee = async (req, res, next) => {
  const { name } = req.body;

  try {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Invalid name" });
    }
    const email = `${name}${generatePassword(2)}@MADRIDComp.com`;
    const password = generatePassword(10);

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new User({
      name,
      email,
      password: hashedPassword,
      role: "employee",
    });

    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        name: employee.name,
        email: employee.email,
        role: employee.role,
        password: password,
      }, // Avoid sending the password back
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      deadline,
      status,
      priority,
      createdBy,
    } = req.body;

    const project = new Project({
      title,
      description,
      startDate,
      deadline,
      status,
      priority,
      createdBy: createdBy,
    });

    const savedProject = await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
exports.createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      deadline,
      status,
      priority,
      project,
      milestone,
      assignedTo,
      collaborators,
    } = req.body;
    const task = new Task({
      title,
      description,
      startDate,
      deadline,
      status,
      priority,
      project: project,
      milestone: milestone || null,
      assignedTo: assignedTo || null,
      collaborators,
    });
    const savedTask = await task.save();
    res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "faild to create task",
    });
  }
};
exports.createMilestone = async (req, res, next) => {
  try {
    const { title, description, status, deadline, project } = req.body;
    // console.log("project", project);
    const milestone = new Milestone({
      title,
      description,
      status,
      deadline,
      project: project,
    });
    const savedMilestone = await milestone.save();
    res.status(201).json({
      message: "Milestone created successfully",
      task: savedMilestone,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "failed to create Milestone",
    });
  }
};
//update controllers
exports.updateProjectDetails = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { title, description, deadline, startDate, status, priority } =
      req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (title) project.title = title;
    if (description) project.description = description;
    if (deadline) project.deadline = deadline;
    if (startDate) project.startDate = startDate;
    if (status) project.status = status;
    if (priority) project.priority = priority;

    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.updateTaskDetails = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const {
      title,
      description,
      deadline,
      startDate,
      status,
      project,
      milestone,
      priority,
      assignedTo,
      collaborators,
    } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (title) task.title = title;
    if (description) task.description = description;
    if (deadline) task.deadline = deadline;
    if (startDate) task.startDate = startDate;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (project) task.project = project;
    if (milestone) task.milestone = milestone;
    if (assignedTo) task.assignedTo = assignedTo;
    if (collaborators) task.collaborators = collaborators;

    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.updateMilestoneDetails = async (req, res, next) => {
  try {
    const milestoneId = req.params.id;
    const { title, description, deadline, status, project } = req.body;
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (title) milestone.title = title;
    if (description) milestone.description = description;
    if (deadline) milestone.deadline = deadline;
    if (status) milestone.status = status;
    if (project) milestone.project = project;

    await milestone.save();
    res
      .status(200)
      .json({ message: "Milestone updated successfully", milestone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//delete controllers
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await employee.deleteOne();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const milestones = await Milestone.find({ project: projectId });
    const Tasks = await Task.find({ project: projectId });
    await project.deleteOne();
    await Milestone.deleteMany({ project: projectId });
    await Task.deleteMany({ project: projectId });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteMilestone = async (req, res, next) => {
  try {
    const milestoneId = req.params.id;
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }
    await milestone.deleteOne();
    res.status(200).json({ message: "Milestone deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.fetchEmployees = async (req, res, next) => {
  try {
    const employees = await User.find().select("name email _id role");
    res.status(200).json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.fetchEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employee = await User.findById().select("name email _id role");
    res.status(200).json({ employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.fetchProjects = async (req, res, next) => {
  try {
    // Fetch projects and populate related tasks and milestones
    const projects = await Project.find().select(
      "title description deadline status"
    );

    // Return the fetched projects
    res.status(200).json({ projects });
  } catch (err) {
    console.error(err);

    // Handle server errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.fetchProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    // Fetch projects and populate related tasks and milestones
    const project = await Project.findById(projectId).select(
      "title description deadline status"
    );

    // Return the fetched projects
    res.status(200).json({ project });
  } catch (err) {
    console.error(err);

    // Handle server errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.fetchTasks = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    console.log(projectId);
    const tasks = await Task.find({ project: projectId });

    // Check if tasks array is empty
    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for the project" });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.fetchTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    // Check if tasks array is empty
    if (!task) {
      return res.status(404).json({ message: "The Task Not Found!" });
    }

    res.status(200).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.fetchMilestones = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const milestones = await Milestone.find({ project: projectId });
    if (milestones.length === 0) {
      return res
        .status(404)
        .json({ message: "No milestones found for the project" });
    }
    res.status(200).json({ milestones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.fetchMilestone = async (req, res, next) => {
  try {
    const milestoneId = req.params.id;
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "The Milestone not found!" });
    }
    res.status(200).json({ milestone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.assignPermission = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const permissions = req.body.permissions; // Assuming I passing  array of permissions

    // Ensure permissions is an array
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "Permissions must be an array" });
    }

    // Validate each permission
    const validPermissions = [
      "create_milestones",
      "create_tasks",
      "edit_tasks",
      "edit_milestones",
      "delete_tasks",
      "delete_milestones",
    ];
    const invalidPermissions = permissions.filter(
      (permission) => !validPermissions.includes(permission)
    );

    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        message: `Invalid permissions: ${invalidPermissions.join(", ")}`,
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if any of the requested permissions already exist
    let permissionDoc = await Permission.findOne({
      project: projectId,
      user: userId,
    });

    if (permissionDoc) {
      permissionDoc.permissions = [
        ...new Set([...permissionDoc.permissions, ...permissions]), //I use set to ensure not duplicates
      ];
      await permissionDoc.save();
      return res
        .status(200)
        .json({ message: "Permissions updated successfully" });
    }

    // If no permission document exists, create a new one
    permissionDoc = new Permission({
      project: projectId,
      user: userId,
      permissions: permissions, // Save the array of permissions
    });

    await permissionDoc.save();
    res.status(200).json({ message: "Permissions assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.assignGlobalPermission = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const permissions = req.body.permissions; // Assuming you're passing an array of permissions

    // Ensure permissions is an array and not empty
    if (!Array.isArray(permissions) || permissions.length === 0) {
      return res
        .status(400)
        .json({ message: "Permissions must be a non-empty array" });
    }

    // Remove duplicate permissions if any
    const uniquePermissions = [...new Set(permissions)];

    // Validate each permission
    const validPermissions = [
      "create_milestones",
      "create_employees",
      "create_projects",
      "create_tasks",
      "edit_projects",
      "edit_tasks",
      "edit_milestones",
      "delete_employees",
      "delete_projects",
      "delete_tasks",
      "delete_milestones",
      "view_permissions",
      "assign_permissions",
    ];
    const invalidPermissions = uniquePermissions.filter(
      (permission) => !validPermissions.includes(permission)
    );

    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        message: `Invalid permissions: ${invalidPermissions.join(", ")}`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has global permissions (project: null)
    let permissionDoc = await Permission.findOne({
      user: userId,
      project: null, // Global permissions have project: null
    });

    if (permissionDoc) {
      // If permissions already exist, add the new permissions without duplicating
      permissionDoc.permissions = [
        ...new Set([...permissionDoc.permissions, ...uniquePermissions]),
      ]; // Merge and remove duplicates
      await permissionDoc.save();
      return res
        .status(200)
        .json({ message: "Global permissions updated successfully" });
    } else {
      // If no existing permission document, create a new one
      permissionDoc = new Permission({
        user: userId,
        permissions: uniquePermissions, // Save the array of permissions
        project: null, // Null means global permissions
      });
      await permissionDoc.save();
      return res
        .status(200)
        .json({ message: "Global permissions assigned successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.fetchPermissions = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const permissionsDoc = await Permission.find({
      project: projectId,
      user: userId,
    });
    res.status(200).json(permissionsDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
