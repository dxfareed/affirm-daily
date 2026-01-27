import { NextResponse } from "next/server";
import { toFirstPerson } from "@/lib/affirmation";

export async function GET() {
    try {
        const response = await fetch("https://www.affirmations.dev/", {
            headers: {
                Accept: "application/json",
            },
            cache: "no-store", // Ensure we always get a fresh one if called
        });

        if (!response.ok) {
            throw new Error(`Upstream API failed: ${response.status}`);
        }

        const data = await response.json();

        // Transform to first person
        return NextResponse.json({
            affirmation: toFirstPerson(data.affirmation),
        });
    } catch (error) {
        console.error("Affirmation fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch affirmation" },
            { status: 500 }
        );
    }
}
