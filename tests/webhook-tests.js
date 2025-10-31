// Webhook Test Suite - Demo Webhook Payloads and Tests
// This file demonstrates webhook testing with various payload examples

const fetch = require('node-fetch');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook';
const TEST_VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'test_token';

/**
 * Test webhook health check
 */
async function testHealth() {
  try {
    console.log('[TEST] Health Check...');
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('[TEST] Health:', data);
    return response.ok;
  } catch (error) {
    console.error('[TEST ERROR]', error.message);
    return false;
  }
}

/**
 * Test Instagram comment webhook
 */
async function testInstagramComment() {
  try {
    console.log('[TEST] Instagram Comment Webhook...');
    const payload = {
      type: 'ig.comment',
      data: {
        text: 'This product looks amazing!',
        from: { id: 'user123', username: 'john_doe' }
      }
    };
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log('[TEST] Response:', result);
    return response.ok;
  } catch (error) {
    console.error('[TEST ERROR]', error.message);
    return false;
  }
}

/**
 * Test E-commerce order webhook
 */
async function testShopifyOrder() {
  try {
    console.log('[TEST] Shopify Order Webhook...');
    const payload = {
      type: 'shopify.order.created',
      data: {
        id: 'order_123',
        customer: { email: 'customer@example.com' },
        total_price: '299.99',
        line_items: [
          { id: 'item_1', title: 'Product A', price: '99.99' },
          { id: 'item_2', title: 'Product B', price: '200.00' }
        ]
      }
    };
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log('[TEST] Response:', result);
    return response.ok;
  } catch (error) {
    console.error('[TEST ERROR]', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 Starting Webhook Tests...');
  console.log('='.repeat(50) + '\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Instagram Comment', fn: testInstagramComment },
    { name: 'Shopify Order', fn: testShopifyOrder }
  ];
  
  let passed = 0;
  for (const test of tests) {
    try {
      const result = await test.fn();
      console.log(`${result ? '✅' : '❌'} ${test.name}\n`);
      if (result) passed++;
    } catch (error) {
      console.log(`❌ ${test.name}\n`);
    }
  }
  
  console.log('='.repeat(50));
  console.log(`📊 Results: ${passed}/${tests.length} passed`);
  console.log('='.repeat(50) + '\n');
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testHealth, testInstagramComment, testShopifyOrder, runAllTests };
