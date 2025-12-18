import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Установить session cookie
export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json(
                { error: "No token provided" },
                { status: 400 }
            );
        }

        // Устанавливаем cookie на 7 дней
        const cookieStore = await cookies();
        cookieStore.set("authToken", idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 дней
            path: "/",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error setting session:", error);
        return NextResponse.json(
            { error: "Failed to set session" },
            { status: 500 }
        );
    }
}

// Удалить session cookie
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("authToken");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting session:", error);
        return NextResponse.json(
            { error: "Failed to delete session" },
            { status: 500 }
        );
    }
}
