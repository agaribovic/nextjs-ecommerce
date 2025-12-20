import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const cakeTheme = formData.get("cakeTheme") as string;
    const orderPrice = formData.get("orderPrice") as string;
    const numberOfPieces = formData.get("numberOfPieces");
    const colorOfPieces = formData.get("colorOfPieces") as File;
    const delivery = formData.get("delivery") as string;
    const orderEmail = formData.get("orderEmail") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const additionalDescription = formData.get(
      "additionalDescription"
    ) as string;
    const paymentMethod = formData.get("paymentMethod") as string;

    await resend.emails.send({
      from: `Narudžba Torte <onboarding@resend.dev>`,
      to: process.env.EMAIL_TO!,
      replyTo: orderEmail,
      subject: `Nova narudžba - ${cakeTheme || "Bez teme"}`,
      html: `
        <h2>Nova narudžba torte</h2>
        <p><strong>Tema torte:</strong> ${cakeTheme}</p>
        <p><strong>Cijena:</strong> ${orderPrice}</p>
        <p><strong>Broj komada:</strong> ${numberOfPieces}</p>
        <p><strong>Boja komada:</strong> ${colorOfPieces}</p>
        <p><strong>Preuzimanje:</strong> ${delivery}</p>
        <p><strong>Email:</strong> ${orderEmail}</p>
        <p><strong>Broj telefona:</strong> ${phoneNumber}</p>
        <p><strong>Dodatni opis:</strong> ${additionalDescription}</p>
        <p><strong>Vrsta plaćanja:</strong> ${paymentMethod}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
