// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const ghlRes = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.GHL_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         firstName: body.name,
//         email: body.email,
//         phone: body.phone,
//         source: "Website Contact Form",
//         tags: ["website-lead"],
//         customField: {
//           message: body.message,
//         },
//       }),
//     });

//     if (!ghlRes.ok) {
//       const errorText = await ghlRes.text();
//       console.error("GHL Error:", errorText);
//       return NextResponse.json({ error: "GHL failed" }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Server Error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
