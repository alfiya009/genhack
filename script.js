const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // To make HTTP requests to Dialogflow

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like HTML, CSS, JS

// Dialogflow API credentials
const dialogflowProjectId = 'YOUR-PROJECT-ID';
const sessionId = 'YOUR-SESSION-ID';
const languageCode = 'en';

// POST route to send user input to Dialogflow
app.post('/send-message', async (req, res) => {
    const message = req.body.message;

    const requestBody = {
        queryInput: {
            text: {
                text: message,
                languageCode: languageCode
            }
        }
    };

    try {
        const response = await axios.post(
            `https://dialogflow.googleapis.com/v2/projects/${dialogflowProjectId}/agent/sessions/${sessionId}:detectIntent`,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer YOUR-OAUTH-TOKEN`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract chatbot response from Dialogflow
        const chatbotResponse = response.data.queryResult.fulfillmentText;
        res.json({ reply: chatbotResponse });

    } catch (error) {
        console.error('Error connecting to Dialogflow:', error);
        res.status(500).send('Error in Dialogflow request');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
