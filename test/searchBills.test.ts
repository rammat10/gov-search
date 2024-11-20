import { searchBills } from '@/lib/services/govinfo';

async function testSearchBills() {
  try {
    const params = {
      query: 'climate change',
      dateIssuedStartDate: '2014-01-01',
      dateIssuedEndDate: '2023-12-31',
      pageSize: 5,
    };
    const results = await searchBills(params);
    console.log('Search Bills Results:', results);
  } catch (error) {
    console.error('Error during searchBills test:', error);
  }
}

testSearchBills(); 