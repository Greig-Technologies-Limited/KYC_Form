import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import "./Form.css"

// Firebase configuration
const firebaseConfig = {


  apiKey: "AIzaSyBvX-_52EIidPTed0n9-XiRrRtsx5x6wrc",
  authDomain: "soloti2.firebaseapp.com",
  projectId: "soloti2",
  storageBucket: "soloti2.appspot.com",
  messagingSenderId: "454263549916",
  appId: "1:454263549916:web:fd6d56b465be36324b6919"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Form = () => {
    const [user, setUser] = useState({
      firstName: '', lastName: '', Email: '', Address: '', phoneNumber: '', bvn: '', nin: '',
      Next_of_kin_firstName: '', Next_of_kin_lastName: '', Next_of_kin_Email: '', Next_of_kin_Address: '', Next_of_kin_phoneNumber: ''
    });
    const [file, setFile] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [error, setError] = useState('');

    // 
    const handleBackdropClick = () => {
        setError('');
        setSubmissionSuccess(false);
      };
    
      const handlePreviewClick = () => {
        window.location.reload(); // Refresh the page
      };
    //   
  
    const data = (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
      if (error) setError(''); // Clear error when user starts correcting
    };
  
    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        if (e.target.name === "photoInput") {
          setPhoto(e.target.files[0]);
        } else {
          setFile(e.target.files[0]);
        }
      }
    };
  
    const validateForm = () => {
      const requiredFields = [
        'firstName', 'lastName', 'Email', 'Address', 'phoneNumber', 'bvn', 'nin',
        'Next_of_kin_firstName', 'Next_of_kin_lastName', 'Next_of_kin_Email', 'Next_of_kin_Address', 'Next_of_kin_phoneNumber'
      ];
      for (let field of requiredFields) {
        if (!user[field]) {
          setError(`Please fill in the ${field.replace(/_/g, ' ')}.`);
          return false;
        }
      }
      if (!file || !photo) {
        setError("Please upload both the ID and a photo.");
        return false;
      }
      return true; // All fields are filled
    };
  
    const getdata = async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        return; // Stop submission if validation fails
      }
  
      try {
        if (file) {
          const fileRef = ref(storage, `files/${file.name}`);
          await uploadBytes(fileRef, file);
        }
        if (photo) {
          const photoRef = ref(storage, `photos/${photo.name}`);
          await uploadBytes(photoRef, photo);
        }
  
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        };
  
        const res = await fetch('https://soloti2-default-rtdb.firebaseio.com/UserData.json', options);
        if (res.ok) {
          setSubmissionSuccess(true);  // Set to true on successful submission
          setError('');  // Clear any errors on successful submission
        } else {
          setError("An error occurred during form submission.");
          setSubmissionSuccess(false);
        }
      } catch (error) {
        setError("Failed to submit form: " + error.message);
        setSubmissionSuccess(false);
      }
    };

    return (
        <>
            <div className="form">
                <div className="container">
                    {error && <div className="backdrop" onClick={handleBackdropClick} />}
                    {submissionSuccess && <div className="backdrop" onClick={handlePreviewClick} />}
                    <form onSubmit={getdata}>
                        {/* Text inputs */}
                        <div className="personal-info">
                            <div className="sub-topic">
                                <p className="steps">step 1of 4</p>
                                <h1>Personal Information</h1>
                            </div>
                            <div className="name">
                                <input className='input-field' type="text" name="firstName" placeholder="First Name" value={user.firstName} autoComplete="off" required onChange={data} />
                                <input className='input-field' type="text" name="lastName" placeholder="Last Name" value={user.lastName} autoComplete="off" required onChange={data} require/>
                            </div>
                            <div className="addresses">
                                <input className='input-field' type="text" name="Email" placeholder="Email" value={user.Email} autoComplete="off" required onChange={data} require/>
                                <input className='input-field' type="text" name="Address" placeholder="Address" value={user.Address} autoComplete="off" required onChange={data} require/>
                            </div>
                            <div className="num">
                                <input className='input-field' type="number" name="phoneNumber" placeholder="Phone Number" value={user.phoneNumber} autoComplete="off" required onChange={data} require/>
                                <input className='input-field' type="number" name="bvn" placeholder="BVN" value={user.bvn} autoComplete="off" required onChange={data} require/>
                                <input className='input-field' type="number" name="nin" placeholder="NIN" value={user.nin} autoComplete="off" required onChange={data} require/>
                            </div>
                        </div>
                        
                            {/* File input */}
                        <div className="fileUpload">
                            <div className="sub-topic">
                                <p className="steps">step 2 of 4</p>
                                <h1>ID Verification</h1>
                            </div>
                            <div className="holder">
                                <p>Upload a vilid documents: Drivers license, Voters card or International Passport</p>
                                <input type="file" onChange={handleFileChange} require/>
                            </div>
                            
                        </div>

                        
                             {/* take selfie */}
                        <div className="photoupload">
                            <div className="sub-topic">
                                <p className="steps">step 3 of 4</p>
                                <h1>Include a photo</h1>
                            </div>
                            <div className="holder">
                                <p>Take or select a photo:</p>
                                <input type="file" name="photoInput" accept="image/*" capture="environment" onChange={handleFileChange} require/>
                            </div>
                        </div>
                       

                            {/* next of kin */}
                        <div className="nextofkin">
                            <div className="sub-topic">
                                <p className="steps">step 1of 4</p>
                                <h1>Next of Kin</h1>
                            </div>
                            <div className="name">
                                <input className='input-field' type="text" name="Next_of_kin_firstName" placeholder="First Name" value={user.Next_of_kin_firstName} autoComplete="off" required onChange={data} require/>
                                <input className='input-field' type="text" name="Next_of_kin_lastName" placeholder="Last Name" value={user.Next_of_kin_lastName} autoComplete="off" required onChange={data} require/>
                            </div>
                            <div className="addresses">
                                <input className='input-field' type="text" name="Next_of_kin_Email" placeholder="Email" value={user.Next_of_kin_Email} autoComplete="off" required onChange={data} require/>
                                <input className='input-field' type="text" name="Next_of_kin_Address" placeholder="Address" value={user.Next_of_kin_Address} autoComplete="off" required onChange={data} require/>
                            </div>
                            <div className="num">
                                <input className='input-field' type="number" name="Next_of_kin_phoneNumber" placeholder="Phone Number" value={user.Next_of_kin_phoneNumber} autoComplete="off" required onChange={data} require/>
                            </div>
                        </div>
                        

                        <button onClick={getdata}>Submit</button>
                    </form>
                    {error && (
                     <div className="error">
                       <p>{error}</p>
                     </div>
                    )}
                    {submissionSuccess && (
                        <div className="preview">
                          <h2>Submission Preview</h2>
                          <p>First Name: {user.firstName}</p>
                          <p>Last Name: {user.lastName}</p>
                          <p>Email: {user.Email}</p>
                          <p>Address: {user.Address}</p>
                          <p>Phone Number: {user.phoneNumber}</p>
                          <p>BVN: {user.bvn}</p>
                          <p>NIN: {user.nin}</p>
                          <h3>Next of Kin</h3>
                          <p>First Name: {user.Next_of_kin_firstName}</p>
                          <p>Last Name: {user.Next_of_kin_lastName}</p>
                          <p>Email: {user.Next_of_kin_Email}</p>
                          <p>Address: {user.Next_of_kin_Address}</p>
                          <p>Phone Number: {user.Next_of_kin_phoneNumber}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Form;
