import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

export async function testFoodCreation() {
  try {
    console.log('Test 1: Creating food...');
    const response = await api.post('/foods', {
      name: 'Test Food',
      description: 'Test description',
      price: 10,
      category: 'Main Course',
      image: 'https://via.placeholder.com/300',
      available: true,
      rating: 4.5
    });

    console.log('Full response:', response);
    console.log('response.data:', response.data);
    console.log('response.data.data:', response.data.data);
    console.log('response.data.data._id:', response.data.data._id);

    return response.data.data._id;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
