const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database with initial demo data
const database = {
  users: [
    {
      id: 'usr_001',
      username: 'ruby_dev',
      fullName: 'Ruby Nguyen',
      email: 'ruby@example.com',
      password: 'password123',
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'Editor',
      createdAt: '2014-09-22T08:00:00Z'
    },
    {
      id: 'usr_002',
      username: 'david_dev',
      fullName: 'David Tran',
      email: 'david@example.com',
      password: 'password123',
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'Reviewer',
      createdAt: '2014-09-22T08:30:00Z'
    }
  ],
  posts: [],
  comments: []
};

// ==========================================
// AUTHENTICATION APIs
// ==========================================

// 1. REGISTER API (Issue #1: Allow register by email or via facebook, linkedin)
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, provider, providerId } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email là bắt buộc.' });
  }

  const existingUser = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email này đã được sử dụng.' });
  }

  const regProvider = provider || 'email';
  if (regProvider === 'email' && (!password || password.length < 6)) {
    return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    username: email.split('@')[0],
    fullName: fullName || email.split('@')[0],
    email: email.toLowerCase(),
    password: password || 'oauth_social_login',
    provider: regProvider, // 'email' | 'facebook' | 'linkedin'
    providerId: providerId || null,
    avatar: regProvider === 'facebook' 
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' 
      : regProvider === 'linkedin'
      ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Member',
    createdAt: new Date().toISOString()
  };

  database.users.push(newUser);

  // Return user info (excluding password)
  const { password: _, ...userSafe } = newUser;
  return res.status(201).json({
    success: true,
    message: `Đăng ký thành công qua ${regProvider.toUpperCase()}!`,
    user: userSafe,
    token: `jwt_token_${newUser.id}_${Date.now()}`
  });
});

// Root fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[StoryReader Blog] Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
