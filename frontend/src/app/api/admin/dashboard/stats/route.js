import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request) {
  try {
    const [totalUsers, totalBookings, totalRevenueResult] = await Promise.all([
      prisma.User.count({
        where: { deleted_at: null }
      }),
      prisma.bookings.count(),
      prisma.payments.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'success'
        }
      })
    ]);

    const totalRevenue = totalRevenueResult._sum.amount ? parseFloat(totalRevenueResult._sum.amount) : 0;

    // Get recent bookings
    const recentBookings = await prisma.bookings.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { id: true, booking_number: true, created_at: true }
    });

    // Get recent users
    const recentUsers = await prisma.User.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { id: true, email: true, created_at: true }
    });

    // Get recent payments
    const recentPayments = await prisma.payments.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { id: true, reference_number: true, created_at: true }
    });

    const recentActivity = [
      ...recentBookings.map(b => ({ type: 'booking', id: b.id, reference: b.booking_number, created_at: b.created_at })),
      ...recentUsers.map(u => ({ type: 'user', id: u.id, reference: u.email, created_at: u.created_at })),
      ...recentPayments.map(p => ({ type: 'payment', id: p.id, reference: p.reference_number, created_at: p.created_at }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

    // Monthly stats using raw query for DATE_TRUNC
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*)::int as total_bookings,
        COALESCE(SUM(total_amount), 0)::float as revenue
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `;

    return NextResponse.json({
      status: 'success',
      data: {
        overview: {
          totalUsers,
          totalBookings,
          totalRevenue,
        },
        monthlyStats,
        recentActivity
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Error in /api/admin/dashboard/stats:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch dashboard stats' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
