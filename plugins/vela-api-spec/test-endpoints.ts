/**
 * Test script for vela-api-spec endpoints
 * Usage: ts-node test-endpoints.ts
 * Or: yarn add -D ts-node && yarn ts-node test-endpoints.ts
 */

const BASE_URL = 'http://localhost:7007/api/vela-api-spec';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

const results: TestResult[] = [];

async function testEndpoint(
  method: string,
  path: string,
  body?: any,
  description?: string,
): Promise<void> {
  const endpoint = `${method} ${path}`;
  const startTime = Date.now();

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const responseTime = Date.now() - startTime;

    if (response.ok) {
      // Consume response body to avoid memory leaks
      await response.text();
      results.push({
        endpoint: description || endpoint,
        method,
        status: 'PASS',
        statusCode: response.status,
        responseTime,
      });
      console.log(
        `✅ ${description || endpoint} - ${
          response.status
        } (${responseTime}ms)`,
      );
    } else {
      const errorText = await response.text();
      results.push({
        endpoint: description || endpoint,
        method,
        status: 'FAIL',
        statusCode: response.status,
        error: errorText,
        responseTime,
      });
      console.log(
        `❌ ${description || endpoint} - ${response.status}: ${errorText}`,
      );
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    results.push({
      endpoint: description || endpoint,
      method,
      status: 'FAIL',
      error: error instanceof Error ? error.message : String(error),
      responseTime,
    });
    console.log(`❌ ${description || endpoint} - ERROR: ${error}`);
  }
}

async function runTests() {
  console.log('🚀 Starting vela-api-spec endpoint tests...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // ============= Basic Endpoints =============
  console.log('📋 Testing Basic Endpoints...');

  await testEndpoint('GET', '/health', undefined, 'Health Check');

  await testEndpoint(
    'GET',
    '/templates/site-config',
    undefined,
    'Get Site Config Template',
  );

  await testEndpoint(
    'GET',
    '/schemas/components',
    undefined,
    'Get All Component Schemas',
  );

  await testEndpoint(
    'GET',
    '/schemas/components/hero',
    undefined,
    'Get Hero Schema',
  );

  await testEndpoint(
    'GET',
    '/schemas/components/features',
    undefined,
    'Get Features Schema',
  );

  await testEndpoint(
    'GET',
    '/examples/minimal',
    undefined,
    'Get Minimal Example',
  );

  await testEndpoint('GET', '/examples/full', undefined, 'Get Full Example');

  // ============= Generate Endpoints =============
  console.log('\n📝 Testing Generate Endpoints...');

  await testEndpoint(
    'POST',
    '/generate/page',
    {
      path: '/about',
      title: 'About Us',
      description: 'Learn more about our company',
      sections: [
        { type: 'hero', id: 'hero-1' },
        { type: 'features', id: 'features-1' },
      ],
    },
    'Generate Page',
  );

  await testEndpoint(
    'POST',
    '/generate/component/hero',
    {
      content: {
        title: 'Welcome to Our Platform',
        subtitle: 'Build amazing things',
        description: 'The best platform for developers',
      },
    },
    'Generate Hero Component',
  );

  await testEndpoint(
    'POST',
    '/validate/site-config',
    {
      config: {
        site: {
          name: 'Test Site',
          description: 'A test website',
        },
        pages: [],
      },
    },
    'Validate Site Config',
  );

  // ============= AI Endpoints (if API key configured) =============
  console.log('\n🤖 Testing AI Endpoints...');
  console.log('Note: These require OPENROUTER_API_KEY in .env\n');

  await testEndpoint(
    'POST',
    '/ai/generate/site-config',
    {
      siteName: 'Tech Startup',
      siteDescription: 'A revolutionary SaaS platform for developers',
      industry: 'Technology',
      targetAudience: 'Software Developers',
      style: 'Modern and Minimalist',
    },
    'AI: Generate Site Config',
  );

  await testEndpoint(
    'POST',
    '/ai/generate/page',
    {
      path: '/pricing',
      title: 'Pricing Plans',
      description: 'Choose the perfect plan for your team',
      purpose: 'Display pricing tiers with features',
    },
    'AI: Generate Page',
  );

  await testEndpoint(
    'POST',
    '/ai/generate/component/hero',
    {
      context: 'Homepage hero for a fitness app',
      content: 'Include a motivational tagline and two CTAs',
    },
    'AI: Generate Hero Component',
  );

  await testEndpoint(
    'POST',
    '/ai/enhance/component',
    {
      component: {
        type: 'hero',
        title: 'Welcome',
        subtitle: 'Start here',
      },
      instructions: 'Make it more engaging and add a call-to-action',
    },
    'AI: Enhance Component',
  );

  await testEndpoint(
    'POST',
    '/ai/generate/from-prompt',
    {
      prompt:
        'Create a landing page for a project management tool with hero, features, pricing, and testimonials',
    },
    'AI: Generate from Natural Language',
  );

  // ============= Summary =============
  const separator = '='.repeat(60);
  console.log(`\n${separator}`);
  console.log('📊 TEST SUMMARY');
  console.log(separator);

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed} (${((passed / total) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed} (${((failed / total) * 100).toFixed(1)}%)`);

  const avgResponseTime =
    results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length;
  console.log(`⏱️  Average Response Time: ${avgResponseTime.toFixed(0)}ms`);

  console.log(`\n${separator}`);
  console.log('📋 DETAILED RESULTS');
  console.log(separator);

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    const time = result.responseTime ? `${result.responseTime}ms` : 'N/A';
    console.log(
      `${icon} ${result.endpoint} - ${result.statusCode || 'ERROR'} (${time})`,
    );
    if (result.error) {
      console.log(`   Error: ${result.error.substring(0, 100)}...`);
    }
  });

  console.log(`\n${separator}`);

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check the backend logs for details.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
