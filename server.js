const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost/1millionig', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Profile Schema
const profileSchema = new mongoose.Schema({
    name: String,
    photo: String,
    username: String,
});

// Create Profile Model
const Profile = mongoose.model('Profile', profileSchema);

// API to get profiles based on search query
app.get('/api/profiles', async (req, res) => {
    const query = req.query.search || '';
    
    try {
        const profiles = await Profile.find({ name: new RegExp(query, 'i') }); // Case-insensitive search
        res.json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching profiles');
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
