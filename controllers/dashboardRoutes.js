const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Display all posts on the dashboard
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', { posts, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Render the new post form
router.get('/newPost', withAuth, async (req, res) => {
  try {
    res.render('newPost', { logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new post
router.post('/posts/new', withAuth, async (req, res) => {
  try {
    const newPostData = await Post.create({
      title: req.body.title,
      body: req.body.content,
      userId: req.session.user_id,
    });

    res.redirect('/dashboard');
  } catch (err) {
    res.status(400).json(err);
  }
});

// Display a specific post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('singlePost', {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;