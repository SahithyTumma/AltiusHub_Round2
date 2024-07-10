const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const posts = [];

const drafts = [];

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


// List Posts: Endpoint to retrieve all published posts
app.get('/posts', (request, response) => {
    response.send(posts);
});

// Create Post: Endpoint to create a new blog post (title, body, tags).
app.post('/posts', (request, response) => {
    const post = request.body;
    if (posts.length > 0) {
        post["id"] = (posts[posts.length - 1]["id"]) + 1;
    }
    else {
        post["id"] = 0;
    }
    // console.log(id);

    console.log(post);
    posts.push(post);

    response.send(posts);
})


// Edit Post: Endpoint to update existing posts.
app.put('/posts/', (request, response) => {
    // const id = request.params.id;
    const post = request.body;

    const id = post.id;
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        response.status(404).send({ error: 'Post not found' });
        return;

    }

    posts[postIndex] = post;

    response.send(posts);
});

// Delete Post: Endpoint to delete a post.
app.delete('/posts', (request, response) => {
    // const id = request.params.id;
    const id = request.body.id;

    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        response.status(404).send({ error: 'Post not found' });
        return;

    }

    posts.splice(postIndex, 1);

    response.send(posts);
});

// Add post to drafts
app.post('/drafts', (request, response) => {
    const draft = request.body;
    if (drafts.length > 0) {
        draft["id"] = (drafts[drafts.length - 1]["id"]) + 1;
    }
    else {
        draft["id"] = 0;
    }

    console.log(draft);
    drafts.push(draft);

    response.send(drafts);
});


// Edit post in drafts
app.put('/drafts', (request, response) => {
    // const id = request.params.id;
    const draft = request.body;

    const id = draft.id;

    const draftIndex = drafts.findIndex((draft) => draft.id === id);

    if (draftIndex === -1) {
        response.status(404).send({ error: 'Draft not found' });
        return;

    }

    drafts[draftIndex] = draft;

    response.send(drafts);
});


// Delete draft
app.delete('/drafts', (request, response) => {
    const id = request.body.id;

    const draftIndex = drafts.findIndex((draft) => draft.id === id);

    if (draftIndex === -1) {
        response.status(404).send({ error: 'Draft not found' });
        return;

    }

    drafts.splice(draftIndex, 1);

    response.send(drafts);
});


// Get all drafts
app.get('/drafts', (request, response) => {
    response.send(drafts);
});

// Drafts: Endpoint to save posts as drafts.
app.post('/drafts_to_post', (request, response) => {
    // const id = request.params.id;
    const id = request.body.id;

    const draftIndex = drafts.findIndex((draft) => draft.id === id);

    if (draftIndex === -1) {
        response.status(404).send({ error: 'Draft not found' });
        return;
    }
    console.log("draftndex", draftIndex);
    const draft = drafts[draftIndex];
    // const draft = drafts[id];
    console.log(draft);

    drafts["id"] = posts.length

    posts.push(draft);

    drafts.splice(draftIndex, 1);

    response.send({ posts, drafts });
});

// View Post: Endpoint to retrieve a single post by ID.
app.get('/get_post', (request, response) => {
    const id = request.body.id;
    console.log(id);
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        response.status(404).send({ error: 'Post not found' });
        return;
    }

    const post = posts[postIndex];

    response.send(post);
});

// Post Comments: Endpoint to add comments to posts.
app.post('/posts/comments', (request, response) => {
    const id = request.body.id;
    const comment = request.body;

    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        response.status(404).send({ error: 'Post not found' });
        return;
    }

    const post = posts[postIndex];

    if (!post.comments) {
        post.comments = [];
    }

    post.comments.push([comment.name, comment.comment]);

    response.send(post);
});

// get posts with pagination
app.get('/posts/pagination', (request, response) => {
    const page = request.body.page;
    const limit = request.body.limit;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const resultPosts = posts.slice(startIndex, endIndex);

    response.send(resultPosts);
});