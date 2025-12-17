/**
 * 认证相关工具函数
 */

/**
 * 生成密码哈希
 * @param {string} password - 原始密码
 * @returns {Promise<string>} 哈希后的密码
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 生成JWT令牌
 * @param {number} userId - 用户ID
 * @param {string} username - 用户名
 * @param {string} secret - JWT密钥
 * @returns {Promise<string>} JWT令牌
 */
export async function generateJWT(userId, username, secret) {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: userId,
    username: username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24小时过期
  };

  const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signatureInput = `${encode(header)}.${encode(payload)}`;

  // 使用环境变量中的密钥生成签名
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${signatureInput}.${signatureBase64}`;
}

/**
 * 验证JWT令牌
 * @param {string} token - JWT令牌
 * @param {string} secret - JWT密钥
 * @returns {Promise<object|null>} 解码后的令牌 payload 或 null
 */
export async function verifyJWT(token, secret) {
  try {
    const [headerBase64, payloadBase64, signatureBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    
    // 检查过期时间
    if (payload.exp < Date.now() / 1000) {
      return null;
    }

    // 验证签名
    const encoder = new TextEncoder();
    const header = { alg: 'HS256', typ: 'JWT' };
    const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signatureInput = `${encode(header)}.${encode(payload)}`;
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      encoder.encode(signatureInput)
    );
    
    if (!isValid) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * 从Authorization头中提取令牌
 * @param {Request} request - HTTP请求对象
 * @returns {string|null} 提取的令牌或null
 */
export function extractTokenFromRequest(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}