// import { NextResponse } from "next/dist/server/web/spec-extension/response";
// import { mongoConnect } from "../../utils/feature";
// import { User } from "../../model/User";

// export async function POST(req) {
//     const { channelName, channelId } = await req.json();
//     if (!channelName || !channelId) {
//         return NextResponse.json({ success: false, message: 'channelName or channelId missing' }, { status: 400 });
//     }
//     try {
//         await mongoConnect();
//         const user = new User({ channelName, channelId });
//         await user.save();
//         return NextResponse.json({ success: true, message: "Website Created Successfully 🎉🎉🎉" }, { status: 201 });
//     } catch (err) {
//         return NextResponse.json({ success: false, message: `Internal Server Error: ${err.message}` }, { status: 500 });
//     }
// }

// const setCorsHeaders = (response) => {
//     response.headers.set('Access-Control-Allow-Origin', '*');
//     response.headers.set('Access-Control-Allow-Credentials', 'true');
//     response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
//     response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     return response;
// };

// export async function GET(req) {
//     const url = new URL(req.url); 
//     const id = url.searchParams.get('id');
//     const name = url.searchParams.get('name');
//     if (id) {
//         try {
//             await mongoConnect();
//             const user = await User.findOne({ channelId: id });
//             if (user) {
//                 return NextResponse.json({ success: true, message: true }, { status: 200 });
//             } else {
//                 return NextResponse.json({ success: false, message: false }, { status: 404 });
//             }
//         } catch (err) {
//             return NextResponse.json({ success: false, message: `Internal Server Error: ${err.message}` }, { status: 500 });
//         }
//     }
//     else if (name) {
//         try {
//             await mongoConnect();
//             const user = await User.findOne({ channelName: name });
//             if (user) {
//                 const response = NextResponse.json(
//                     { success: true, message: "Channel Found", data: user },
//                     { status: 200 }
//                 );
//                 return setCorsHeaders(response);
//                 // return NextResponse.json({ success: true, message: "Channel Found", data: user }, { status: 200 });
//             } else {
//                 const response = NextResponse.json(
//                     { success: false, message: "Error finding Channel" },
//                     { status: 404 }
//                 );
//                 return setCorsHeaders(response);
//                 // return NextResponse.json({ success: false, message: "Error finding Channel" }, { status: 404 });
//             }
//         } catch (err) {
//             const response = NextResponse.json(
//                 { success: false, message: `Internal Server Error: ${err.message}` },
//                 { status: 500 }
//             );
//             return setCorsHeaders(response);
//             // return NextResponse.json({ success: false, message: `Internal Server Error: ${err.message}` }, { status: 500 });
//         }
//     }
//     else {
//         try {
//             await mongoConnect();
//             const channels = await User.find({}).select("-channelId");
//             if (channels) {
//                 return NextResponse.json({ success: true, message: "Channels", data: channels }, { status: 200 });
//             } else {
//                 return NextResponse.json({ success: false, message: "Channels Not Present" }, { status: 404 });
//             }
//         } catch (err) {
//             return NextResponse.json({ success: false, message: `Internal Server Error: ${err.message}` }, { status: 500 });
//         }
//     }
// }

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// User Schema (adjust according to your needs)
const userSchema = new mongoose.Schema({
  name: String,
  channelId: String,
  // add other fields as needed
});

// Get or create the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    console.log("Searching for user:", name);

    const user = await User.findOne({ name });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        channelId: user.channelId
      },
      message: "User found"
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}