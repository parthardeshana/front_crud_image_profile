import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import DrawerAppBar from './DrawerAppBar';
import { Box, Button, CircularProgress } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const Profile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const [posts, setPosts] = useState([]);
    const [loader, setLoader] = useState(false)

    const getPost = async () => {
        setLoader(true)
        let res = await axios.get("https://crud-image-profile-node.herokuapp.com/product",
            { headers: { Authorization: `Bearer ${token}` } })
        setLoader(false)
        let temp = res.data.data;
        let tempArr = []
        temp.forEach((e) => {
            let a = { ...e, id: e._id };
            tempArr.push(a)
        })
        setPosts(tempArr);
    }

    const deletePost = async (id) => {
        let res = await axios.delete(`https://crud-image-profile-node.herokuapp.com/product/${id}`,
            { headers: { Authorization: `Bearer ${token}` } })
        if (res.status) {
            getPost()
        } else {
            alert("something is wrong")
        }
    }

    useEffect(() => {
        getPost()
    }, [])


    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'price', headerName: 'Price', width: 150 },
        {
            field: "profile_image",
            headerName: "Profile",
            sortable: false,
            renderCell: (e) => {
                return (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <img width="60" src={e.value} alt="" />
                    </div>
                );
            },
        },
        {
            field: "id",
            headerName: "Actions",
            sortable: false,
            renderCell: (event) => {
                return (
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <DeleteIcon
                            style={{ margin: "0 5px" }}
                            onClick={() => {
                                deletePost(event.row.id)
                            }
                            }
                        />
                        <EditIcon
                            style={{ margin: "0 5px" }}
                            onClick={() => {
                                navigate(`/add-product/${event.row.id}`)
                            }
                            }
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <DrawerAppBar />
            <div style={{ height: 400, width: '80%', margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        onClick={() => navigate('/add-product/null')}
                        variant='contained'
                        style={{ margin: "10px 0" }}>Add Product</Button>
                </div>
                {loader ? <Box sx={{ display: 'flex', justifyContent: "center" }}>
                    <CircularProgress />
                </Box> :
                    <DataGrid
                        rows={posts && posts}
                        columns={columns}
                        pageSize={5}
                        disableSelectionOnClick={true}
                        rowsPerPageOptions={[10]}
                    />}
            </div>
        </>
    )
}

export default Profile