import React, { useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DrawerAppBar from './DrawerAppBar';
import * as Yup from 'yup';


const MyInput = ({ field, form, ...props }) => {
    return <TextField {...field} {...props} />;
};

const ProfileForm = () => {
    const token = localStorage.getItem('token')

    const [myImage, setmyImage] = useState("")
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{ name: '', price: '', profile_image: "", profile_base64: "" }}
            validationSchema={Yup.object({
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
            })}
            onSubmit={values => {
                axios.post("http://localhost:9000/product", values,
                    { headers: { Authorization: `Bearer ${token}` } })
                    .then((res) => {
                        if (res.data.success) {
                            navigate('/product')
                        } else {
                            alert("Product name is Duplicate ")
                        }
                    })
                    .catch((err) => console.log("err", err))
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

                        <img width="90" src={values.profile_base64 && values.profile_base64} alt="" />
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
                        <Button variant="contained" type="submit" fullWidth>Add </Button>
                    </Form>
                </>)
            }
            }
        </Formik >
    );
};

export default ProfileForm