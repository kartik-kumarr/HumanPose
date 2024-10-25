import ViteExpress from "vite-express";
import bodyParser from 'body-parser';
import express from "express";
import multer from 'multer';  
import fs from 'fs';
import ollama from 'ollama';  
import dotenv from 'dotenv';
dotenv.config();  

const app = express();
const upload = multer({ dest: 'uploads/' });



// Function to describe the image using LLaVA
async function describeImageWithLlava(imagePath) {
    console.log(imagePath)
    try {
        const response = await ollama.chat({
            model: 'llava',  
            messages: [{ 
                role: 'user', 
                content: "Describe the posture of the human in the given Image:",  // Use the user-provided prompt
                images: [imagePath]
            }]
        });

        return response.message.content;
    } catch (error) {
        console.error('Error while describing image with LLaVA:', error);
        throw error;
    }
}

// Function to describe the image using LLaMA 3
async function describeImageWithLlama(imagePath, llavaOut) {
    try {
        // const resImg = await encodeImage(imagePath);
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [{ 
                role: 'user', 
                content: "Based on the following description of the human posture:" + llavaOut + "Can you please tell if the person is working in an awkward posture? If yes, why? If not, why?" 
            }]
        });

        return response.message.content;
    } catch (error) {
        console.error('Error while describing image with LLaMA 3:', error);
        throw error;
    }
}

// Endpoint to handle image upload and description generation with both LLaVA and LLaMA 3
app.post('/describeImageWithPrompt', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;  // Multer stores the image and provides the path

    if (!req.file) {
        return res.status(400).send({ error: 'No image file provided' });
    }

    try {
        // Get Image description from LLaVA
        const startLlava = Date.now();
        const llavaDescription = await describeImageWithLlava(imagePath);
        console.log(llavaDescription)
        const endLlava = Date.now();
        const llavaTime = (endLlava - startLlava) / 1000;

        // Get Analysis of the Image description from LLaMA3.2
        const startLlama = Date.now();
        const llamaDescription = await describeImageWithLlama(imagePath, llavaDescription);
        console.log(llamaDescription)
        const endLlama = Date.now();
        const llamaTime = (endLlama - startLlama) / 1000;

        // Sending both responses back to the frontend
        res.status(200).send({
            llava: {
                description: llavaDescription,
                time: llavaTime
            },
            llama3: {
                description: llamaDescription,
                time: llamaTime
            }
        });

        // Cleaning up the uploaded image
        if (fs.existsSync(imagePath)) {
            // fs.unlinkSync(imagePath);  // Delete the file after processing
            console.log("Image deleted after processing.");
        }
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image.');
    }
});

const port = 8080;
ViteExpress.listen(app, port, () =>
    console.log(`Server is listening on port ${port}`),
);
