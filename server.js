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
  posts: [
    {
      id: 'post_001',
      title: 'Đánh giá siêu phẩm Solo Leveling: Tôi Thăng Cấp Một Mình',
      summary: 'Phân tích chi tiết hành trình từ thợ săn hạng E yếu ớt trở thành Hoàng đế Bóng tối bất khả chiến bại của Sung Jin-Woo.',
      content: `Solo Leveling (Na Honjamanman Rebeur-eop) là một trong những webtoon hành động đình đám nhất châu Á trong thập kỷ qua. 
Tác phẩm lấy bối cảnh khi các cánh cổng kết nối thế giới thực với hầm ngục chứa quái vật xuất hiện. Nhân vật chính Sung Jin-Woo thức tỉnh hệ thống độc nhất vô nhị chỉ riêng mình anh có thể nhìn thấy và tăng chỉ số.

Điểm sáng của tác phẩm:
1. Đồ họa đỉnh cao do Redice Studio thực hiện với nét vẽ sắc nét, phân cảnh chiến đấu mãn nhãn.
2. Tiết tấu dồn dập, logic tăng cấp rõ ràng, tạo sự lôi cuốn mãnh liệt.
3. Đội quân bóng tối (Shadow Soldiers) trung thành với các tướng lĩnh cá tính như Igris, Beru.

Đánh giá tổng quan: 9.5/10 - Bộ truyện tranh nhất định phải đọc của mọi tín đồ Manhwa!`,
      category: 'Manhwa',
      tags: ['Solo Leveling', 'Action', 'Hầm Ngục', 'Review'],
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      author: {
        id: 'usr_001',
        fullName: 'Ruby Nguyen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'Editor'
      },
      views: 1240,
      createdAt: '2014-09-23T10:00:00Z'
    },
    {
      id: 'post_002',
      title: 'Giới thiệu Hệ Thống Quản Lý Đọc Truyện StoryReader',
      summary: 'Tổng quan kiến trúc nền tảng đọc truyện trực tuyến: Bảo vệ bản quyền chữ số SkiaSharp, tích hợp thanh toán gói VIP và độc quyền đọc thử.',
      content: `Hệ thống StoryReader là dự án phần mềm chuyên nghiệp phục vụ nhu cầu đọc truyện chữ và truyện tranh đa nền tảng.
Hệ thống giải quyết triệt để các vấn đề nhức nhối của các trang đọc truyện truyền thống:
- Cơ chế bảo vệ bản quyền Text-to-Image Watermarking SkiaSharp chống sao chép tự động (crawler/scraping bot).
- Phân quyền đọc linh hoạt: Đọc miễn phí, Gói tháng không giới hạn (VIP Subscription), và Mua lẻ truyện (Pay-per-story).
- Tích hợp cổng thanh toán trực tuyến bảo mật, lưu vết giao dịch minh bạch.
- Cộng đồng thảo luận, bình luận và đánh giá chương truyện tương tác cao.`,
      category: 'Công nghệ',
      tags: ['StoryReader', 'Architecture', '.NET 8', 'React'],
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      author: {
        id: 'usr_002',
        fullName: 'David Tran',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'Reviewer'
      },
      views: 890,
      createdAt: '2014-09-24T14:20:00Z'
    }
  ],
  comments: [
    {
      id: 'cmt_001',
      postId: 'post_001',
      author: {
        id: 'usr_002',
        fullName: 'David Tran',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'Reviewer'
      },
      content: 'Bài viết phân tích rất chuẩn xác! Đặc biệt là các trận chiến trên đảo Jeju của tướng Beru và Sung Jin-Woo quả thực là đỉnh cao đồ họa.',
      likes: 12,
      createdAt: '2014-09-23T11:15:00Z'
    },
    {
      id: 'cmt_002',
      postId: 'post_001',
      author: {
        id: 'usr_001',
        fullName: 'Ruby Nguyen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'Editor'
      },
      content: 'Cảm ơn David! Mình dự kiến sẽ viết thêm bài phân tích các đại tướng bóng tối trong phần tiếp theo của Sprint.',
      likes: 8,
      createdAt: '2014-09-23T11:45:00Z'
    }
  ]
};

