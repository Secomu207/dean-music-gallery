import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const log = {
    ip,
    time: new Date().toISOString(),
    referrer: req.body.referrer || '없음',
    userAgent: req.body.userAgent || '없음',
  };

  const filePath = path.join(process.cwd(), 'access-log.json');
  let logs = [];

  if (fs.existsSync(filePath)) {
    logs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  logs.push(log);

  // 30일 이내 기록만 유지
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 30;
  logs = logs.filter(entry => new Date(entry.time).getTime() > cutoff);

  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
  res.status(200).end();
}
