import crypto from 'crypto';
import catchAsync from '../utils/CatchAsync.js';
import AppError from '../utils/AppError.js';

const providerConfig = {
  custodyProvider: process.env.PAYMENT_CUSTODY_PROVIDER || 'licensed_provider_placeholder',
  custodyAccountName: process.env.PAYMENT_CUSTODY_ACCOUNT_NAME || 'Nyle Travel Customer Funds',
  custodyAccountReference: process.env.PAYMENT_CUSTODY_ACCOUNT_REFERENCE || 'NYLE-CUSTOMER-FUNDS',
  mpesaShortCode: process.env.MPESA_SHORTCODE || process.env.M_PESA_SHORTCODE || '174379',
  mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL || '',
  escrowApiBaseUrl: process.env.ESCROW_PROVIDER_API_BASE_URL || '',
};

const providerIsConfigured = Boolean(
  (process.env.MPESA_CONSUMER_KEY || process.env.M_PESA_CONSUMER_KEY) &&
  (process.env.MPESA_CONSUMER_SECRET || process.env.M_PESA_CONSUMER_SECRET) &&
  providerConfig.mpesaCallbackUrl
);

const sampleFunds = [
  {
    id: 'tf_amboseli_weekend',
    fund_number: 'NYF-MAY-2401',
    title: 'Amboseli birthday weekend',
    mode: 'group_pool',
    status: 'collecting',
    organizer_name: 'Grace Wanjiku',
    target_amount: 186000,
    collected_amount: 128500,
    refundable_amount: 128500,
    nyle_commission_pending: 9300,
    supplier_payable_pending: 176700,
    participant_count: 8,
    paid_participant_count: 5,
    due_date: '2026-07-15',
    custody_provider: providerConfig.custodyProvider,
    custody_status: 'safeguarded',
    share_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/travel-fund/NYF-MAY-2401`,
  },
  {
    id: 'tf_diani_layaway',
    fund_number: 'NYF-JUN-1028',
    title: 'Diani December escape',
    mode: 'installment_plan',
    status: 'collecting',
    organizer_name: 'Brian Otieno',
    target_amount: 242000,
    collected_amount: 60500,
    refundable_amount: 60500,
    nyle_commission_pending: 12100,
    supplier_payable_pending: 229900,
    participant_count: 2,
    paid_participant_count: 1,
    due_date: '2026-10-31',
    custody_provider: providerConfig.custodyProvider,
    custody_status: 'safeguarded',
    share_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/travel-fund/NYF-JUN-1028`,
  },
];

const summarizeFunds = (funds) => {
  const totalHeld = funds.reduce((sum, fund) => sum + fund.collected_amount, 0);
  const totalTargets = funds.reduce((sum, fund) => sum + fund.target_amount, 0);
  const pendingCommission = funds.reduce((sum, fund) => sum + fund.nyle_commission_pending, 0);
  const supplierPayables = funds.reduce((sum, fund) => sum + fund.supplier_payable_pending, 0);

  return {
    total_customer_liability: totalHeld,
    total_target_value: totalTargets,
    pending_nyle_commission: pendingCommission,
    pending_supplier_payables: supplierPayables,
    active_funds: funds.length,
    provider_configured: providerIsConfigured,
    custody_provider: providerConfig.custodyProvider,
  };
};

const buildFundResponse = (payload, user) => {
  const now = new Date();
  const fundNumber = `NYF-${now.getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const targetAmount = Number(payload.total_amount || payload.target_amount || 0);
  const firstContribution = Number(payload.initial_amount || payload.deposit_amount || 0);
  const shareToken = crypto.randomBytes(8).toString('hex');

  return {
    id: `tf_${shareToken}`,
    fund_number: fundNumber,
    title: payload.title || payload.trip_title || 'Nyle Travel fund',
    mode: payload.mode || 'installment_plan',
    status: 'draft',
    organizer_user_id: user?.id || null,
    organizer_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Guest organizer',
    target_amount: targetAmount,
    collected_amount: firstContribution,
    refundable_amount: firstContribution,
    nyle_commission_pending: Math.round(targetAmount * 0.05),
    supplier_payable_pending: Math.max(targetAmount - Math.round(targetAmount * 0.05), 0),
    participant_count: Number(payload.participants || payload.participant_count || 1),
    paid_participant_count: firstContribution > 0 ? 1 : 0,
    due_date: payload.due_date || null,
    custody_provider: providerConfig.custodyProvider,
    custody_account_name: providerConfig.custodyAccountName,
    custody_account_reference: providerConfig.custodyAccountReference,
    custody_status: providerIsConfigured ? 'ready_for_provider_collection' : 'provider_placeholder',
    share_policy: payload.share_policy || (payload.mode === 'group_pool' ? 'equal_split_locked' : 'solo_or_installment'),
    equal_contribution_amount: payload.equal_contribution_amount || null,
    revenue_policy: 'Customer contributions remain a liability until the trip is confirmed and supplier obligations are accepted.',
    share_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/travel-fund/${fundNumber}?token=${shareToken}`,
    provider: {
      configured: providerIsConfigured,
      mpesa_short_code: providerConfig.mpesaShortCode,
      callback_url_present: Boolean(providerConfig.mpesaCallbackUrl),
      escrow_api_present: Boolean(providerConfig.escrowApiBaseUrl),
    },
  };
};

