export default function handler(req, res) {
  const { pw } = req.query;

  if (pw !== 'kingdeantrbl') {
    return res.status(403).send('Access denied');
  }

  // 테스트용 고정 로그 출력
  const testLogs = [
    {
      ip: '127.0.0.1',
      time: '2025-05-18T00:00:00Z',
      referrer: '없음',
      userAgent: 'TestAgent/1.0'
    }
  ];

  const result = testLogs.map((log, i) =>
    `#${i + 1}\nIP: ${log.ip}\n시간: ${log.time}\n참조자: ${log.referrer}\nUserAgent: ${log.userAgent}\n---`
  ).join('\n');

  res.send(result);
}
