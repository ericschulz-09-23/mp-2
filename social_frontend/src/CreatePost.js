import React, { useState } from "react";
import axios from 'axios';

function CreatePost() {
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        file: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleFileChange = (e) => {
        setNewPost({ ...newPost, fiel: e.target.files[0] });
    };

    const handlePOstSubmit = () => {
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('content', newPost.content);
        formData.append('file', newPost.file);

        axios
            .post('http://localhost:5000/api/posts', formData)
            .then((response) => {
                setNewPost({ title: "", content: "", file: null });
            })
            .catch((error) => console.error('Error creatingpost:', error))
    };

    return (
        <div className="create-post">
            <h2>Create a post</h2>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={newPost.title}
                onChange={handleInputChange}
            />
            <textarea
                name="content"
                placeholder="Content"
                value={newPost.content}
                onChange={handleInputChange}
            />
            <input
                type="file"
                name="file"
                onChange={handleFileChange}
            />
            <button onClick={handlePOstSubmit}>Post</button>
        </div>
    );
}

export default CreatePost;