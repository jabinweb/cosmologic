import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      console.log('Unauthorized delete attempt');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planId = params.id;
    console.log(`Attempting to delete plan: ${planId}`);

    // Check if plan exists
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
      select: {
        id: true,
        name: true,
        displayName: true,
        isActive: true
      }
    });

    if (!existingPlan) {
      console.log(`Plan not found: ${planId}`);
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    console.log('Found plan:', existingPlan);

    // Check if plan has active subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        planId: existingPlan.id, // Use plan ID instead of name
        status: 'ACTIVE'
      },
      select: {
        id: true,
        userId: true
      }
    });

    console.log(`Active subscriptions found: ${activeSubscriptions.length}`);

    if (activeSubscriptions.length > 0) {
      console.log('Cannot delete plan - active subscriptions exist');
      return NextResponse.json(
        { 
          error: "Cannot delete plan with active subscriptions",
          activeSubscriptions: activeSubscriptions.length
        },
        { status: 400 }
      );
    }

    // Deactivate plan instead of deleting if it has any subscription history
    const hasSubscriptionHistory = await prisma.subscription.count({
      where: {
        planId: existingPlan.id
      }
    });

    if (hasSubscriptionHistory > 0) {
      console.log('Plan has subscription history - deactivating instead');
      const deactivatedPlan = await prisma.plan.update({
        where: { id: planId },
        data: { isActive: false }
      });

      return NextResponse.json({
        success: true,
        message: "Plan deactivated successfully",
        plan: deactivatedPlan
      });
    }

    // If no history, safe to delete
    console.log('Deleting plan');
    await prisma.plan.delete({
      where: { id: planId }
    });

    return NextResponse.json({ 
      success: true,
      message: "Plan deleted successfully"
    });

  } catch (error) {
    console.error('Failed to delete plan:', error);
    return NextResponse.json(
      { error: "Failed to delete plan", details: error },
      { status: 500 }
    );
  }
}

// Optional: Add PUT endpoint for updating plans
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planId = params.id;
    const data = await request.json();

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data
    });

    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error('Failed to update plan:', error);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const plan = await prisma.plan.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Failed to fetch plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}
