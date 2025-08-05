import express from "express";
import fs from "fs";
import path from "path";
import upload from "../Middlewares/upload.js";
import Ebook from "../models/AddEbook.js";

const router = express.Router();

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// CREATE: Upload new ebook
router.post(
  "/",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, author, subject, class: bookClass } = req.body;

      if (!req.files || !req.files["pdf"]) {
        return res.status(400).json({ error: "PDF file is required." });
      }

      const pdfFile = req.files["pdf"][0];
      const coverImageFile = req.files["coverImage"]?.[0];

      const newEbook = new Ebook({
        title,
        author,
        subject,
        class: bookClass,
        fileSize: formatFileSize(pdfFile.size),
        pdfUrl: `/uploads/${pdfFile.filename}`,
        coverImageUrl: coverImageFile ? `/uploads/${coverImageFile.filename}` : null,
      });

      await newEbook.save();
      res.status(201).json(newEbook);
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach(files => {
          files.forEach(file => {
            fs.unlink(path.join('uploads', file.filename), err => {
              if (err) console.error('Error deleting file:', err);
            });
          });
        });
      }
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
);

// READ: Fetch all ebooks (with optional search & pagination)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { class: { $regex: search, $options: 'i' } },
      ];
    }
    const [ebooks, total] = await Promise.all([
      Ebook.find(query)
        .sort({ uploadDate: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      Ebook.countDocuments(query)
    ]);
    res.json({
      data: ebooks,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ebooks" });
  }
});

// READ: Get single ebook by ID
router.get("/:id", async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ error: "E-book not found" });
    res.json(ebook);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch e-book" });
  }
});

// UPDATE: Update ebook metadata (and optionally files)
router.put(
  "/:id",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, author, subject, class: bookClass } = req.body;
      const ebook = await Ebook.findById(req.params.id);
      if (!ebook) return res.status(404).json({ error: "E-book not found" });

      // Update fields
      if (title) ebook.title = title;
      if (author) ebook.author = author;
      if (subject) ebook.subject = subject;
      if (bookClass) ebook.class = bookClass;

      // Handle new files
      if (req.files && req.files["pdf"]) {
        // Delete old PDF
        if (ebook.pdfUrl) {
          fs.unlink(path.join('uploads', path.basename(ebook.pdfUrl)), err => {
            if (err) console.error('Error deleting old PDF:', err);
          });
        }
        const pdfFile = req.files["pdf"][0];
        ebook.pdfUrl = `/uploads/${pdfFile.filename}`;
        ebook.fileSize = formatFileSize(pdfFile.size);
      }
      if (req.files && req.files["coverImage"]) {
        // Delete old cover image
        if (ebook.coverImageUrl) {
          fs.unlink(path.join('uploads', path.basename(ebook.coverImageUrl)), err => {
            if (err) console.error('Error deleting old cover image:', err);
          });
        }
        const coverImageFile = req.files["coverImage"][0];
        ebook.coverImageUrl = `/uploads/${coverImageFile.filename}`;
      }

      await ebook.save();
      res.json(ebook);
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach(files => {
          files.forEach(file => {
            fs.unlink(path.join('uploads', file.filename), err => {
              if (err) console.error('Error deleting file:', err);
            });
          });
        });
      }
      res.status(500).json({ error: error.message || "Failed to update e-book" });
    }
  }
);

// DELETE: Remove e-book and files
router.delete("/:id", async (req, res) => {
  try {
    const book = await Ebook.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "E-book not found" });

    // Delete associated files
    const deletePromises = [];
    if (book.pdfUrl) {
      deletePromises.push(
        fs.promises.unlink(path.join('uploads', path.basename(book.pdfUrl)))
          .catch(err => console.error('Error deleting PDF:', err))
      );
    }
    if (book.coverImageUrl) {
      deletePromises.push(
        fs.promises.unlink(path.join('uploads', path.basename(book.coverImageUrl)))
          .catch(err => console.error('Error deleting cover image:', err))
      );
    }
    await Promise.all(deletePromises);
    res.json({ message: "E-book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete e-book" });
  }
});

export default router;