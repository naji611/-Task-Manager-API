const Permission = require("../models/permission"); // Assuming you have this path
const User = require("../models/user");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      console.log(req.user);
      const userId = req.user.userId; // Assuming user ID is set in `req.user` (via auth middleware)
      const projectId = req.params.projectId || req.body.projectId; // Assuming the projectId is passed in the URL or body
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "manager") {
        // Admins have full access, no need for additional permission checks
        return next();
      }
      // Find the permission document for the user and project
      const permission = await Permission.findOne({
        user: userId,
        project: projectId,
      });

      if (!permission) {
        return res
          .status(403)
          .json({ message: "No permission for this Action" });
      }

      // Check if the user has the required permission
      if (!permission.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: `You do not have ${requiredPermission} permission`,
        });
      }

      // If everything is fine, proceed to the next middleware/route handler
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
};

module.exports = checkPermission;
