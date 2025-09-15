const db = require("../models");

const createAuthor = async (req, res) => {
  const { name } = req.body;

  try {
    const author = await db.Author.create({
      name,
    });

    return res.status(201).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteAuthor = async (req, res) => {
  const id = req.params.id;

  try {
    const authorId = await db.Author.findOne({ where: { id } });
    if (!authorId) {
      return res.json({ error: "Автор с этим id не найден" });
    }

    await db.Author.destroy({ where: { id } });

    return res.json({ message: "Автор успешно удален" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findAuthors = async (req, res) => {
  try {
    const authors = await db.Author.findAll({
      // attributes: { exclude: ['category'] },
      include: [db.Book],
    });

    return res.json(authors);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findAuthor = async (req, res) => {
  const id = req.params.id;

  try {
    const authorId = await db.Author.findOne({ where: { id } });

    if (!authorId) {
      return res.json({ error: "Автор с этим id не найден" });
    }

    const author = await db.Author.findOne({ where: { id } });

    return res.json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const putAuthor = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    const authorId = await db.Author.findOne({ where: { id } });
    if (!authorId) {
      return res.json({ error: "Автор с этим id не найден" });
    }

    await db.Author.update(
      {
        name: name || undefined,
      },
      { where: { id } }
    );

    return res.json({ message: "Автор изменен" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createAuthor,
  deleteAuthor,
  findAuthors,
  findAuthor,
  putAuthor,
};
