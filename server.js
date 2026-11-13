
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'techsphere_db'
};

let db;

const getData = (value) => {
  return typeof value === 'string' ? JSON.parse(value) : value;
};

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message });
};

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'TechSphere Backend is Running!'
  });
});

// GET ALL POSTS
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT data FROM posts');
    res.json(rows.map(row => getData(row.data)));
  } catch (error) {
    handleError(res, error);
  }
});

// CREATE OR UPDATE POST
app.post('/api/posts', async (req, res) => {
  try {
    const post = req.body;

    if (!post.id || !post.slug) {
      return res.status(400).json({
        error: 'Post ID and slug are required'
      });
    }

    await db.execute(
      `INSERT INTO posts (id, slug, status, scheduled_for, views, data)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       slug = VALUES(slug),
       status = VALUES(status),
       scheduled_for = VALUES(scheduled_for),
       views = VALUES(views),
       data = VALUES(data)`,
      [
        post.id,
        post.slug,
        post.status || 'draft',
        post.scheduledFor || null,
        post.views || 0,
        JSON.stringify(post)
      ]
    );

    res.status(200).json(post);
  } catch (error) {
    handleError(res, error);
  }
});

// UPDATE POST
app.put('/api/posts/:id', async (req, res) => {
  try {
    const post = { ...req.body, id: req.params.id };

    const [result] = await db.execute(
      `UPDATE posts
       SET slug = ?, status = ?, scheduled_for = ?, views = ?, data = ?
       WHERE id = ?`,
      [
        post.slug,
        post.status || 'draft',
        post.scheduledFor || null,
        post.views || 0,
        JSON.stringify(post),
        post.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE POST
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM posts WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

// LIKE POST
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT data FROM posts WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = getData(rows[0].data);
    post.likes = (post.likes || 0) + 1;

    await db.execute(
      'UPDATE posts SET data = ? WHERE id = ?',
      [JSON.stringify(post), req.params.id]
    );

    res.json({ likes: post.likes });
  } catch (error) {
    handleError(res, error);
  }
});

// GET CATEGORIES
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT data FROM categories');
    res.json(rows.map(row => getData(row.data)));
  } catch (error) {
    handleError(res, error);
  }
});

// CREATE OR UPDATE CATEGORY
app.post('/api/categories', async (req, res) => {
  try {
    const category = req.body;

    if (!category.id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    await db.execute(
      `INSERT INTO categories (id, slug, data)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       slug = VALUES(slug),
       data = VALUES(data)`,
      [
        category.id,
        category.slug || null,
        JSON.stringify(category)
      ]
    );

    res.json(category);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE CATEGORY
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [
      req.params.id
    ]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

// GET AUTHORS
app.get('/api/authors', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT data FROM authors');
    res.json(rows.map(row => getData(row.data)));
  } catch (error) {
    handleError(res, error);
  }
});

// CREATE OR UPDATE AUTHOR
app.post('/api/authors', async (req, res) => {
  try {
    const author = req.body;

    if (!author.id) {
      return res.status(400).json({ error: 'Author ID is required' });
    }

    await db.execute(
      `INSERT INTO authors (id, data)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [author.id, JSON.stringify(author)]
    );

    res.json(author);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE AUTHOR
app.delete('/api/authors/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM authors WHERE id = ?', [
      req.params.id
    ]);
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});
// INITIAL DATA SEED
app.post('/api/seed', async (req, res) => {
  try {
    const { posts, categories, authors } = req.body;

    for (const author of authors || []) {
      await db.execute(
        `INSERT INTO authors (id, data) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        [author.id, JSON.stringify(author)]
      );
    }

    for (const category of categories || []) {
      await db.execute(
        `INSERT INTO categories (id, slug, data) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE slug = VALUES(slug), data = VALUES(data)`,
        [category.id, category.slug, JSON.stringify(category)]
      );
    }

    for (const post of posts || []) {
      await db.execute(
        `INSERT INTO posts (id, slug, status, scheduled_for, views, data)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         slug = VALUES(slug),
         status = VALUES(status),
         scheduled_for = VALUES(scheduled_for),
         views = VALUES(views),
         data = VALUES(data)`,
        [
          post.id,
          post.slug,
          post.status || 'draft',
          post.scheduledFor || null,
          post.views || 0,
          JSON.stringify(post)
        ]
      );
    }

    res.json({ message: 'Initial data saved successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

// START SERVER
async function startServer() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('MySQL Database Connected Successfully!');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