// ==========================================
// AUTHENTICATION APIs
// ==========================================

// 1. REGISTER API (Issue #1: Allow user register by email or via facebook, linkedin)
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, provider, providerId } = req.body;

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
    provider: regProvider,
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

  const { password: _, ...userSafe } = newUser;
  return res.status(201).json({
    success: true,
    message: `Đăng ký thành công qua ${regProvider.toUpperCase()}!`,
    user: userSafe,
    token: `jwt_token_${newUser.id}_${Date.now()}`
  });
});

// 2. LOGIN API (Issue #2: Allow user login with email, username and password)
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tài khoản/email và mật khẩu.' });
  }

  const cleanIdent = identifier.trim().toLowerCase();
  const user = database.users.find(u => 
    u.email.toLowerCase() === cleanIdent || 
    u.username.toLowerCase() === cleanIdent
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác.' });
  }

  const { password: _, ...userSafe } = user;
  const token = `jwt_token_${user.id}_${Date.now()}`;

  return res.status(200).json({
    success: true,
    message: `Đăng nhập thành công! Chào mừng ${user.fullName}.`,
    user: userSafe,
    token,
    rememberMe: !!rememberMe
  });
});

// ==========================================
// POST / BLOG MANAGEMENT APIs (Issue #3)
// ==========================================

// GET all posts
app.get('/api/posts', (req, res) => {
  const { category, search } = req.query;
  let results = [...database.posts];

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(p => 
      p.title.toLowerCase().includes(s) || 
      p.summary.toLowerCase().includes(s)
    );
  }

  // Count comments for each post
  const postsWithCommentCount = results.map(post => {
    const count = database.comments.filter(c => c.postId === post.id).length;
    return { ...post, commentCount: count };
  });

  return res.json({ success: true, posts: postsWithCommentCount });
});

// GET post detail
app.get('/api/posts/:id', (req, res) => {
  const post = database.posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
  }
  post.views = (post.views || 0) + 1;
  const postComments = database.comments.filter(c => c.postId === post.id);
  return res.json({ success: true, post, comments: postComments });
});

// CREATE post API (Issue #3: Create post function)
app.post('/api/posts', (req, res) => {
  const { title, summary, content, category, tags, cover, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung bài viết là bắt buộc.' });
  }

  const newPost = {
    id: 'post_' + Date.now(),
    title: title.trim(),
    summary: summary ? summary.trim() : title.trim().substring(0, 120) + '...',
    content: content.trim(),
    category: category || 'Review Truyện',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['StoryReader']),
    cover: cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    author: author || {
      id: 'usr_guest',
      fullName: 'Tác giả Ẩn Danh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Member'
    },
    views: 1,
    createdAt: new Date().toISOString()
  };

  database.posts.unshift(newPost);

  return res.status(201).json({
    success: true,
    message: 'Đăng bài viết mới thành công!',
    post: newPost
  });
});

// ==========================================
// COMMENTS & DISCUSSION APIs (Issue #4)
// ==========================================

// Add Comment API (Issue #4: Add comment function)
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { content, author } = req.body;

  const post = database.posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Bài viết không tồn tại.' });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống.' });
  }

  const newComment = {
    id: 'cmt_' + Date.now(),
    postId,
    content: content.trim(),
    author: author || {
      id: 'usr_guest',
      fullName: 'Độc giả Ẩn Danh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Member'
    },
    likes: 0,
    createdAt: new Date().toISOString()
  };

  database.comments.push(newComment);

  return res.status(201).json({
    success: true,
    message: 'Thêm bình luận thành công!',
    comment: newComment
  });
});

// Like Comment API
app.post('/api/comments/:id/like', (req, res) => {
  const comment = database.comments.find(c => c.id === req.params.id);
  if (!comment) {
    return res.status(404).json({ success: false, message: 'Bình luận không tồn tại.' });
  }
  comment.likes = (comment.likes || 0) + 1;
  return res.json({ success: true, likes: comment.likes });
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
