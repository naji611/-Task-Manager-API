const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    permissions: {
      type: [String],
      enum: ["view", "edit", "delete", "assign_tasks", "create_tasks"], // Define specific permissions
      default: ["view"], // Default to view-only access
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", PermissionSchema);
