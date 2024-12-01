const express = require("express");
const router = express.Router();
//create
router.post("/newEmployee");
router.post("/newProject");
router.post("/createTask");
router.post("/createMilestone");
//update
router.put("/Employee/:id");
router.put("/Project/:id");
router.put("/Task/:id");
router.put("/Milestone/:id");
//delete
router.delete("/Employee/:id");
router.delete("/Project/:id");
router.delete("/Task/:id");
router.delete("/Milestone/:id");
//fetch all data
router.get("/Employees");
router.get("/Projects");
router.get("/Tasks");
router.get("/Milestone");
//fetch single record
router.get("/Employees/:id");
router.get("/Projects/:id");
router.get("/Tasks/:id");
router.get("/Milestones/:id");
//permission
router.put("/assignPermission");
module.exports = router;
