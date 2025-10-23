// File: /app/api/missions/access/route.ts

export async function POST(request: Request) {
  try {
    // 1. Get the PIN from the frontend's request
    const body = await request.json();
    const { pin } = body;

    // 2. Validate the data (your job)
    if (!pin) {
      return Response.json(
        { message: "PIN is required" },
        { status: 400 } // 400 = Bad Request
      );
    }

    console.log("Attempting to find mission with PIN:", pin);

    // 3. Find the mission in the database (Database Teammate's job)
    // -----------------------------------------------------------------
    // TODO: Talk to your database teammate.
    // This is where they will use Supabase to find a mission
    // that has this exact PIN.
    //
    // Example:
    // const { data: mission, error } = await supabase
    //   .from('missions')
    //   .select('*') // Get all mission details
    //   .eq('pin', pin) // Where 'pin' matches the one sent
    //   .single(); // We only expect one
    // -----------------------------------------------------------------

    // --- FOR TESTING (you can use this until DB is ready) ---
    // Simulating a successful database lookup
    const MOCK_DB_LOOKUP = {
      id: "mission-abc-123",
      pin: "123456",
      status: "active",
      location: { lat: 12.345, lng: 67.890 },
      type: "Fire",
    };

    let mission = null;
    if (pin === "123456") {
      mission = MOCK_DB_LOOKUP;
    }
    // --- END OF MOCK DATA ---
    

    // 4. Send the response
    if (mission) {
      // SUCCESS: PIN was correct, send back the mission data
      return Response.json(mission, { status: 200 });
    } else {
      // FAILURE: PIN was wrong
      return Response.json(
        { message: "Invalid PIN" },
        { status: 401 } // 401 = Unauthorized
      );
    }

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "An error occurred" },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}