import React from 'react';

function Footer() {
    return (
        <div className='container mt-5'>
            <div className="jumbotron">
            <hr />
<center className='container' style={{ backgroundColor: '', padding: '20px' }}>
    <img src='/LLM.png' alt="Selected Preview" style={{ maxWidth: '80%', height: '70%'}} />
</center>
<hr />
<hr />

                <center className='container'>
                    <h2>Disadvantages:</h2>
                    <ul className="list-unstyled">
                        <li>Quality of image descriptions <span style={{ fontSize: '2.5em' }}>∝</span> number of parameters.</li>
                        <li>Performance and costs can be significant issues.</li>
                        <li>Need a super-computer in hand to run LLMs in real-time or pay hefty fees for cloud-based LLMs, which also violates privacy.</li>
                    </ul>
                </center>
                <hr className="my-4" />
                <hr />
            </div>
        </div>
    );
}

export default Footer;
