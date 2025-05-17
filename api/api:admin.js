import fs from 'fs';
import path from 'path';

const PASSWORD = 'kingdeantrbl';

export default async function handler(req, res) {
  if (req.query.pw !== PASSWORD) {
    return res.status(403).send('비밀번호가 틀렸습니다.');
  }

  const filePath = path.join(process.cwd(), 'access-log.json');

  if (!fs.existsSync(filePath)) {
    return res.send('아직 기록이 없습니다.');
  }

  const logs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const logText = logs.map((log, i) =>
    `#${i + 1}\nIP: ${log.ip}\n시간: ${log.time}\n참조자: ${log.referrer}\nUserAgent: ${log.userAgent}\n---`
  ).join('\n');

  res.send(logText);
}
