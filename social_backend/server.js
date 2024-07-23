const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, this.filename + '-' + Date.now() + path.extname)
    }
});

const upload = multer({ storage: storage });

mongoose.connect("mongodb://localhost:27017/social", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    sile: String,
    likes: { type: Number, default: 0 },
    comments: [{ text: String }],
});

const Post = mongoose.model('Post', postSchema);

app.use(bodyParser.json());

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/posts', upload.single('file', async (req, res) => {
    try {
        const { title, content } = req.body;
        const file = req.file ? req.file.name : underfined;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required fields' });
        };

        const post = new Post({ title, content, file });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).jso({ error: 'Internal Server Error' });
    }
}
)
);

app.post('/api/posts/like/:postId', async(req, res) => {
    try { 
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ error : 'Post not found'});
        }
        post.likes += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.post('/api/posts/comment/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const {text} = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        post.comments.push({text});
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error adding comment', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});