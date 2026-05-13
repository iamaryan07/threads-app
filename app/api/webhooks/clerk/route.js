/* eslint-disable camelcase */
// Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// Above article shows why we need webhooks i.e., to sync data to our backend

// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// It's a good practice to verify webhooks. Above article shows why we should do it

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";

// Resource: https://clerk.com/docs/integration/webhooks#supported-events
// Above document lists the supported events

const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error("Missing NEXT_CLERK_WEBHOOK_SECRET");
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const headerPayload = await headers();

    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    // Validate required headers
    if (
      !svixHeaders["svix-id"] ||
      !svixHeaders["svix-timestamp"] ||
      !svixHeaders["svix-signature"]
    ) {
      return NextResponse.json(
        { message: "Missing Svix headers" },
        { status: 400 },
      );
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    let event;

    try {
      event = wh.verify(body, svixHeaders);
    } catch (err) {
      console.error("Webhook verification failed:", err);

      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    const eventType = event.type;

    // ORGANIZATION CREATED
    if (eventType === "organization.created") {
      try {
        const { id, name, slug, logo_url, image_url, created_by } = event.data;

        await createCommunity(
          id,
          name,
          slug,
          logo_url || image_url,
          "org bio",
          created_by,
        );

        return NextResponse.json(
          { message: "Organization created successfully" },
          { status: 201 },
        );
      } catch (err) {
        console.error("Error creating organization:", err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

    // ORGANIZATION INVITATION CREATED
    if (eventType === "organizationInvitation.created") {
      try {
        console.log("Invitation created:", event.data);

        return NextResponse.json(
          { message: "Invitation created" },
          { status: 201 },
        );
      } catch (err) {
        console.error("Error handling invitation:", err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

    // ORGANIZATION MEMBERSHIP CREATED
    if (eventType === "organizationMembership.created") {
      try {
        const { organization, public_user_data } = event.data;

        console.log("Membership created:", event.data);

        await addMemberToCommunity(organization.id, public_user_data.user_id);

        return NextResponse.json(
          { message: "Member added successfully" },
          { status: 201 },
        );
      } catch (err) {
        console.error("Error adding member:", err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

    // ORGANIZATION MEMBERSHIP DELETED
    if (eventType === "organizationMembership.deleted") {
      try {
        const { organization, public_user_data } = event.data;

        console.log("Membership removed:", event.data);

        await removeUserFromCommunity(
          public_user_data.user_id,
          organization.id,
        );

        return NextResponse.json(
          { message: "Member removed successfully" },
          { status: 200 },
        );
      } catch (err) {
        console.error("Error removing member:", err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

    // ORGANIZATION UPDATED
    if (eventType === "organization.updated") {
      try {
        const { id, logo_url, name, slug } = event.data;

        console.log("Organization updated:", event.data);

        await updateCommunityInfo(id, name, slug, logo_url);

        return NextResponse.json(
          { message: "Organization updated successfully" },
          { status: 200 },
        );
      } catch (err) {
        console.error("Error updating organization:", err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

    // ORGANIZATION DELETED
    if (eventType === "organization.deleted") {
      try {
        const { id } = event.data;

        console.log("Organization deleted:", event.data);

        await deleteCommunity(id);

        return NextResponse.json(
          { message: "Organization deleted successfully" },
          { status: 200 },
        );
      } catch (err) {
        console.error("Error deleting organization:", err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

    // Unknown event fallback
    return NextResponse.json(
      { message: `Unhandled event type: ${eventType}` },
      { status: 200 },
    );
  } catch (err) {
    console.error("Webhook handler error:", err);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
