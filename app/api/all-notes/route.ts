import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/utils/mongo/database";
import User from "@/models/user";
import Note from "@/models/note";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();
    const userExists = await User.findOne({ email: session.user.email });
    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const notes = await Note.find({ userId: userExists._id }, "-userId");

    return NextResponse.json({ success: true, notes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching notes" },
      { status: 500 }
    );
  }
}
