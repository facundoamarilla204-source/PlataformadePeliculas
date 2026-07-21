const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.VIMEUS_API_KEY;
const TARGET_TMDB_ID = 1339713;

async function testVimeus() {
  if (!API_KEY) {
    console.error('No VIMEUS_API_KEY in .env');
    return;
  }

  console.log('Testing Vimeus API /api/listing/movies');
  console.log('API_KEY length:', API_KEY.length);
  
  try {
    let currentPage = 1;
    let lastPage = 1;
    let found = false;

    do {
      const url = `https://vimeus.com/api/listing/movies?page=${currentPage}`;
      console.log(`\nFetching ${url}...`);
      
      const response = await axios.get(url, {
        headers: {
          'X-API-Key': API_KEY,
          'Accept': 'application/json'
        },
        validateStatus: () => true
      });

      console.log(`Status: ${response.status}`);
      
      if (currentPage === 1) {
        console.log('Sample response keys:', Object.keys(response.data));
        console.log('error flag:', response.data.error);
        console.log('message:', response.data.message);
        console.log('data keys:', response.data.data ? Object.keys(response.data.data) : 'N/A');
        
        if (response.data.data && response.data.data.movies && response.data.data.movies.length > 0) {
           console.log('First movie object keys:', Object.keys(response.data.data.movies[0]));
           console.log('First movie object sample:', JSON.stringify(response.data.data.movies[0], null, 2));
        } else {
           console.log('Data structure unexpected or no movies on page 1:', JSON.stringify(response.data.data).substring(0, 500));
        }
      }

      if (response.status === 200 && response.data && response.data.error === false) {
        const movies = response.data.data.result || [];
        
        const match = movies.find(m => String(m.tmdb_id) === String(TARGET_TMDB_ID));
        if (match) {
           console.log(`\n!!! FOUND TMDB ${TARGET_TMDB_ID} on page ${currentPage} !!!`);
           console.log(JSON.stringify(match, null, 2));
           found = true;
           break;
        }

        lastPage = response.data.data.pages || 1;
        console.log(`Page ${currentPage}/${lastPage} processed. Found ${movies.length} movies. Target not found here.`);
        
        currentPage++;
      } else {
        console.log('Failed or end of list. Body:', response.data);
        break;
      }

      // Small delay
      await new Promise(r => setTimeout(r, 100));

    } while (currentPage <= lastPage);

    if (!found) {
       console.log(`\nTarget TMDB ${TARGET_TMDB_ID} was NOT found in all ${lastPage} pages.`);
    }

  } catch (err) {
    console.error('Error during test:', err.message);
  }
}

testVimeus();
