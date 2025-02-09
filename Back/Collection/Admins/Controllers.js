const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if user already exists
        const isUserExist = await Schema.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (without password hashing)
        const newAdmin = new Schema({ email, password, role });
        await newAdmin.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Read = async (req, res) => {
    try {
        const users = await Schema.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await Schema.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user
        await Schema.findByIdAndDelete(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for empty fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user exists
        const isUserExist = await Schema.findOne({ email });
        if (!isUserExist) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare password (without bcrypt)
        if (password !== isUserExist.password) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password' });
        }

        // Send successful response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: isUserExist._id,
                email: isUserExist.email,
                role: isUserExist.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { Create, Read, Delete, Login };
