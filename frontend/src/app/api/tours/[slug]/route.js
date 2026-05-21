import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    // Find the tour package by slug
    const tour = await prisma.tour_packages.findUnique({
      where: { slug }
    });

    if (!tour || !tour.is_active) {
      return NextResponse.json({ status: 'error', message: 'No tour found with that name' }, { status: 404 });
    }

    // Get itinerary
    const itinerary = await prisma.tour_itineraries.findMany({
      where: { tour_package_id: tour.id },
      orderBy: { day_number: 'asc' }
    });

    // Get availability
    const availability = await prisma.tour_availability.findMany({
      where: { 
        tour_package_id: tour.id,
        available_slots: { gt: 0 }
      },
      orderBy: { start_date: 'asc' }
    });

    // Get similar tours
    const similarToursList = await prisma.tour_packages.findMany({
      where: { 
        destination_id: tour.destination_id, 
        id: { not: tour.id }, 
        is_active: true,
        type: tour.type
      },
      take: 3
    });

    const destination = tour.destination_id 
      ? await prisma.Destination.findUnique({ where: { id: tour.destination_id } }) 
      : null;

    // Attach destination_name
    const tourWithDest = {
      ...tour,
      destination_name: destination?.name
    };

    // Format similar tours
    const similarToursFormatted = similarToursList.map(sim => ({
      ...sim,
      destination_name: destination?.name // assuming same destination
    }));

    return NextResponse.json({
      status: 'success',
      data: {
        tour: tourWithDest,
        itinerary,
        availability,
        similarTours: similarToursFormatted
      }
    });

  } catch (error) {
    console.error('Error in /api/tours/[slug]:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch tour' }, { status: 500 });
  }
}
