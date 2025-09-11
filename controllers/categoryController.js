const db = require("../models");

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const category = await db.Category.create({
      name,
    });

    return res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const changeCategory = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    const genreId = await db.Category.findOne({ where: { id } });
    if (!genreId) {
      return res.json({ error: "Категория с этим id не найдена" });
    }

    await db.Category.update(
      {
        name,
      },
      { where: { id } }
    );

    return res.json({ message: "Категория изменена" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const genreId = await db.Category.findOne({ where: { id } });
    if (!genreId) {
      return res.json({ error: "Категория с этим id не найдена" });
    }

    await db.Category.destroy({ where: { id } });

    return res.json({ message: "Категория успешно удалена" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findCategory = async (req, res) => {
  try {
    const category = await db.Category.findAll({
      include: {
        model: db.Book,
        attributes: ["name"],
      },
    });

    return res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findOneCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const categoryId = await db.Category.findOne({
      where: { id },
    });

    if (!categoryId) {
      return res.json({ error: "Категория с этим id не найдена" });
    }

    const category = await db.Category.findOne({
      where: { id },
      include: db.Book,
    });

    return res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createCategory,
  changeCategory,
  deleteCategory,
  findCategory,
  findOneCategory,
};
