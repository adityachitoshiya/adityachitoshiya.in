import fs from 'fs';
import path from 'path';

async function testUpload() {
  const filePath = path.join(process.cwd(), 'public/ai-images/contact_1784235098810.png');
  const endpoint = 'https://www.adityachitoshiya.in/api/upload';

  console.log(`Reading file from ${filePath}...`);
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'image/png' });

  const formData = new FormData();
  formData.append('media', blob, 'contact_test.png');

  console.log(`Sending POST request to ${endpoint}...`);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
  } catch (error) {
    console.error('Error during upload test:', error);
  }
}

testUpload();
