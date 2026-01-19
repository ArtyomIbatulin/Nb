// const { default: prisma } = require("../prisma/prisma-client");
// const prisma = require("../prisma/prisma-client");
// const db = require("../models");
// const Book = db.Book;
// const Author = db.Author;
// const Category = db.Category;
// const Rating = db.Rating;
// const Comment = db.Comment;
// const uuid = require("uuid");
// const path = require("path");

// const createBook = async (req, res) => {
//   const { name, price, description } = req.body; // + author, category, rating
//   const { imgUrl } = req.files;

//   if (!name || !price || !description || !imgUrl) {
//     return res.status(400).json({ error: "Нужно заполнить все поля" });
//   }

//   let fileName = uuid.v4() + ".jpg";
//   imgUrl.mv(path.resolve(__dirname, "..", "uploads", fileName));

//   try {
//     const book = await prisma.book.create({
//       data: {
//         name,
//         price,
//         description,
//         imgUrl: fileName,
//       },
//     });

//     return res.status(201).json(book);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// const findAllBooks = async (req, res) => {
//   // let { AuthorId, CategoryId, page, limit } = req.query;
//   // page = page || 1;
//   // limit = limit || 4;
//   // let offset = page * limit - limit;

//   try {
//     const books = await prisma.book.findMany({
//       include: {
//         author: true,
//         category: true,
//         comment: true,
//         rating: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return res.json(books);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// const findBookById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const book = await prisma.book.findUnique({
//       where: { id },
//       include: {
//         author: true,
//         category: true,
//         comment: true,
//         rating: true,
//       },
//     });

//     if (!book) {
//       res.status(404).json({ error: "Книга с этим id не найдена" });
//     }

//     return res.json(book);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// const editBookById = async (req, res) => {
//   const { id } = req.params;
//   const { name, price, description, img } = req.body; // comments, etc

//   try {
//     const book = await prisma.book.update({
//       where: { id },
//       data: {
//         name,
//         price,
//         description,
//         img, // change new path ?
//       },
//     });

//     if (!book) {
//       return res.status(404).json({ error: "Книга с этим id не найдена" });
//     }

//     return res.json(book, { message: "Книга изменена" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// const deleteBook = async (req, res) => {
//   // вместе с книгой удалять ее лайки, комменты и все, что с ней связано - $transaction
//   const { id } = req.params;

//   try {
//     const book = await prisma.book.findUnique({ where: { id } });

//     if (!book) {
//       return res.json({ error: "Книга с этим id не найдена" });
//     }

//     const deletedBook = await prisma.$transaction([
//       prisma.comment.deleteMany({ where: { bookId: id } }),
//       prisma.rating.deleteMany({ where: { bookId: id } }),
//       prisma.book.delete({ where: { id } }),
//       // author, category ?
//     ]);

//     return res.json(deletedBook, { message: "Книга успешно удалена" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// module.exports = {
//   createBook,
//   deleteBook,
//   findAllBooks,
//   findBookById,
//   editBookById,
// };
