// Import the necessary libraries
import React, { useState, useEffect, Component } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextUpdateField from "./TextUpdateField.js";
import axios from "axios";
import Cookies from "universal-cookie";
import Navbar from "../Dashboard/Navbar.js";

// Import Nav Bar
import TopNav from '../Dashboard/TopNav';
import MobileNav from '../Dashboard/MobileNav';

// obtain token from cookie
const cookies = new Cookies();
const token = cookies.get("TOKEN");

const feedbackMessages = {
  initial: "",
  invalid: "The artefact must have a valid name and a picture uploaded",
  valid: "Updating your artefact",
};

const EditPage = () => {
  
  const [feedback, setFeedback] = useState(feedbackMessages.initial);

  // id constant to send request based on the specific artefact id
  const { _id } = useParams();
  console.log({_id})

  const dummyData = {
    artefactName: "Rose",
    location: "Japan",
  };

  const initialState = {
    artefactName: "",
    artefactDate: "",
    location: "",
    description: "",
    artefactImg: "",
    memories: "",
    category:"",
    associated:""
  };

  async function updateArtefact(e) {
    // set configurations
    const configuration = {
      method: "patch",
      url: `https://sterlingfamilyartefacts.herokuapp.com/edit-artefact/${_id}`,
      data: {
        record,
      },
      headers: {
        Authorization: `Bearer ${token}`, // authorized route with jwt token
      },
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  }
  // NOT DONE YET
  function handleSubmit(e) {
    // Prevent the user from refreshing the page when they input "enter"
    e.preventDefault();
    console.log("here")
    if (!isValidInput(record)) {
      setFeedback(feedbackMessages.invalid);
      return;
    }
    updateArtefact();
    setFeedback(feedbackMessages.valid);
   
  }

  // React hook to change the state of record
  const [record, setRecord] = useState(initialState);

  // Hook to get the data
  const configuration = {
    method: "get",
    url: `http://localhost:5100/get-artefact/${_id}`,
    headers: {
      Authorization: `Bearer ${token}`, // authorized route with jwt token
    },
  };

  useEffect(function () {
    console.log("HELLO");
    async function updatePage() {
      try {
        const response = await axios(configuration);
        
        setRecord(response.data.result);
        console.log(JSON.stringify(response.data.re));
      } catch (error) {
        console.log(error);
      }
    }
    updatePage();
  }, []);

  // Change the state of the record object based on user input
  function handleChange(event) {
    setRecord({ ...record, [event.target.name]: event.target.value });
    console.log(record);
  }

  console.log({record});
  console.log("===========================================");
  console.log(record.category.category_name);
  console.log("===========================================");
  return (
    <>
      <TopNav />

      <div className="record-page">

        {/* The form that the user to send to database */}
        <form onSubmit={(e) => handleSubmit(e)}>
          <h2>Edit Artefact</h2>
          <div className="data-entry-fields">
            {/* TEXT DATA*/}
            <TextUpdateField handleChange={handleChange} initialData={record} cat ={record.category.category_name} per = {record.associated.person} />
            
            {/* Image Display */}
            <div className="data-entry-fields--image-upload">
              <label className='data-entry-fields--image-upload--description'>Artefact image</label>
              <div className='data-entry-fields--image-upload--upload-complete'>
                <img
                  src={record.artefactImg.imgURL}
                  alt="No Images have been Uploaded Yet"
                />
              </div>
            </div>
          </div>

          {/* This is the cancel button it just redirects to dashboard */}
          {/*<p>{feedback}</p>*/}

          <div className="response-button" id="button" >
            {/*
            <Link to={`/dashboard`}>
              <button className="response-button__cancel" type="submit">
                Cancel
              </button>
            </Link>
          */}
            <button className="response-button__submit" type="submit" >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );

  function isValidInput(data) {
    return data.artefactName !== "" && data.artefactImg !== "";
  }
};


export default EditPage;
