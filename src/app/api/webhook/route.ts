import { NextResponse } from "next/server";
import Stripe from "stripe";

import { createBooking, updateHotelRoom } from "@/libs/apis";

type MatadataType = {
  adults: number;
  checkinDate: string;
  checkoutDate: string;
  children: number;
  hotelRoom: string;
  numberOfDays: number;
  user: string;
  discount: number;
  totalPrice: number;
};

const checkout_session_completed = "checkout.session.completed";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request, res: Response) {
  const reqBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
  }

  // load our event
  switch (event.type) {
    case checkout_session_completed:
      const session = event.data.object;
      const {
        // @ts-ignore
        metadata,
      } = session;

      const temp = metadata as unknown as MatadataType;

      await createBooking({
        adults: Number(temp.adults),
        checkinDate: temp.checkinDate,
        checkoutDate: temp.checkoutDate,
        children: Number(temp.children),
        hotelRoom: temp.hotelRoom,
        numberOfDays: Number(temp.numberOfDays),
        discount: Number(temp.discount),
        totalPrice: Number(Number(temp.totalPrice).toFixed(2)),
        user: temp.user,
      });

      //   Update hotel Room
      await updateHotelRoom(temp.hotelRoom);

      return NextResponse.json("Booking successful", {
        status: 200,
        statusText: "Booking Successful",
      });

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json("Event Received", {
    status: 200,
    statusText: "Event Received",
  });
}
