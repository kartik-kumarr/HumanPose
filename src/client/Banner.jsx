import React from 'react';

function Banner() {
    return (
        <div className='container mt-5'>
            <div className="jumbotron">
                
                <hr />
                
                <center className='container'>
                        <img src='/llava.png' alt="Selected Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                </center>
                <hr />
                <hr />
                <center className='container'>
                        <img src='/llava+llama.png' alt="Selected Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                </center>
                <hr className="my-4" />
                
                <hr />
            </div>
        </div>

    );
}

export default Banner;
