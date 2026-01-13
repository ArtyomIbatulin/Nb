const { default: prisma } = require("../prisma/prisma-client");

const createPost = async (req, res) => {
  const { content } = req.body;
  const authorId = req.user.userId;

  if (!content) {
    res.status(400).json({ error: "Не должно быть пустым" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
    });

    return res.status(201).json(post, { message: "Пост создан" });
  } catch (error) {
    console.log(error, "error: createPost");
    return res.status(500).json(error);
  }
};

const getAllPosts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await prisma.post.findMany({
      include: {
        likes: true,
        author: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const postWithLikeInfo = posts.map((post) => ({
      ...post,
      likedByUser: post.likes.some((like) => like.userId === userId),
    }));

    return res.json(postWithLikeInfo);
  } catch (error) {
    console.log(error, "error: getAllPosts");
    return res.status(500).json(error);
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
        author: true,
      },
    });

    if (!post) {
      res.status(404).json({ error: "Пост не найден" });
    }

    const postWithLikeInfo = {
      ...post,
      likedByUser: post.likes.some((like) => like.userId === userId),
    };

    return res.json(postWithLikeInfo);
  } catch (error) {
    console.log(error, "error: getPostById");
    return res.status(500).json(error);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    res.status(404).json({ error: "Пост не найден" });
  }

  if (post.authorId !== req.userId) {
    res.status(403).json({ error: "Нет доступа" });
  }

  try {
    const transaction = await prisma.$transaction([
      prisma.comment.deleteMany({ where: { postId: id } }),
      prisma.like.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } }),
    ]);

    return res.json(transaction);
  } catch (error) {
    console.log(error, "error: deletePost");
    return res.status(500).json(error);
  }
};

module.exports = { createPost, getAllPosts, deletePost, getPostById };
