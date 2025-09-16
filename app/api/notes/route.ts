import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDB } from "@/utils/mongo/database";
import User from "@/models/user";
import Note from "@/models/note";
import { handleCors } from "@/lib/cors";

export async function GET(req: NextRequest) {
  // const rawUrl = req.nextUrl.searchParams.get("url") || "";
  // const decondedUrl = decodeURIComponent(rawUrl);
  // console.log(decondedUrl);

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

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

    const notes = await Note.find(
      {
        user: userExists,
      },
      "-userId" // projection – wykluczamy userId
    )
      .sort({ updatedAt: -1 }) // najnowsze po update
      .limit(3);

    // console.log(`Found notes: ${notes}`);

    return NextResponse.json(
      { success: true, notes: notes },
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

export async function OPTIONS(request: NextRequest) {
  return handleCors(request); // Obsługa preflight CORS
}

export async function POST(req: NextRequest) {
  console.log("post 1 ");
  const body = await req.json();
  const { note, url, category, title } = body;

  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({ req, secret });

  console.log(token, "to nowy token", url, " z urla");

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
      content: JSON.stringify(note),
      category: category,
      title: title,
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

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, category, content } = body;

  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({ req, secret });

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
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, category },
      { new: true } // zwraca już zaktualizowany dokument
    );

    if (!updatedNote) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 }
      );
    }

    console.log("Note updated ✅");

    return NextResponse.json(
      { success: true, message: "Note updated", note: updatedNote },
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

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body; // id notatki do usunięcia

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!token || !token.email) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
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

    // Sprawdź czy użytkownik istnieje
    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Znajdź notatkę i sprawdź czy należy do użytkownika
    const note = await Note.findOne({ _id: id, userId: user._id });
    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found or not owned by user" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Usuń notatkę
    await Note.deleteOne({ _id: id });

    return NextResponse.json(
      { success: true, message: "Note deleted successfully" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting note: ", error);
    return NextResponse.json(
      { success: false, message: "Error occurred while deleting note" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
