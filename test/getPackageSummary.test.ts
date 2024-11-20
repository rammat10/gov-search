import { getPackageSummary } from '@/lib/services/govinfo';

async function testGetPackageSummary() {
  try {
    const packageId = 'BILLS-117hr3684enr'; // Replace with a valid package ID
    const summary = await getPackageSummary({ packageId });
    console.log('Package Summary:', summary);
  } catch (error) {
    console.error('Error during getPackageSummary test:', error);
  }
}

testGetPackageSummary(); 