export const getCustodyConfig = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      provider: {
        ...providerConfig,
        configured: providerIsConfigured,
      },
      policy: {
        holder: 'licensed_payment_or_escrow_provider',
        accounting_treatment: 'customer_liability_until_booking_confirmation',
        revenue_recognition: 'nyle_commission_after_confirmation_or_fulfilment_milestone',
        refund_paths: ['mpesa_refund', 'customer_wallet_credit', 'deadline_extension'],
      },
    },
  });
});

export const getMyTravelFunds = catchAsync(async (req, res) => {
  const userFunds = sampleFunds.slice(0, 2).map((fund) => ({
    ...fund,
    organizer_user_id: req.user?.id || null,
  }));

  res.status(200).json({
    status: 'success',
    results: userFunds.length,
    data: {
      summary: summarizeFunds(userFunds),
      funds: userFunds,
    },
  });
});

export const createTravelFund = catchAsync(async (req, res, next) => {
  const amount = Number(req.body.total_amount || req.body.target_amount || 0);
  if (!amount || amount < 100) {
    return next(new AppError('A valid target amount is required to create a travel fund', 400));
  }

  const fund = buildFundResponse(req.body, req.user);

  res.status(202).json({
    status: 'success',
    message: providerIsConfigured
      ? 'Travel fund created and ready for provider collection.'
      : 'Travel fund preview created. Configure M-Pesa and escrow provider credentials before collecting live funds.',
    data: { fund },
  });
});

export const initiateContribution = catchAsync(async (req, res, next) => {
  const amount = Number(req.body.amount || 0);
  const phone = String(req.body.phone || '').trim();

  if (!amount || amount < 10) {
    return next(new AppError('Contribution amount must be at least KES 10', 400));
  }

  if (!phone) {
    return next(new AppError('M-Pesa phone number is required', 400));
  }

  res.status(202).json({
    status: 'success',
    message: providerIsConfigured
      ? 'M-Pesa STK request queued.'
      : 'M-Pesa placeholder accepted. No live STK push was sent because provider credentials are not configured.',
    data: {
      contribution: {
        id: `tfc_${crypto.randomBytes(6).toString('hex')}`,
        fund_id: req.params.fundId,
        amount,
        phone,
        method: 'mpesa_stk',
        status: providerIsConfigured ? 'initiated' : 'provider_placeholder',
        custody_provider: providerConfig.custodyProvider,
        customer_liability: amount,
        nyle_revenue_recognized: 0,
      },
    },
  });
});

export const getAdminTravelFunds = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    results: sampleFunds.length,
    data: {
      summary: summarizeFunds(sampleFunds),
      funds: sampleFunds,
      reconciliation_notes: [
        'Customer contributions are tracked as liabilities while funds are being collected.',
        'Supplier payables and Nyle commission stay pending until booking confirmation.',
        'Provider settlement IDs should be reconciled against M-Pesa/escrow callbacks before manual status changes.',
      ],
    },
  });
});

export const reconcileTravelFund = catchAsync(async (req, res) => {
  res.status(202).json({
    status: 'success',
    message: 'Reconciliation action recorded as a placeholder.',
    data: {
      fund_id: req.params.fundId,
      action: req.body.action || 'mark_reviewed',
      provider_reference: req.body.provider_reference || null,
      reviewed_by: req.user?.id || null,
      reviewed_at: new Date().toISOString(),
      live_provider_call: providerIsConfigured,
    },
  });
});
