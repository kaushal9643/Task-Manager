import Project from "../models/Project.js";
import User from "../models/User.js";
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      createdBy: req.user.id,
      members: []
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
};


export const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    // avoid duplicates
    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
    }

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error adding member" });
  }
}
export const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "ADMIN") {
      // Admin sees all
      projects = await Project.find()
        .populate("members", "name email")
        .populate("createdBy", "name email");
    } else {
      // Member sees only assigned projects
      projects = await Project.find({
        members: req.user.id
      })
        .populate("members", "name email")
        .populate("createdBy", "name email");
    }

    res.json(projects);
  } catch (error) {
    console.error("GET PROJECT ERROR:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};