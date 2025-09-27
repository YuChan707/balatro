  import React, { useState } from 'react';
  
    function FileUploadForm() {
        const [selectedFile, setSelectedFile] = useState(null);

        const handleFileChange = (event) => {
            setSelectedFile(event.target.files[0]);
        };

        const handleSubmit = async (event) => {
            event.preventDefault();

            if (!selectedFile) {
                alert('Please select a file.');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile); 

            try {
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('File uploaded successfully!');
                } else {
                    alert('File upload failed.');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                alert(error);
            }
        };

        return (
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload File</button>
            </form>
        );
    }

    export default FileUploadForm;