// File: /app/api/missions/create/route.ts

/**
 * A simple helper function to generate a random 6-digit PIN
 */
function generatePin(): string {
  // Generates a random number between 100000 and 999999
  const pin = Math.floor(100000 + Math.random() * 900000);
  return pin.toString(); // Convert it to a string
}

export async function POST(request: Request) {
  try {
    // 1. Get the mission details from the LGU's frontend
    // (e.g., they might send the ID of the emergency report)
    const body = await request.json();
    const { incidentId, assignedTeam } = body; 

    // 2. Validate the incoming data (your job)
    if (!incidentId || !assignedTeam) {
      return Response.json(
        { message: "Missing mission details (incidentId or assignedTeam)" },
        { status: 400 } // 400 = Bad Request
      );
    }

    // 3. Generate the new random PIN
    const newPin = generatePin();
    console.log("Generated new PIN for mission:", newPin);

    // 4. Prepare the new mission object to be saved
    const newMission = {
      incident_id: incidentId,
      assigned_team: assignedTeam,
      pin: newPin,
      status: 'pending', // You can set a default status
      created_at: new Date().toISOString(),
    };

    // 5. Save the new mission to the database (Database Teammate's job)
    // -----------------------------------------------------------------
    // TODO: Talk to your database teammate.
    // This is where they will use Supabase to INSERT this
    // `newMission` object into the 'missions' table.
    //
    // Example:
    // const { data: createdMission, error } = await supabase
    //   .from('missions')
    //   .insert(newMission)
    //   .select() // This makes Supabase return the newly created row
    //   .single();
    //
    // if (error) {
    //   throw error; // This will be caught by the catch block
    // }
    // -----------------------------------------------------------------

    // --- FOR TESTING (you can use this until DB is ready) ---
    // We'll just pretend we saved it and return the `newMission` object
    const createdMission = newMission;
    // --- END OF MOCK DATA ---
    

    // 6. Send the complete new mission back to the frontend
    // The frontend will receive this and can then show the user the PIN
    return Response.json(createdMission, { status: 201 }); // 201 = Created

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "An error occurred while creating the mission" },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}