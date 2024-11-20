import { getBillDetails } from '@/lib/services/govinfo';

async function testGetBillDetails() {
  try {
    const packageId = 'BILLS-117hr3684enr'; // Replace with a valid package ID
    const details = await getBillDetails(packageId);
    console.log('Bill Details:', details);
  } catch (error) {
    console.error('Error during getBillDetails test:', error);
  }
}

testGetBillDetails(); 