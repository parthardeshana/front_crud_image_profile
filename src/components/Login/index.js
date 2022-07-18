import React from 'react';
import { useFormik } from 'formik';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: '',
            password: ''
        },
        onSubmit: values => {
            axios.post("http://localhost:9000/admin/login", values)
                .then((res) => {
                    console.log("reee", res.data.data.accessToken)
                    if (res.status === 200) {
                        localStorage.setItem("token", res.data.data.accessToken)
                        navigate('/product')
                    } else {
                        alert("username or password is incorrect ")
                    }
                })
                .catch((err) => console.log("err", err))
        },
    });
    return (
        <div style={{ width: "40%", margin: "150px auto" }} >
            <h1 style={{ textAlign: "center" }}>Log In</h1>
            <form onSubmit={formik.handleSubmit} >
                <TextField
                    style={{ margin: "5px auto" }}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    name='name'
                    label="name"
                    variant="outlined"
                    size='small'
                    fullWidth
                />
                <br />
                <TextField
                    style={{ margin: "5px auto" }}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    label="Password"
                    name='password'
                    variant="outlined"
                    size='small'
                    fullWidth
                />
                <br />
                <Button style={{ margin: "20px auto" }} variant="contained" type="submit" fullWidth>Log In </Button>
            </form>
        </div >
    );
};

export default Login