const bcrypt = require("bcryptjs");
const Jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");
const { generateToken } = require("../utils/token");
const { default: prisma } = require("../prisma/prisma-client");

const registration = async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Нужно ввести все поля" });
    }

    const candidate = await prisma.user.findUnique({ where: { email } }); //findFirst

    if (candidate) {
      return res.status(400).json({ error: "Такой логин уже существует" });
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const png = Jdenticon.toPng(name, 200);
    const avatarName = `${name}_${Date.now()}.png`;
    const avatarPath = path.join(__dirname, "../uploads", avatarName);
    fs.writeFileSync(avatarPath, png);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        role,
        name,
        avatarUrl: `/uploads/${avatarPath}`,
      },
    });

    // const basket = await db.Basket.create({ userId: user.id });
    // const wishlist = await db.Wishlist.create({ userId: user.id });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Нужно ввести поля" });
    }

    const user = await prisma.user.findUnique({ where: { email } }); //findFirst
    if (!user) {
      return res.status(404).json({ error: "Неверный логин и/или пароль" });
    }

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

const getUserById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const isFollowing = await prisma.follows.findFirst({
      where: {
        AND: [{ followerId: userId }, { followingId: id }],
      },
    });

    return res.json({ ...user, isFollowing: Boolean(isFollowing) });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;

  let filePath;

  if (req.file && req.file.path) {
    filePath = req.file.path;
  }

  if (id !== req.user.userId) {
    return res.status(403).json({ error: "Нет доступа" });
  }

  try {
    if (email) {
      const existingUser = await prisma.user.findFirst({ where: { email } });

      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: "Такая почта уже занята" });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        email: email || undefined,
        name: name || undefined,
        avatarUrl: filePath ? `/${filePath}` : undefined,
      },
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      // include: {
      //   cart: true,
      //   wishlist: true,
      // },
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

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Пользователь  с этим id не найден" });
    }

    const deletedUser = await prisma.$transaction([
      prisma.cart.deleteMany({ where: { userId: id } }),
      prisma.wishlist.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return res.json(deletedUser, { message: "Пользователь успешно удален" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// const getUsers = async (req, res) => {
//   try {
//     const users = await db.User.findAll({
//       include: [db.Comment, db.Rating, db.Basket, db.Wishlist],
//     });

//     return res.json(users);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

module.exports = {
  registration,
  login,
  check,
  getUserById,
  updateUser,
  currentUser,
  deleteUser,
  // getUsers,
};
