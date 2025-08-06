// dummy route

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const body = await req.json();
  console.log("API received:", body);
  return new Response(JSON.stringify({ reply: "Got it!" }), {
    headers: { "Content-Type": "application/json" },
  });
}
