import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
        },
        avatar: {
            type: String,
            default: 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Set default avatar with user's name
userSchema.pre('save', function (next) {
    if (!this.avatar || this.avatar === 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=') {
        this.avatar = `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(this.name)}`;
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
