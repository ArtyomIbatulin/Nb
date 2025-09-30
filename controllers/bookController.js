const { default: prisma } = require("../prisma/prisma-client");
const db = require("../models");
const Book = db.Book;
const Author = db.Author;
const Category = db.Category;
const Rating = db.Rating;
const Comment = db.Comment;
const uuid = require("uuid");
const path = require("path");

const createBook = async (req, res) => {
  const { name, price, description } = req.body; // + author, category, etc
  const { imgUrl } = req.files;

  if (!name || !price || !description || !imgUrl) {
    return res.status(400).json({ error: "Нужно заполнить все поля" });
  }

  let fileName = uuid.v4() + ".jpg";
  imgUrl.mv(path.resolve(__dirname, "..", "uploads", fileName));

  try {
    const book = await prisma.book.create({
      data: {
        name,
        price,
        description,
        imgUrl: fileName,
      },
    });

    return res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findAllBooks = async (req, res) => {
  // let { AuthorId, CategoryId, page, limit } = req.query;
  // page = page || 1;
  // limit = limit || 4;
  // let offset = page * limit - limit;

  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
        category: true,
        comment: true,
        rating: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        comment: true,
        rating: true,
      },
    });

    if (!book) {
      res.status(404).json({ error: "Книга с этим id не найдена" });
    }

    return res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const putBookById = async (req, res) => {
  const id = req.params.id;
  const { name, price, description, img } = req.body;

  try {
    const bookId = await Book.findOne({ where: { id } });
    if (!bookId) {
      return res.json({ error: "Книга с этим id не найдена" });
    }

    await Book.update(
      {
        name,
        price,
        description,
        img,
      },
      { where: { id } }
    );

    return res.json({ message: "Книга изменена" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteBook = async (req, res) => {
  // вместе с книгой удалять ее лайки, комменты и все, что с ней связано
  const id = req.params.id;

  try {
    const bookId = await Book.findOne({ where: { id } });
    if (!bookId) {
      return res.json({ error: "Книга с этим id не найдена" });
    }

    await Book.destroy({ where: { id } });

    return res.json({ message: "Книга успешно удалена" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createBook,
  deleteBook,
  findAllBooks,
  findBookById,
  putBookById,
};
