import { Router } from "express";
import { aggregateNotesWithUser, createNote, deleteAllNotesForUser, deleteNote, geNoteByContent, getNoteById, getNotesWithUserDetails, paginateSortedNotes, replaceNote, updateNote, updateTitleOfAllNotes } from "./note.service.js";
import authentication from '../../midddleware/authentication.js';

const noteRouter = Router();
noteRouter.post("/", authentication, createNote);
noteRouter.patch("/all", authentication, updateTitleOfAllNotes);
noteRouter.patch("/:id", authentication, updateNote);
noteRouter.put("/replace/:id", authentication, replaceNote);
noteRouter.delete("/:id", authentication, deleteNote);
noteRouter.get("/paginate-sort", authentication, paginateSortedNotes);
noteRouter.get("/note-by-content", authentication, geNoteByContent);
noteRouter.get("/note-with-user", authentication, getNotesWithUserDetails)
noteRouter.get("/aggregate", authentication, aggregateNotesWithUser)
noteRouter.get("/:id", authentication, getNoteById);
noteRouter.delete("/", authentication, deleteAllNotesForUser);

export default noteRouter;