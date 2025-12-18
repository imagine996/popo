-- 简化版数据库表结构，可直接在Cloudflare Dashboard中执行

-- 用户表
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户配额表
CREATE TABLE user_quota (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  total_credits INTEGER DEFAULT 100,
  used_credits INTEGER DEFAULT 0,
  last_reset DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- AI生成记录表
CREATE TABLE ai_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  task_type TEXT,
  prompt TEXT,
  result_url TEXT,
  status TEXT,
  credits_used INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- API密钥表
CREATE TABLE api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used DATETIME,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 速率限制表
CREATE TABLE rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);