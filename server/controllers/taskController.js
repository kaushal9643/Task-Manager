import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, project, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      project,
      assignedTo,
      dueDate
    });

    const proj = await Project.findById(project);

    if (!proj.members.includes(assignedTo)) {
      proj.members.push(assignedTo);
      await proj.save();
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "ADMIN") {
      tasks = await Task.find({ project: req.params.projectId })
        .populate("assignedTo", "name");
    } else {
      tasks = await Task.find({
        project: req.params.projectId,
        assignedTo: req.user.id
      }).populate("assignedTo", "name");
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    task.status = req.body.status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task" });
  }
};