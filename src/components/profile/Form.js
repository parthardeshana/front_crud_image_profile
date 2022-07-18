import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik';
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
            initialValues={{ name: '', price: '', profile_image: {} }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Required'),
                price: Yup.string()
                    .max(20, 'Must be 20 characters or less')
                    .required('Required'),
            })}
            onSubmit={values => {
                console.log("val :::", values)
                axios.post("https://crud-image-profile-node.herokuapp.com/product", values,
                    { headers: { Authorization: `Bearer ${token}` } })
                    .then((res) => {
                        console.log("reee", res.data)
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
                    setFieldValue
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
                        <br />
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
                                    setFieldValue('profile_image', base64data);
                                }
                            }}
                        />
                        <Button variant="contained" type="submit" fullWidth>Add </Button>
                    </Form>
                </>)
            }
            }
        </Formik >
    );
};


export default ProfileForm






   // onChange={(e) => {
                    //     let ans = e.target.files[0].type === 'image/jpeg';
                    //     // setFieldValue('profile_pic', e.target.files[0]);
                    //     var reader = new FileReader();
                    //     reader.readAsDataURL(e.target.files[0]);
                    //     reader.onloadend = function () {
                    //         var base64data = reader.result;
                    //         setmyImage(base64data)
                    //     }
                    //     console.log("aaaaaaaaa:::", e.target.files[0].type, URL.createObjectURL(e.target.files[0]))
                    // 