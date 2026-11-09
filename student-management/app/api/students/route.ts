import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET() {
  await dbConnect();
  const students = await Student.find({}).lean();
  return NextResponse.json(students);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const student = await Student.create(body);
  return NextResponse.json(student, { status: 201 });
}