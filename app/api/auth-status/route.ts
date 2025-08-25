// app/api/add-note/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleCors } from "@/lib/cors";
import { getToken } from "next-auth/jwt";
import { connectToDB } from "@/utils/mongo/database";
import User from "@/models/user";
import Note from "@/models/note";

export async function OPTIONS(request: NextRequest) {
  return handleCors(request); // Obsługa preflight CORS
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { note, userId, url } = body;

  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({ req, secret });

  console.log(token, "to nowy token", url, " z urla");

  console.log("Otrzymano notatkę:", note, "od użytkownika:", userId);

  if (!token || !token.email) {
    return NextResponse.json(
      { success: false, message: "invalid token" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }

  try {
    await connectToDB();

    // check if user already exists
    const userExists = await User.findOne({ email: token.email });

    // if not, create a new document and save user in MongoDB
    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong, go to the webpage and log in",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    await Note.create({
      userId: userExists,
      url: url,
      content: note,
    });
    console.log("Note created created");

    return NextResponse.json(
      { success: true, message: "New note added" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.log("Error checking if user exists: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error occured during note creation please try again later",
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
