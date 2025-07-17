import userModel from "../../DB/models/user.model.js";
import noteModel from "./../../DB/models/note.model.js";

export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
        status: 400,
      });
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    // Create new note
    const newNote = await noteModel.create({
      title,
      content,
      userId: user.id,
    });
    return res.status(201).json({
      message: "Note created successfully",
      status: 201,
      data: newNote,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
        status: 400,
      });
    }
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
        status: 404,
      });
    }
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this note",
        status: 403,
      });
    }
    // Update note
    if (title) {
      note.title = title;
    }
    if (content) {
      note.content = content;
    }
    const updatedNote = await note.save();
    return res.status(200).json({
      message: "Note updated successfully",
      status: 200,
      data: updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const replaceNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, userId } = req.body;
    if (!title || !content || !userId) {
      return res.status(400).json({
        message: "Title, content and userId are required",
        status: 400,
      });
    }
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
        status: 404,
      });
    }
    if (userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to replace this note",
        status: 403,
      });
    }
    // Replace note
    note.title = title;
    note.content = content;
    const updatedNote = await note.save();
    return res.status(200).json({
      message: "Note replaced successfully",
      status: 200,
      data: updatedNote,
    });
  } catch (error) {
    console.error("Error replacing note:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const updateTitleOfAllNotes = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        message: "New title is required",
        status: 400,
      });
    }
    const notes = await noteModel.updateMany(
      { userId: req.user.id },
      { $set: { title: title } }
    );
    return res.status(200).json({
      message: "All notes updated successfully",
      status: 200,
      data: notes,
    });
  } catch (error) {
    console.error("Error updating notes:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
        status: 404,
      });
    }
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this note",
        status: 403,
      });
    }
    // Delete note
    await noteModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Note deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const paginateSortedNotes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const notes = await noteModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalNotes = await noteModel.countDocuments({ userId: req.user.id });
    return res.status(200).json({
      message: "Notes retrieved successfully",
      status: 200,
      data: {
        notes,
        totalPages: Math.ceil(totalNotes / limit),
        currentPage: page,
        totalNotes,
      },
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
        status: 404,
      });
    }
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to view this note",
        status: 403,
      });
    }
    return res.status(200).json({
      message: "Note retrieved successfully",
      status: 200,
      data: note,
    });
  } catch (error) {
    console.error("Error retrieving note:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const geNoteByContent = async (req, res, next) => {
  try {
    const { content } = req.query;
    if (!content) {
      return res.status(400).json({
        message: "Content query parameter is required",
        status: 400,
      });
    }
    const notes = await noteModel.find({
      userId: req.user.id,
      content: { $regex: content, $options: "i" },
    });
    if (notes.length === 0) {
      return res.status(404).json({
        message: "No notes found with the specified content",
        status: 404,
      });
    }
    return res.status(200).json({
      message: "Notes retrieved successfully",
      status: 200,
      data: notes,
    });
  } catch (error) {
    console.error("Error retrieving notes by content:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const getNotesWithUserDetails = async (req, res, next) => {
  try {
    const notes = await noteModel
      .find({ userId: req.user.id })
      .select("title userId createdAt")
      .populate({
        path: "userId",
        select: "email",
      });
    if (notes.length === 0) {
      return res.status(404).json({
        message: "No notes found for this user",
        status: 404,
      });
    }
    return res.status(200).json({
      message: "Notes with user details retrieved successfully",
      status: 200,
      data: notes,
    });
  } catch (error) {
    console.error("Error retrieving notes with user details:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const aggregateNotesWithUser = async (req, res, next) => {
  try {
    const { title } = req.query;
    const userId = req.user.id;
    const matchStage = {
      userId,
    };
    if (title) {
      matchStage.title = { $regex: title, $options: "i" };
    }
    const notes = await noteModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users", 
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          title: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]); 
    return res.status(200).json({
      message: "Notes with user details retrieved successfully",
      status: 200,
      data: notes,
    });
  } catch (error) {
    console.error("Error aggregating notes with user details:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const deleteAllNotesForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await noteModel.deleteMany({ userId });
        if (result.deletedCount === 0) {
        return res.status(404).json({
            message: "No notes found for this user",
            status: 404,
        });
        }
        return res.status(200).json({
        message: "All notes deleted successfully",
        status: 200,
        data: { deletedCount: result.deletedCount },
        });
    } catch (error) {
        console.error("Error deleting all notes for user:", error);
        return res.status(500).json({
        message: "Internal server error",
        status: 500,
        });
    }
}