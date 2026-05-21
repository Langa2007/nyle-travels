import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build Prisma query
    const where = { is_active: true };
    
    if (searchParams.has('type')) {
      where.type = searchParams.get('type');
    }
    
    if (searchParams.has('destination_id')) {
      where.destination_id = searchParams.get('destination_id');
    }
    
    if (searchParams.has('difficulty_level')) {
      where.difficulty_level = searchParams.get('difficulty_level');
    }

    if (searchParams.has('is_featured')) {
      where.is_featured = searchParams.get('is_featured') === 'true';
    }
    
    if (searchParams.has('search')) {
      const search = searchParams.get('search');
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    // Handle pagination & limits
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;
    
    // Sort
    let orderBy = { created_at: 'desc' };
    if (searchParams.has('sort')) {
      const sort = searchParams.get('sort');
      if (sort === 'base_price') {
        orderBy = { base_price: 'asc' };
      } else if (sort === '-base_price') {
        orderBy = { base_price: 'desc' };
      } else if (sort === 'duration_days') {
        orderBy = { duration_days: 'asc' };
      } else if (sort === '-duration_days') {
        orderBy = { duration_days: 'desc' };
      }
    }

    // Execute queries
    const [toursList, totalCount] = await Promise.all([
      prisma.tour_packages.findMany({
        where,
        take: limit,
        skip,
        orderBy
      }),
      prisma.tour_packages.count({ where })
    ]);

    // Attach destination names
    // To minimize DB calls, we can fetch all destinations at once
    const destinationIds = toursList.map(t => t.destination_id).filter(Boolean);
    let destinationsMap = {};
    
    if (destinationIds.length > 0) {
      const dests = await prisma.Destination.findMany({
        where: { id: { in: destinationIds } },
        select: { id: true, name: true }
      });
      destinationsMap = dests.reduce((acc, d) => {
        acc[d.id] = d.name;
        return acc;
      }, {});
    }

    const toursFormatted = toursList.map(tour => ({
      ...tour,
      destination_name: destinationsMap[tour.destination_id] || null
    }));

    return NextResponse.json({
      status: 'success',
      data: {
        tours: toursFormatted,
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error in /api/tours:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch tours' }, { status: 500 });
  }
}
