const db = require("../models");
// может не задеплоиться из-за bcrypt, тогда bcryptjs
const bcrypt = require("bcrypt");
const Jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");
const { generateToken } = require("../utils/token");

const registration = async (req, res) => {
  const { login, password, role, name } = req.body;

  try {
    if (!login || !password || !name) {
      return res.status(400).json({ error: "Нужно ввести поля" });
    }

    const candidate = await db.User.findOne({ where: { login } });

    if (candidate) {
      return res.status(400).json({ error: "Такой логин уже существует" });
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const png = Jdenticon.toPng(name, 200);
    const avatarName = `${name}_${Date.now()}.png`;
    const avatarPath = path.join(__dirname, "../uploads", avatarName);
    fs.writeFileSync(avatarPath, png);

    const user = await db.User.create({
      login,
      password: hashPassword,
      role,
      name,
      avatarUrl: `/uploads/${avatarPath}`,
    });

    const basket = await db.Basket.create({ userId: user.id });
    const wishlist = await db.Wishlist.create({ userId: user.id });

    const token = generateToken(user.id, user.role);

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const userId = await db.User.findOne({ where: { id } });
    if (!userId) {
      return res.json({ error: "Пользователь  с этим id не найден" });
    }

    // Если не хотят удаляться, попробовать soft delete
    await db.User.destroy({ where: { id } });
    // await db.Basket.destroy({ where: { id } });
    // await db.Wishlist.destroy({ where: { id } });

    return res.json({ message: "Пользователь успешно удален" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const login = async (req, res) => {
  const { login, password } = req.body;

  try {
    if (!login || !password) {
      return res.status(400).json({ error: "Нужно ввести поля" });
    }

    const user = await db.User.findOne({ where: { login } });
    if (!user) {
      return res.status(404).json({ error: "Неверный логин и/или пароль" });
    }

    // token, utils token & error/message 2:02
    // userSlice types

    let comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ error: "Неверный логин и/или пароль" });
    }
    const token = generateToken(user.id, user.role);

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const check = async (req, res) => {
  const token = generateToken(req.user.id, req.user.role);
  return res.json({ token });
};

const getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      include: [db.Comment, db.Rating, db.Basket, db.Wishlist],
    });

    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.User.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const editUser = async (req, res) => {
  const id = req.params.id;
  const { login } = req.body;

  try {
    const user = await db.User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const existingLogin = await db.User.findOne({ where: { login } });

    if (existingLogin && user.id !== id) {
      return res.status(400).json({ error: "Такой логин уже занят" });
    }

    await db.User.update(
      {
        login: login || undefined,
      },
      { where: { id } }
    );

    return res.json({ message: "Пользователь изменен" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.user.id },
    });
    // +include

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  registration,
  login,
  check,
  getUsers,
  getUserById,
  editUser,
  currentUser,
  deleteUser,
};
