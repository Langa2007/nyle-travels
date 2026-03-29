import { Subscriber } from '../models/Subscriber.js';
import { sendNewsletterWelcomeEmail } from '../services/emailService.js';
import { body, validationResult } from 'express-validator';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    // Check if already subscribed
    const existing = await Subscriber.findByEmail(email);
    if (existing && existing.status === 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'You are already subscribed to our newsletter'
      });
    }

    // Save to DB
    const subscriber = await Subscriber.create(email);
    
    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send newsletter welcome email:', emailError);
      // We don't fail the subscription if only the email fails
    }

    res.status(201).json({
      status: 'success',
      message: 'Successfully subscribed to Nyle Travel newsletter',
      data: subscriber
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process subscription. Please try again later.'
    });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const result = await Subscriber.getAll(parseInt(limit) || 100, parseInt(offset) || 0);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch subscribers'
    });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    await Subscriber.updateStatus(email, 'unsubscribed');
    
    res.status(200).json({
      status: 'success',
      message: 'Successfully unsubscribed from our newsletter'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to unsubscribe'
    });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await Subscriber.delete(id);
    
    res.status(200).json({
      status: 'success',
      message: 'Subscriber removed successfully'
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete subscriber'
    });
  }
};
