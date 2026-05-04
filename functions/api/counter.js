export async function onRequest(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  };

  if (!context.env.COUNTER_KV) {
    return new Response(JSON.stringify({ count: 888 }), { headers });
  }

  const raw = await context.env.COUNTER_KV.get('pageviews');
  const count = (parseInt(raw) || 0) + 1;
  await context.env.COUNTER_KV.put('pageviews', String(count));

  return new Response(JSON.stringify({ count: count + 888 }), { headers });
}
