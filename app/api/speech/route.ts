// dummy route

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const body = await req.json();
  console.log("API received:", body);
  return new Response(
    JSON.stringify({
      action: "recommend",
      ai_message: "Bark, bark, bork",
      Services: ["gardening", "pokemon collecting, going to the beach"],
      clarification_question: "bark?",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
