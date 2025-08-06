// dummy route

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const body = await req.json();
  console.log("API received:", body);
  return new Response(
    JSON.stringify({
      action: "recommend",
      ai_message: "Bark, bark, bork",
      services: [
        {
          id: "1245",
          name: "Nurse Joy",
          provider: "pokemon center",
          price: 65,
          rating: 4.5,
          description: "to heal your pokemon",
          category: "pokemon",
          duration: 60,
        },
      ],
      clarification_question: "bark?",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
