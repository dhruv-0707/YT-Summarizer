import express from 'express';
import axios from 'axios'; // For making HTTP requests
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your n8n webhook URL
const N8N_WORKFLOW_URL = 'http://3.107.184.201:5678/webhook/ytube';

app.post('/summarize', async (req, res) => {
  const { youtubeUrl } = req.body;

  if (!youtubeUrl) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  try {
    // Step 1: Send the URL to your n8n workflow
    const n8nResponse = await axios.post(
      N8N_WORKFLOW_URL,
      { url: youtubeUrl },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const n8nData = n8nResponse.data; // Assuming n8n returns the expected object directly
    console.log(n8nData);
    if (!n8nData || !n8nData[0].title || !n8nData[0].summary) {
      return res.status(500).json({
        error: 'Invalid response from n8n workflow. Ensure n8n returns the correct fields.',
      });
    }

    // Step 2: Return the summarized data directly to the client
    return res.status(200).json({
      message: 'Video summary generated successfully!',
      data: {
        title: n8nData[0].title,
        summary: n8nData[0].summary,
        description: n8nData[0].description || '',
        youtubeUrl: youtubeUrl,
        topics: n8nData[0].topics || [],
      },
    });
  } catch (error) {
    console.error('Error:', error.message);

    // Return error details for debugging
    if (error.response) {
      return res.status(500).json({
        error: 'Request failed',
        details: error.response.data,
      });
    }

    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

export const getSummary = async (youtubeUrl) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/summarize`, { youtubeUrl });
    return response.data.data.summary; // Extract the summary field from the response
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error; // Rethrow the error to handle it in your component
  }
};

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
