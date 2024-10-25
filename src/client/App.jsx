import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import Banner from './Banner';
import Form from './Form';
import Footer from './Footer';

function App() {
  return (
    <>
    <Navbar></Navbar>
      <Banner></Banner>
      <Form/>
      <Footer></Footer>
      
      
    </>
  );
}

export default App;
