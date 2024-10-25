import { useState } from 'react';
import axios from 'axios';

function Form() {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [llavaResponse, setLlavaResponse] = useState('');
    const [llama3Response, setLlama3Response] = useState('');
    const [llavaTime, setLlavaTime] = useState('');
    const [llamaTime, setLlamaTime] = useState('');
    const [llavaPrompt, setLlavaPrompt] = useState('');

    // Function to handle image file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file)); // Create a preview URL
            resetResponses(); // Reset responses when a new image is selected
        } else {
            resetForm(); // Reset form if no file is selected
        }
    };

    const resetResponses = () => {
        setLlavaResponse('');
        setLlama3Response('');
        setLlavaTime('');
        setLlamaTime('');
        setLlavaPrompt(''); // Reset prompt
    };

    // Function to upload image and fetch description from the backend
    const handleUploadAndFetchResponse = async (event) => {
        event.preventDefault();
        if (!imageFile) {
            console.log('No image selected.');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('prompt', llavaPrompt);

        try {
            const uploadResponse = await axios.post('/describeImageWithPrompt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { llava, llama3 } = uploadResponse.data;
            setLlavaResponse(llava.description);
            setLlama3Response(llama3.description);
            setLlavaTime(llava.time);
            setLlamaTime(llama3.time);
            console.log('Image and prompt sent to backend, and descriptions received successfully.');

            
        } catch (error) {
            console.error('Error uploading image and fetching description:', error);
        }
    };

    // Function to handle the prompt submission
    const handlePromptSubmit = async (event) => {
        event.preventDefault();
        if (!llavaPrompt || !imageFile) {
            console.log('No prompt provided or image not uploaded.');
            return;
        }

        const formData = new FormData();
        formData.append('prompt', llavaPrompt);
        formData.append('image', imageFile); // Include the image as well

        try {
            const promptResponse = await axios.post('/sendPrompt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { llava, llama3 } = promptResponse.data;
            setLlavaResponse(llava.description);
            setLlama3Response(llama3.description);
            setLlavaTime(llava.time);
            setLlamaTime(llama3.time);
            console.log('Prompt sent to backend, and descriptions received successfully.');

            // Clear the prompt for future input
            setLlavaPrompt('');
        } catch (error) {
            console.error('Error sending prompt to backend:', error);
        }
    };

    // Function to reset the form
    const resetForm = () => {
        setImageFile(null);
        setImagePreviewUrl(null);
        setLlavaPrompt('');
    };

    return (
        <div className="container">
            <div className="box">
                <center><h2>Upload an Image!</h2></center>
                <hr />
                <center>
                    <form onSubmit={handleUploadAndFetchResponse}>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        <button type="submit" className="btn btn-primary">Describe Image</button>
                    </form>
                </center>
                <hr />
                
                {/* Display the selected image */}
                {imagePreviewUrl && (
                    <div className="mt-3">
                        <center>
                            <h3>Selected Image Preview:</h3>
                            <img className="formImg" src={imagePreviewUrl} alt="Selected Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                        </center>
                    </div>
                )}

                {/* Display the LLaVA and LLaMA 3 responses side by side */}
                {llavaResponse && llama3Response && (
                    <div className="row mt-4">
                        <div className='container'> 
                            <button type="button" className="btn btn-success w-100 mb-2">
                                Total Time taken: {(parseFloat(llavaTime) + parseFloat(llamaTime)).toFixed(2)} sec
                            </button>
                        </div>
                        <hr />
                        
                        {/* LLaVA Response */}
                        <div className="col-md-6">
                            <div className="container box">
                                <button type="button" className="btn btn-success w-100 mb-2">
                                    LLaVA Image Description <span>***Note: 7B parameters</span><h5>Time taken: {llavaTime} sec</h5>
                                </button>
                                <hr />
                                <p>{llavaResponse}</p>
                            </div>
                        </div>

                        {/* LLaMA 3 Response */}
                        <div className="col-md-6">
                            <div className="container box">
                                <button type="button" className="btn btn-info w-100 mb-2">
                                    LLaMA3 Image Analysis <span>***Note: 3B parameters</span>  <h5>Time taken: {llamaTime} sec</h5>
                                </button>
                                <hr />
                                <p>{llama3Response}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Form;
