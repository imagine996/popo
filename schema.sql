CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- 存储哈希后的密码
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户配额表
CREATE TABLE user_quota (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  total_credits INTEGER DEFAULT 100, -- 总配额
  used_credits INTEGER DEFAULT 0,     -- 已使用配额
  last_reset DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- AI 生成记录表
CREATE TABLE ai_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  task_type TEXT, -- 'image' 或 'video' 或 'text'
  prompt TEXT,
  result_url TEXT,
  status TEXT, -- 'processing', 'completed', 'failed'
  credits_used INTEGER DEFAULT 1, -- 消耗的配额
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- API 密钥表
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

-- 索引创建语句
-- 用户表索引
CREATE INDEX idx_users_username ON users(username);

-- 用户配额表索引
CREATE UNIQUE INDEX idx_user_quota_user_id ON user_quota(user_id);

-- AI任务表索引
CREATE INDEX idx_ai_tasks_user_id ON ai_tasks(user_id);
CREATE INDEX idx_ai_tasks_created_at ON ai_tasks(created_at);
CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX idx_ai_tasks_id ON ai_tasks(id);

-- API密钥表索引
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- 速率限制表
CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    timestamp INTEGER NOT NULL
);

-- 速率限制表索引
CREATE INDEX idx_rate_limits_ip ON rate_limits(ip);
CREATE INDEX idx_rate_limits_timestamp ON rate_limits(timestamp);