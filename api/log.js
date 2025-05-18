// import fs from 'fs';
// import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // 전체 헤더 로그 출력
  console.log('📦 전체 헤더:', req.headers);

  // IP 추출
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const log = {
    ip,
    time: new Date().toISOString(),
    referrer: req.body.referrer || '없음',
    userAgent: req.body.userAgent || '없음',
  };

  // 로그를 Vercel 콘솔에 출력
  console.log('✅ 로그인 로그:', log);

  res.status(200).json({ success: true });
}
