// File: /app/api/report/route.ts

// This function handles POST requests
export async function POST(request: Request) {
  try {
    // 1. Get the data from the frontend
    // The frontend will send a JSON object with latitude and longitude
    const body = await request.json();
    const { latitude, longitude, emergencyType } = body;

    // 2. Validate the data (your job)
    if (!latitude || !longitude) {
      // If data is missing, send an error back
      return Response.json(
        { message: "Missing location data" },
        { status: 400 } // 400 means "Bad Request"
      );
    }

    console.log("New emergency reported at:", { latitude, longitude, emergencyType });

    // 3. Prepare data for the database (where your teammate takes over)
    // -----------------------------------------------------------------
    // TODO: Talk to your database teammate.
    // This is where they will take `body` and use Supabase
    // to save it to the "incidents" table.
    //
    // Example: await supabase.from('incidents').insert(body)
    // -----------------------------------------------------------------

    // 4. Send a success response back to the frontend
    return Response.json(
      { message: "Emergency report received successfully!" },
      { status: 201 } // 201 means "Created"
    );

  } catch (error) {
    // If anything else goes wrong
    console.error(error);
    return Response.json(
      { message: "An error occurred" },
      { status: 500 } // 500 means "Internal Server Error"
    );
  }
}