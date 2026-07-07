export async function onRequest(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://www.sunmay266.com',
    'Cache-Control': 'no-store',
  };

  // 只計入從自家頁面發出的請求，直接以網址或腳本呼叫不累計
  const referer = context.request.headers.get('Referer') || '';
  if (!referer.startsWith('https://www.sunmay266.com/') && !referer.startsWith('http://localhost')) {
    const raw = await context.env.COUNTER_KV?.get('pageviews');
    return new Response(JSON.stringify({ count: (parseInt(raw) || 0) + 888 }), { headers });
  }

  if (!context.env.COUNTER_KV) {
    return new Response(JSON.stringify({ count: 888 }), { headers });
  }

  const raw = await context.env.COUNTER_KV.get('pageviews');
  const count = (parseInt(raw) || 0) + 1;
  await context.env.COUNTER_KV.put('pageviews', String(count));

  return new Response(JSON.stringify({ count: count + 888 }), { headers });
}
