const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const PASSWORD = 'kingdeantrbl';
const LOG_FILE = path.join(__dirname, 'access.log.json');

app.use(express.json());
app.use(express.static(__dirname));

// 방문자 IP 로그 저장
app.post('/log', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const log = {
    ip,
    time: new Date().toISOString(),
    referrer: req.body.referrer || '없음',
    userAgent: req.body.userAgent || '없음'
  };

  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  }

  logs.push(log);

  // 30일 이내 기록만 유지
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 30;
  logs = logs.filter(entry => new Date(entry.time).getTime() > cutoff);

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  res.sendStatus(200);
});

// 관리자 로그 조회
app.get('/admin', (req, res) => {
  if (req.query.pw !== PASSWORD) {
    return res.status(403).send('Access denied');
  }

  if (!fs.existsSync(LOG_FILE)) {
    return res.send('아직 저장된 로그가 없습니다.');
  }

  const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  const output = logs.map((log, i) =>
    `#${i + 1}\nIP: ${log.ip}\n시간: ${log.time}\n참조자: ${log.referrer}\nUserAgent: ${log.userAgent}\n---`
  ).join('\n');

  res.send(output);
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
