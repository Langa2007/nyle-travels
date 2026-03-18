import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Format amount for display
export const formatAmount = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Convert to smallest currency unit (e.g., cents)
export const toSmallestCurrencyUnit = (amount) => {
  return Math.round(amount * 100);
};

// Convert from smallest currency unit
export const fromSmallestCurrencyUnit = (amount) => {
  return amount / 100;
};

// Validate webhook signature
export const validateWebhookSignature = (payload, signature, secret) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    throw new Error(`Webhook signature validation failed: ${err.message}`);
  }
};

// Get payment status badge
export const getPaymentStatusBadge = (status) => {
  const badges = {
    pending: { color: 'yellow', text: 'Pending' },
    success: { color: 'green', text: 'Success' },
    failed: { color: 'red', text: 'Failed' },
    refunded: { color: 'orange', text: 'Refunded' },
    cancelled: { color: 'gray', text: 'Cancelled' }
  };
  
  return badges[status] || { color: 'gray', text: status };
};

// Calculate payment summary
export const calculatePaymentSummary = (payments) => {
  return payments.reduce((summary, payment) => {
    summary.total += payment.amount;
    
    if (payment.status === 'success') {
      summary.successful += payment.amount;
      summary.successfulCount++;
    } else if (payment.status === 'pending') {
      summary.pending += payment.amount;
      summary.pendingCount++;
    } else if (payment.status === 'failed') {
      summary.failed += payment.amount;
      summary.failedCount++;
    } else if (payment.status === 'refunded') {
      summary.refunded += payment.amount;
      summary.refundedCount++;
    }
    
    return summary;
  }, {
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
    refundedCount: 0
  });
};