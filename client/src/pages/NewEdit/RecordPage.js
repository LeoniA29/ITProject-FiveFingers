/**
 * @fileoverview Implementation of the Add-artefact page
 * Uses:
 * - React for rendering HTML
 * - Axios for getting information from the serverside
 * - FileBase for getting images from the user
 * - React Router for handling client-side routes
 * - Universal Cookie for handling browser cookies and validating logins
 */

// Imports of packages
import React, { useState, useEffect } from "react";

// Imports of local components
import Navbar from "../../components/Navbar";
import DataEntryFields from "./DataEntryFields/DataEntryFields";
import RecordButtons from "./RecordButtons/RecordButtons";

// Imports of local utils
import { postArtefact } from "../../utils/dataHandler";

// Style-based imports
import "./RecordPage.scss";

// Imports of local utils
import { getFullViewPromise } from "../../utils/dataHandler";

// Feedback states for notifying the user with what is going on when they
// choose to add an artefact
/** {{initial: string, invalid: string, valid: string}} */
const feedbackMessages = {
  initial: "",
  invalid: "The artefact must have a valid name and a picture uploaded",
  valid: "Updating your artefact",
};

/**
 * The component that contains the form data, stores the added information
 * validates it, and then uploads it to the database
 * @return {React.Component}
 */
function EditForm() {
  // State to update the recordData of the artefact
  /** ?{{
   *     _id: string,
   *     artefactName: string,
   *     description: string,
   *     memories: string,
   *     location: string,
   *     artefactImg: {{
   *        imgURL: string,
   *        publicID: string
   *     }},
   *     associated: {{
   *        _id: string,
   *        person: string
   *     }},
   *     category: {{
   *        _id: string,
   *        category_name: string
   *     }}
   *  }} */
  const [recordData, setRecordData] = useState(null);

  /**
   * After rendering the basic component (without data), it calls the
   * `getRecord` function to fetch and set the data accordingly.
   */
  useEffect(function () {
    let id = window.location.href.split("/").pop();
    console.log(id);
    getFullViewPromise(id)
      .then((response) => {
        setRecordData(response.data.result);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  // Prevent the 'Enter' key from cancelling the artefact submission
  const /** callback */ checkKeyDown = (e) => {
      if (e.code === "Enter") e.preventDefault();
    };

  // Initialize the navigate function
  const /** string */ [feedback, setFeedback] = useState(
      feedbackMessages.initial
    );

  let recordName,
    recordImg,
    recordDescription,
    recordMemories,
    recordLocation,
    recordPerson,
    recordCategory = null;
  if (recordData) {
    console.log(recordData);
    recordName = recordData.artefactName;
    recordImg = recordData.artefactImg.imgURL;
    recordDescription = recordData.description;
    recordMemories = recordData.memories;
    recordLocation = recordData.location;
    recordPerson = recordData.associated.person;
    recordCategory = recordData.category.category_name;
  }

  // The JSON object that is being constantly updated and sent
  /** ?{{
   * artefactName: string,
   * artefactDate: string,
   * location: string,
   * description: string,
   * category: string,
   * associated: string,
   * artefactImg: string,
   *  }} */
  let initialState = {
    artefactName: " ",
    location: " ",
    description: " ",
    category: " ",
    associated: " ",
    artefactImg: " ",
    memories: " ",
  };

  // React hook to change the state of record
  const [record, setRecord] = useState(initialState);


  if (recordData) {
    console.log("change");
    record.artefactName = recordData.artefactName;
    record.location = recordData.location;
    record.description = recordData.description;
    record.category = recordData.category.category_name;
    record.associated = recordData.associated.person;
    record.artefactImg = recordData.artefactImg.imgURL;
    record.memories = recordData.memories;

    console.log("INITIAL STATE");
    console.log(record);
  }

  /**
   * Obtains the entered data, checks if it is valid, and if it is, uploads it
   * to the database
   */
  function handleSubmit(e) {
    // Prevent the user from refreshing the page when they input "enter"
    e.preventDefault();

    // Prevents the user from submitting any invalid input
    if (!isValidInput(record)) {
      setFeedback(feedbackMessages.invalid);
      return;
    }

    setFeedback(feedbackMessages.valid);
    /**
     * Sends the validated data to the MongoDB database
     * @param e The javascript event
     */
    async function recordArtefact(e) {
      // set configurations
      postArtefact(record)
        .then((result) => {
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.log(error);
        });
    }

    recordArtefact();
  }

  /**
   * Change the state of the record object based on user input
   */
  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    console.log({ name, value });
    setRecord({ ...record, [event.target.name]: event.target.value });
    console.log("CHANGEs");
    console.log(record);
  }

  // Return an HTML of the Record Page
  return (
    <>
      <Navbar />
      <div className="record-page">
        {/* The form that the user to send to database */}
        <form
          onSubmit={(e) => handleSubmit(e)}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <h1>Edit Artefact</h1>
          <DataEntryFields
            handleChange={handleChange}
            record={record}
            setRecord={setRecord}
            artefactDetails={recordData}
          />

          {/* This is the cancel button it just redirects to dashboard */}
          <p className="feedback">{feedback}</p>
          <RecordButtons />
        </form>
      </div>
    </>
  );
}

/**
 * Checks if the entered data has the two required fields
 * @param data The data that is being submitted
  /** ?{{
    * artefactName: string,
    * artefactDate: string,
    * location: string,
    * description: string,
    * category: string,
    * associated: string,
    * artefactImg: string,
    *  }}
  */
function isValidInput(data) {
  return data.artefactName !== "" && data.artefactImg !== "";
}

export default EditForm;
