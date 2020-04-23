import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import * as yup from 'yup'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import LockOpenIcon from '@material-ui/icons/LockOpen';


const StyledForm = styled.form`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
margin-top: 50px;`

const Form = () => {
  
    const formSchema = yup.object().shape({
        name: yup.string().required("Name is a required field.").min(2, 'minimum four characters').max(20, 'max twenty characters'), 
        email: yup.string().required().email("Must include valid Email here"),
        password: yup.string().required().min(6, "must be at least six characters"),
        checkbox: yup.boolean().oneOf([true], "please agree to terms of use"),
      });
  
  
    const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    checkbox: false,
  });



  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    password: "",
    checkbox: "",
  });

const [postRequestData, setPostRequestData] = useState([])
//this was just an array above. 

  useEffect(() => {
    

    formSchema.isValid(formState).then(valid => {
      console.log(valid)
        setSubmitButtonDisabled(!valid);
    });
  }, [formState]);

const inputChange = (event) => {
    event.persist();
    const validateChangeState = {
        ...formState,
        [event.target.name]: 
        event.target.name === "checkbox" ? event.target.checked : event.target.value
    };
       validateChange(event);
       setFormState(validateChangeState);
};


const validateChange = (event) => {
    
    yup.reach(formSchema, event.target.name).validate(event.target.value)
    .then(valid => {
        setValidationErrors({
            ...validationErrors,
            [event.target.name]: ""
        });
    }).catch((error) => {
        console.log(error)
        setValidationErrors({
            ...validationErrors,
            [event.target.name]: error.message
        })
    })



}


  const submitPostRequest =  (event) => {
    event.preventDefault();
    console.log('submitted');
    axios.post("https://reqres.in/api/users", formState).then(response => {
        setPostRequestData([...postRequestData, response.data]);
        console.log("success", response)
    }).catch((submissionError) => {
        console.log(submissionError.response)
    })
  
};

  return (
    <div>
      <StyledForm onSubmit={submitPostRequest}>
        <label htmlFor="nameBox"></label>
            <Input startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          } type="text" name="name" id="nameBox" placeholder="Name" value={formState.name} onChange={inputChange} />
            {validationErrors.name.length > 0 ? <p> {validationErrors.name}</p> : null}
            <label htmlFor="emailBox"></label>
            <Input startAdornment={
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          } type="email" name="email" id="emailBox" placeholder="email" value={formState.email} onChange={inputChange} />
            {validationErrors.email.length > 0 ? <p> {validationErrors.email}</p> : null}
           <label htmlFor="passwordBox"></label>
           <Input startAdornment={
            <InputAdornment position="start">
              <LockOpenIcon />
            </InputAdornment>
          } type="password" name="password" id="passwordBox" placeholder="Password" value={formState.password} onChange={inputChange} />
           {validationErrors.password.length > 0 ? <p> {validationErrors.password}</p> : null}
            <label htmlFor="checkboxBox">Agree to Terms</label>
            <Checkbox type="checkbox" name="checkbox" id="checkboxBox" value={formState.checkbox} onChange={inputChange} />
            {validationErrors.checkbox.length > 0 ? <p> {validationErrors.checkbox}</p> : null}

  <pre>{JSON.stringify(postRequestData, null, 5)}</pre>
                <Button variant="contained" color="primary" type="submit" disabled={submitButtonDisabled}>
                    Submit
                </Button>
      </StyledForm >
    </div>
  );
};

export default Form;

