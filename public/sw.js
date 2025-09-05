// sw.js
const TARGET_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const ARK_API_KEY = '5eb3fb2b-6c29-4fab-8025-53bc6ef97eea'; // 替换为你的真实密钥

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ✅ 只拦截你自己的域名下的 /v1/chat/completions 的 POST 请求
  if (
    url.pathname === '/v1/chat/completions' &&
    event.request.method === 'POST'
  ) {
    event.respondWith(
      handleChatRequest(event.request)
    );
  }
});

async function handleChatRequest(request) {
  try {
    console.log('handle2!')
    
    // 1. 读取原始请求体（只能读一次，所以需要 clone）
    const body = await request.clone().arrayBuffer();

    // 2. 构造新的 Headers，基于原始请求的 headers
    const headers = new Headers(request.headers);

    // ✅ 添加或覆盖 Authorization header
    headers.set('Authorization', `Bearer ${ARK_API_KEY}`);

    // 可选：确保 Content-Type 正确
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // 3. 转发到 Ark API
    const response = await fetch(TARGET_URL, {
      method: 'POST',
      headers: headers,
      body: body,
      // 可选：设置超时（Service Worker 中不支持直接 timeout，需用 AbortController）
      // 例如：添加 10 秒超时
      signal: request.signal // 传递中止信号（如页面关闭）
    });

    // 4. 检查响应是否成功
    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      return new Response(
        JSON.stringify({
          error: 'Upstream failed',
          status: response.status,
          message: errorText
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 5. 返回响应给前端
    // 注意：response.body 是 ReadableStream，可以直接返回
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': 'application/json',
        // 可选：添加缓存控制
        'Cache-Control': 'no-cache',
        // 如果你需要前端读取某些 header（如 X-RateLimit），需显式允许
        // 'Access-Control-Expose-Headers': 'X-RateLimit-Limit, X-RateLimit-Remaining'
      }
    });

  } catch (err) {
    console.log('err:', err)
    // 网络错误、超时、CORS 等
    if (err.name === 'AbortError') {
      console.log('Request aborted by the user.');
      // 用户取消请求
      return new Response(null, { status: 499, statusText: 'Client Closed Request' });
    }

    return new Response(
      JSON.stringify({
        error: 'Proxy request failed',
        message: err.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
