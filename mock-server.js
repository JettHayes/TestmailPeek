const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Mock email data with various types for testing
const mockEmails = [
  {
    id: 'email-001',
    subject: '欢迎使用 TestMail 服务',
    from: 'welcome@testmail.app',
    to: 'user@example.com',
    date: new Date().toISOString(),
    text: '欢迎使用 TestMail 服务！\n\n这是一封纯文本邮件，用于测试基本的邮件显示功能。\n\n祝您使用愉快！\n\nTestMail 团队',
    html: null,
    attachments: []
  },
  {
    id: 'email-002',
    subject: '您的订单已确认 - 订单号 #12345',
    from: 'orders@shop.example.com',
    to: 'customer@example.com',
    date: new Date(Date.now() - 3600000).toISOString(),
    text: '',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; }
    .order-info { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .total { font-size: 18px; font-weight: bold; color: #4CAF50; }
    .btn { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4CAF50;">订单确认</h1>
      <p>感谢您的购买！</p>
    </div>
    <div class="order-info">
      <p><strong>订单号：</strong>#12345</p>
      <p><strong>下单时间：</strong>${new Date().toLocaleString()}</p>
    </div>
    <h3>订单详情</h3>
    <div class="item"><span>iPhone 15 Pro x 1</span><span>¥8,999.00</span></div>
    <div class="item"><span>AirPods Pro x 1</span><span>¥1,899.00</span></div>
    <div class="item"><span>运费</span><span>免费</span></div>
    <div class="item total"><span>总计</span><span>¥10,898.00</span></div>
    <p style="text-align: center; margin-top: 30px;">
      <a href="https://example.com/orders/12345" class="btn">查看订单</a>
    </p>
  </div>
</body>
</html>`,
    attachments: []
  },
  {
    id: 'email-003',
    subject: '您的验证码是 847291',
    from: 'noreply@auth.example.com',
    to: 'user@example.com',
    date: new Date(Date.now() - 7200000).toISOString(),
    text: '',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f2f5; padding: 40px 20px; }
    .container { max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .code { font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #1a73e8; margin: 30px 0; }
    .warning { color: #666; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>验证码</h2>
    <p>您正在进行身份验证，验证码为：</p>
    <div class="code">847291</div>
    <p>验证码10分钟内有效，请勿泄露给他人。</p>
    <p class="warning">如果这不是您的操作，请忽略此邮件。</p>
  </div>
</body>
</html>`,
    attachments: []
  },
  {
    id: 'email-004',
    subject: '会议邀请：周五项目评审会议',
    from: 'calendar@company.example.com',
    to: 'team@company.example.com',
    date: new Date(Date.now() - 86400000).toISOString(),
    text: '',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; }
    .content { padding: 30px; }
    .info-row { display: flex; align-items: center; margin: 15px 0; }
    .icon { width: 40px; height: 40px; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
    .buttons { display: flex; gap: 10px; margin-top: 30px; }
    .btn { flex: 1; padding: 12px; text-align: center; border-radius: 5px; text-decoration: none; font-weight: bold; }
    .btn-accept { background: #4CAF50; color: white; }
    .btn-decline { background: #f44336; color: white; }
    .btn-maybe { background: #ff9800; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">📅 会议邀请</h1>
      <h2 style="margin: 10px 0 0 0; font-weight: normal;">周五项目评审会议</h2>
    </div>
    <div class="content">
      <div class="info-row">
        <div class="icon">🕐</div>
        <div>
          <strong>时间</strong><br>
          2026年1月10日 周五 14:00 - 16:00
        </div>
      </div>
      <div class="info-row">
        <div class="icon">📍</div>
        <div>
          <strong>地点</strong><br>
          3楼会议室 A 或 Zoom Meeting
        </div>
      </div>
      <div class="info-row">
        <div class="icon">👤</div>
        <div>
          <strong>组织者</strong><br>
          张经理 (manager@company.example.com)
        </div>
      </div>
      <h3>会议议程</h3>
      <ul>
        <li>Q4 项目进度回顾</li>
        <li>技术方案讨论</li>
        <li>下阶段计划安排</li>
      </ul>
      <div class="buttons">
        <a href="#" class="btn btn-accept">接受</a>
        <a href="#" class="btn btn-maybe">待定</a>
        <a href="#" class="btn btn-decline">拒绝</a>
      </div>
    </div>
  </div>
</body>
</html>`,
    attachments: []
  },
  {
    id: 'email-005',
    subject: '项目文档 - Q4 报告及附件',
    from: 'docs@company.example.com',
    to: 'team@company.example.com',
    date: new Date(Date.now() - 172800000).toISOString(),
    text: '您好，\n\n附件是本季度的项目报告文档，请查收。\n\n包含以下文件：\n1. Q4报告.pdf - 季度工作总结\n2. 数据分析.xlsx - 详细数据表格\n3. 项目架构图.png - 系统架构图\n\n如有问题请随时联系。\n\n祝好！',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .attachment-list { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .attachment-item { display: flex; align-items: center; padding: 10px; background: white; margin: 10px 0; border-radius: 5px; border: 1px solid #eee; }
    .file-icon { font-size: 24px; margin-right: 15px; }
    .file-info { flex: 1; }
    .file-size { color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <p>您好，</p>
  <p>附件是本季度的项目报告文档，请查收。</p>
  <div class="attachment-list">
    <h4>📎 附件列表</h4>
    <div class="attachment-item">
      <span class="file-icon">📄</span>
      <div class="file-info">
        <strong>Q4报告.pdf</strong>
        <div class="file-size">季度工作总结 • 2.5 MB</div>
      </div>
    </div>
    <div class="attachment-item">
      <span class="file-icon">📊</span>
      <div class="file-info">
        <strong>数据分析.xlsx</strong>
        <div class="file-size">详细数据表格 • 856 KB</div>
      </div>
    </div>
    <div class="attachment-item">
      <span class="file-icon">🖼️</span>
      <div class="file-info">
        <strong>项目架构图.png</strong>
        <div class="file-size">系统架构图 • 1.2 MB</div>
      </div>
    </div>
  </div>
  <p>如有问题请随时联系。</p>
  <p>祝好！</p>
</body>
</html>`,
    attachments: [
      {
        cid: 'att-001',
        filename: 'Q4报告.pdf',
        size: 2621440,
        downloadUrl: 'https://example.com/download/q4-report.pdf'
      },
      {
        cid: 'att-002',
        filename: '数据分析.xlsx',
        size: 876544,
        downloadUrl: 'https://example.com/download/data-analysis.xlsx'
      },
      {
        cid: 'att-003',
        filename: '项目架构图.png',
        size: 1258291,
        downloadUrl: 'https://example.com/download/architecture.png'
      }
    ]
  },
  {
    id: 'email-006',
    subject: '🎉 恭喜！您已成功注册',
    from: 'hello@startup.example.com',
    to: 'newuser@example.com',
    date: new Date(Date.now() - 259200000).toISOString(),
    text: '',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; text-align: center; }
    .emoji { font-size: 64px; margin-bottom: 20px; }
    .title { color: #333; margin-bottom: 10px; }
    .subtitle { color: #666; margin-bottom: 30px; }
    .features { text-align: left; background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .feature { display: flex; align-items: center; margin: 10px 0; }
    .feature-icon { margin-right: 10px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; margin-top: 20px; }
    .social { margin-top: 30px; }
    .social a { display: inline-block; margin: 0 10px; color: #666; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">🎉</div>
    <h1 class="title">欢迎加入我们！</h1>
    <p class="subtitle">您的账户已成功创建</p>
    <div class="features">
      <div class="feature"><span class="feature-icon">✅</span> 无限存储空间</div>
      <div class="feature"><span class="feature-icon">✅</span> 7x24 客户支持</div>
      <div class="feature"><span class="feature-icon">✅</span> 高级分析功能</div>
      <div class="feature"><span class="feature-icon">✅</span> 团队协作工具</div>
    </div>
    <a href="https://example.com/dashboard" class="btn">开始使用 →</a>
    <div class="social">
      <a href="#">Twitter</a> | <a href="#">Facebook</a> | <a href="#">Instagram</a>
    </div>
  </div>
</body>
</html>`,
    attachments: []
  },
  {
    id: 'email-007',
    subject: '⚠️ 安全警告：检测到异常登录',
    from: 'security@bank.example.com',
    to: 'user@example.com',
    date: new Date(Date.now() - 345600000).toISOString(),
    text: '',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: #d32f2f; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; }
    .alert-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #666; width: 40%; }
    .btn { display: inline-block; background: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
    .btn-secondary { background: #757575; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ 安全警告</h1>
    </div>
    <div class="content">
      <h2>检测到异常登录活动</h2>
      <div class="alert-box">
        <strong>注意：</strong>我们检测到您的账户在新设备上登录。如果不是您本人操作，请立即采取措施。
      </div>
      <h3>登录详情</h3>
      <table class="info-table">
        <tr><td>时间</td><td>2026年1月9日 03:24 AM</td></tr>
        <tr><td>设备</td><td>Windows PC - Chrome 浏览器</td></tr>
        <tr><td>位置</td><td>北京, 中国</td></tr>
        <tr><td>IP 地址</td><td>203.xxx.xxx.123</td></tr>
      </table>
      <p>
        <a href="#" class="btn">这不是我</a>
        <a href="#" class="btn btn-secondary">是我本人</a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        如果这是您本人的操作，可以忽略此邮件。为保护您的账户安全，我们建议您定期更改密码并开启双因素认证。
      </p>
    </div>
  </div>
</body>
</html>`,
    attachments: []
  },
  {
    id: 'email-008',
    subject: '您的月度账单 - 2026年1月',
    from: 'billing@service.example.com',
    to: 'customer@example.com',
    date: new Date(Date.now() - 432000000).toISOString(),
    text: '',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
    .logo { text-align: center; margin-bottom: 20px; }
    .amount { font-size: 48px; font-weight: bold; text-align: center; color: #333; margin: 30px 0; }
    .due-date { text-align: center; color: #666; }
    .details { margin: 30px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; font-weight: bold; }
    .btn { display: block; background: #2196F3; color: white; padding: 15px; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h2>🏢 Cloud Services</h2>
    </div>
    <p style="text-align: center; color: #666;">您的月度账单已生成</p>
    <div class="amount">¥ 299.00</div>
    <p class="due-date">付款截止日期：2026年1月31日</p>
    <div class="details">
      <h3>费用明细</h3>
      <div class="detail-row"><span>基础套餐</span><span>¥ 199.00</span></div>
      <div class="detail-row"><span>额外存储 (50GB)</span><span>¥ 50.00</span></div>
      <div class="detail-row"><span>API 调用超额</span><span>¥ 50.00</span></div>
      <div class="detail-row"><span>总计</span><span>¥ 299.00</span></div>
    </div>
    <a href="https://example.com/pay" class="btn">立即支付</a>
    <div class="footer">
      <p>如有疑问，请联系 support@service.example.com</p>
      <p>此邮件由系统自动发送，请勿回复</p>
    </div>
  </div>
</body>
</html>`,
    attachments: [
      {
        cid: 'att-004',
        filename: '账单详情-202601.pdf',
        size: 156000,
        downloadUrl: 'https://example.com/download/invoice-202601.pdf'
      }
    ]
  },
  {
    id: 'email-009',
    subject: 'Newsletter: 本周技术资讯精选',
    from: 'newsletter@tech.example.com',
    to: 'subscriber@example.com',
    date: new Date(Date.now() - 518400000).toISOString(),
    text: '',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #1a1a1a; color: white; padding: 40px; text-align: center; }
    .article { padding: 20px 30px; border-bottom: 1px solid #eee; }
    .article img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; background: #ddd; }
    .article h3 { margin: 15px 0 10px 0; }
    .article p { color: #666; line-height: 1.6; }
    .read-more { color: #1a73e8; text-decoration: none; font-weight: bold; }
    .footer { background: #1a1a1a; color: #999; padding: 30px; text-align: center; }
    .footer a { color: #fff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📰 Tech Weekly</h1>
      <p>2026年第2期 • 本周技术资讯精选</p>
    </div>
    <div class="article">
      <div style="width:100%;height:200px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:48px;">🤖</div>
      <h3>AI 编程助手的新突破</h3>
      <p>最新一代的 AI 编程助手在代码理解和生成方面取得了重大进展，能够更准确地理解开发者意图...</p>
      <a href="#" class="read-more">阅读全文 →</a>
    </div>
    <div class="article">
      <div style="width:100%;height:200px;background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:48px;">⚡</div>
      <h3>Rust 语言使用率持续增长</h3>
      <p>根据最新的开发者调查，Rust 连续第八年被评为最受喜爱的编程语言，越来越多的企业开始采用...</p>
      <a href="#" class="read-more">阅读全文 →</a>
    </div>
    <div class="article">
      <div style="width:100%;height:200px;background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:48px;">☁️</div>
      <h3>边缘计算：云服务的下一个前沿</h3>
      <p>随着 IoT 设备的普及和对实时处理的需求增加，边缘计算正在成为云服务提供商的新战场...</p>
      <a href="#" class="read-more">阅读全文 →</a>
    </div>
    <div class="footer">
      <p>感谢您的订阅！</p>
      <p><a href="#">退订</a> | <a href="#">更新偏好</a> | <a href="#">查看网页版</a></p>
    </div>
  </div>
</body>
</html>`,
    attachments: []
  },
  {
    id: 'email-010',
    subject: 'Re: 关于项目进度的讨论',
    from: 'colleague@company.example.com',
    to: 'you@company.example.com',
    date: new Date(Date.now() - 604800000).toISOString(),
    text: '好的，我已经看过你发的文档了。\n\n关于第三阶段的时间安排，我觉得可以适当调整一下。原计划是两周完成，但考虑到春节假期，建议延长到三周。\n\n另外，测试环境的问题我今天下午会处理，预计明天可以恢复正常。\n\n周五的会议我会准时参加。\n\n---\n\n> 原始邮件\n> 发件人: you@company.example.com\n> 时间: 2026年1月2日\n>\n> 请查看附件中的项目计划，有任何问题请随时沟通。',
    html: null,
    attachments: []
  }
];

// Handle API request
function handleApiEmails(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const decoded = Buffer.from(body, 'base64').toString('utf-8');
      const { offset = 0, limit = 10 } = JSON.parse(decoded);

      const emails = mockEmails.slice(offset, offset + limit);

      const response = {
        result: 'success',
        emails: emails,
        offset: offset,
        limit: limit,
        count: emails.length
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}

// Serve static files
function serveStaticFile(filePath, res) {
  const extname = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = contentTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Create server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  console.log(`${req.method} ${url.pathname}`);

  // API endpoint
  if (url.pathname === '/api/emails' && req.method === 'POST') {
    handleApiEmails(req, res);
    return;
  }

  // Static files
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
  serveStaticFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 TestMail Mock Server is running!                      ║
║                                                            ║
║   Local:   http://localhost:${PORT}                          ║
║                                                            ║
║   Mock API: POST /api/emails                               ║
║   - Returns ${mockEmails.length} sample emails for testing              ║
║                                                            ║
║   Tips: Enter any namespace/apikey to load mock data       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
