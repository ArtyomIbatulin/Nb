const db = require("../models");
const Book = db.Book;
const Author = db.Author;
const Category = db.Category;
const Rating = db.Rating;
const Comment = db.Comment;
// const Op = db.Sequelize.Op;
const uuid = require("uuid");
const path = require("path");

// const getPagination = (page, size) => {
//   const limit = size ? +size : 3;
//   const offset = page ? page * limit : 0;

//   return { limit, offset };
// };

// const getPagingData = (data, page, limit) => {
//   const { count: totalItems, rows: books } = data;
//   const currentPage = page ? +page : 0;
//   const totalPages = Math.ceil(totalItems / limit);

//   return { totalItems, books, totalPages, currentPage };
// };

// const pagBookfindAll = (req, res) => {
//   const { page, size, title } = req.query;
//   let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

//   const { limit, offset } = getPagination(page, size);

//   Book.findAndCountAll({
//     where: condition,
//     limit,
//     offset,
//     include: [db.Author, db.Category, db.Rating],
//     order: ["id"],
//   })
//     .then((data) => {
//       const response = getPagingData(data, page, limit);
//       res.json(response);
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message || "Some error occurred while retrieving books.",
//       });
//     });
// };

// find all published Book
// exports.findAllPublished = (req, res) => {
//   const { page, size } = req.query;
//   const { limit, offset } = getPagination(page, size);

//   Book.findAndCountAll({ where: { published: true }, limit, offset })
//     .then(data => {
//       const response = getPagingData(data, page, limit);
//       res.send(response);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving books."
//       });
//     });
// };

const createBook = async (req, res) => {
  // сделать
  const { name, price, description } = req.body;
  // const { img } = req.files;
  // let fileName = uuid.v4() + ".jpg";
  // img.mv(path.resolve(__dirname, "..", "static", fileName));

  try {
    const book = await Book.create({
      name,
      price,
      description,
      // img: fileName,
    });

    return res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// return
// const deleteBook = async (req, res) => {
//   // вместе с книгой удалять ее лайки, комменты и все, что с ней связано
//   const id = req.params.id;

//   try {
//     const bookId = await Book.findOne({ where: { id } });
//     if (!bookId) {
//       return res.json({ error: "Книга с этим id не найдена" });
//     }

//     await Book.destroy({ where: { id } });

//     return res.json({ message: "Книга успешно удалена" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

const findBooks = async (req, res) => {
  let { AuthorId, CategoryId, page, limit } = req.query;
  page = page || 1;
  limit = limit || 4;
  let offset = page * limit - limit;
  let books;

  try {
    if (!AuthorId && !CategoryId) {
      console.log("!AuthorId && !CategoryId");
      books = await Book.findAndCountAll({
        include: [Author, Category, Rating, Comment],
        limit,
        offset,
      });
    }

    if (AuthorId && !CategoryId) {
      console.log("AuthorId && !CategoryId");
      books = await Book.findAndCountAll({
        include: [{ model: Author, where: { id: AuthorId } }, Category, Rating],
        limit,
        offset,
      });
    }

    if (!AuthorId && CategoryId) {
      console.log("!AuthorId && CategoryId");
      books = await Book.findAndCountAll({
        include: [
          { model: Category, where: { id: CategoryId } },
          Author,
          Rating,
        ],
        limit,
        offset,
      });
    }

    if (AuthorId && CategoryId) {
      console.log("AuthorId && CategoryId");
      books = await Book.findAndCountAll({
        include: [
          { model: Author, where: { id: AuthorId } },
          { model: Category, where: { id: CategoryId } },
          Rating,
        ],
        limit,
        offset,
      });
    }
    return res.json(books.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findBook = async (req, res) => {
  const id = req.params.id;

  try {
    const bookId = await Book.findOne({ where: { id } });

    if (!bookId) {
      return res.json({ error: "Книга с этим id не найдена" });
    }

    const book = await Book.findOne({
      where: { id },
      include: [Author, Category, Rating, Comment],
    });

    return res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const putBook = async (req, res) => {
  const id = req.params.id;
  const { name, price, description, img } = req.body;

  try {
    const bookId = await Book.findOne({ where: { id } });
    if (!bookId) {
      return res.json({ error: "Книга с этим id не найдена" });
    }

    await Book.update(
      {
        // || undefined
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

module.exports = {
  createBook,
  deleteBook,
  findBooks,
  findBook,
  putBook,
  // pagBookfindAll,
};
