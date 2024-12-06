const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    permissions: {
      type: [String],
      enum: [
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
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", PermissionSchema);
