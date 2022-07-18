import React, { useEffect, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { TextField, Button, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DrawerAppBar from './DrawerAppBar';
import * as Yup from 'yup';


const MyInput = ({ field, form, ...props }) => {
    return <TextField {...field} {...props} />;
};

const ProfileForm = () => {
    const [selectedData, setSelectedData] = useState({ name: '', price: '', profile_image: "", profile_base64: "" })
    const { id } = useParams();

    const [loader, setLoader] = useState(false)

    let btnName = ""
    if (id !== "null") {
        btnName = "Update"
    }

    useEffect(() => {
        if (id !== "null") {
            setLoader(true)
            axios.get(`https://crud-image-profile-node.herokuapp.com/product/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setLoader(false)
                    if (res.data.success) {
                        setSelectedData(res?.data?.data)
                    } else {
                        alert("Product does not matches ")
                    }
                })
                .catch((err) => console.log("err", err))
        }
    }, [id])

    const token = localStorage.getItem('token')

    const navigate = useNavigate();

    console.log("selectedData", selectedData && selectedData);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={selectedData}
            validationSchema={Yup.object(
                id ? {
                    name: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    price: Yup.number()
                        .max(1000, 'value Must be 1000 or less')
                        .required('Required'),
                } : {
                    name: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    price: Yup.number()
                        .max(1000, 'value Must be 1000 or less')
                        .required('Required'),
                    profile_image: Yup.mixed().required('A file is required')
                        .test('fileFormat', 'Please Enter valid image formate', (value) => {
                            return value && ['image/png', 'image/jpeg'].includes(value.type);
                        }),
                }
            )}
            onSubmit={(values) => {
                console.log("vall", values);
                if (btnName) {
                    setLoader(true)
                    axios.put(`https://crud-image-profile-node.herokuapp.com/product/${id}`, values,
                        { headers: { Authorization: `Bearer ${token}` } })
                        .then((res) => {
                            setLoader(false)
                            if (res.data.success) {
                                navigate('/product')
                            } else {
                                alert("Product name is Duplicate ")
                            }
                        })
                        .catch((err) => console.log("err", err))
                } else {
                    setLoader(true)
                    axios.post("https://crud-image-profile-node.herokuapp.com/product", values,
                        { headers: { Authorization: `Bearer ${token}` } })
                        .then((res) => {
                            setLoader(false)
                            if (res.data.success) {
                                navigate('/product')
                            } else {
                                alert("Product name is Duplicate ")
                            }
                        })
                        .catch((err) => console.log("err", err))
                }
            }
            }
        >
            {props => {
                const {
                    setFieldValue,
                    values
                } = props;

                return (<>
                    <DrawerAppBar />
                    {loader ? <Box sx={{ display: 'flex', justifyContent: "center" }}>
                        <CircularProgress />
                    </Box> :
                        <Form style={{ width: "80%", margin: "auto" }} >
                            <Field
                                component={MyInput}
                                name="name"
                                type="text"
                                style={{ margin: "5px auto" }}
                                label="Product Name"
                                variant="outlined"
                                size='small'
                                fullWidth />
                            <ErrorMessage name="name" />
                            <br />
                            <Field
                                component={MyInput}
                                name="price"
                                type="text"
                                style={{ margin: "5px auto" }}
                                label="Price"
                                variant="outlined"
                                size='small'
                                fullWidth />
                            <ErrorMessage name="price" />
                            <br />
                            {btnName ?
                                <img width="90" src={values.profile_image && values.profile_image} alt="" />
                                : <img width="90" src={values.profile_base64 && values.profile_base64} alt="" />
                            }
                            <input
                                name="profile_image"
                                type="file"
                                accept="image/*"
                                style={{ margin: "5px auto" }}
                                onChange={(e) => {
                                    var reader = new FileReader();
                                    reader.readAsDataURL(e.target.files[0]);
                                    reader.onloadend = function () {
                                        var base64data = reader.result;
                                        setFieldValue('profile_base64', base64data);
                                    }
                                    setFieldValue('profile_image', e.target.files[0]);
                                }}
                            />
                            <br />
                            <ErrorMessage name="profile_image" />
                            <Button variant="contained" type="submit" fullWidth>
                                {btnName ?
                                    "Update" : "Add"}
                            </Button>
                        </Form>}
                </>)
            }
            }
        </Formik >
    );
};

export default ProfileForm