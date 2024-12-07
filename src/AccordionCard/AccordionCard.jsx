import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from "@mui/styles";
import celebritiesdata from '../services/celebrities.json'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, InputAdornment, OutlinedInput } from '@mui/material';


const useStyles = makeStyles({
    accordionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    expandIcon: {
        cursor: 'pointer',
    },
    personDetailsContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        position: 'relative',
        boxSizing: 'border-box'
    },
    middleElement: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
    },
    eachCharacter: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputField: {
        borderRadius: '10px',
        outline: 'none',
        border: 'thin solid lightgray',
        padding: '8px 5px',
        width: 'min-content',
        maxWidth: '150px'
    },
    textarea: {
        borderRadius: '10px',
        padding: "8px 5px",
        border: 'thin solid lightgray',
    },
    label: {
        color: '#7e7e80',
        marginBottom: '5px'
    }

})
function AccordionCard() {
    const classes = useStyles()
    const [data, setData] = useState(celebritiesdata)
    const [backupData, setBackupData] = useState(celebritiesdata);
    const [id, setId] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editedData, setEditedData] = useState(null);

    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }

    function handleCancelClick() {
        setData(backupData);
        setId(null);
        setEditedData(null);
    };

    function handleEditClick(id) {
        setId(id);
        setBackupData(data);
        setEditedData(data.find(item => item.id === id));
    }

    function handleSaveClick() {
        setId(null);
        setBackupData(data);
        setEditedData(null);

    };
    function handleInputClick(event) {
        event.stopPropagation();
    };
    function handleDeleteClick(id) {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };
    function handleCancelDelete() {
        setOpenDeleteDialog(false);
        setDeleteId(null);
    };

    function handleConfirmDelete() {
        setData((prevData) => prevData.filter((item) => item.id !== deleteId));
        setOpenDeleteDialog(false);
        setDeleteId(null);
    };

    function onFieldChange(e) {
        const { name, value } = e.target;

        setData((prevData) =>
            prevData.map((item) => {
                if (item.id === id) {
                    if (name === 'fullName') {
                        const [first, ...rest] = value.split(' ');
                        const last = rest.join(' ');
                        return { ...item, first, last };
                    }
                    return { ...item, [name]: value };
                }
                return item;
            })
        );
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    function hasChanges() {
        if (!editedData) return false;
        const fields = ['first', 'last', 'dob', 'gender', 'country', 'description'];
        for (let field of fields) {
            if (editedData[field] === "") {
                return false;
            }
        }
        const currentItem = backupData.find(item => item.id === id);
        return currentItem.first !== editedData.first ||
            currentItem.last !== editedData.last ||
            currentItem.dob !== editedData.dob ||
            currentItem.gender !== editedData.gender ||
            currentItem.country !== editedData.country ||
            currentItem.description !== editedData.description;

    }


    function handleSearch(event) {
        const searchValue = event.target.value;
        const filteredData = celebritiesdata.filter(item => item.first.toLowerCase().includes(searchValue.toLowerCase()) || item.last.toLowerCase().includes(searchValue.toLowerCase()));
        setData(filteredData);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '20px', flexDirection: 'column', gap: '20px' }}>
            <OutlinedInput
                id="outlined-adornment-weight"
                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                sx={{
                    width: '500px',
                    borderRadius: '20px',
                }}
                onChange={(e) => handleSearch(e)}
            />
            {data.length > 0 &&
                data.map((item, i) => {
                    return (
                        <Accordion key={item.id} sx={{
                            width: '500px', borderRadius: '20px', border: ' thin solid lightgray', '&:first-of-type': {
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            },
                            '&:last-of-type': {
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20,
                            },
                            '::before': {
                                content: 'none',
                            },
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"

                            >

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={item.picture} alt="profile_image" style={{ borderRadius: '50%' }} />
                                    {id == item.id ? <input onClick={handleInputClick} type="text" value={`${item.first} ${item.last}`} name='fullName' onChange={onFieldChange} className={classes.inputField} /> : <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                        {`${item.first} ${item.last}`}
                                    </span>
                                    }
                                </div>

                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classes.personDetailsContainer} >
                                    <div className={classes.eachCharacter}>
                                        <span className={classes.label}>
                                            Age
                                        </span>
                                        {id == item.id ? <input type="date" name='dob' value={item.dob} onChange={onFieldChange} className={classes.inputField} /> : <span>
                                            {calculateAge(item.dob) + ' years'}
                                        </span>
                                        }
                                    </div>
                                    <div className={`${classes.eachCharacter} ${classes.middleElement}`}>
                                        <span className={classes.label}>
                                            Gender
                                        </span>
                                        {
                                            id == item.id ?
                                                <select
                                                    className={classes.inputField}
                                                    id="dropdown"
                                                    value={item.gender}
                                                    name='gender'
                                                    onChange={onFieldChange}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Trasgender">Transgender</option>
                                                    <option value="Rather not say">Rather not say</option>
                                                    <option value="Other">Other</option>


                                                </select> :
                                                <span style={{ textTransform: 'capitalize' }}>
                                                    {item.gender}
                                                </span>

                                        }
                                    </div>
                                    <div className={classes.eachCharacter}>
                                        <span className={classes.label}>
                                            Country
                                        </span>
                                        {id == item.id ? <input type="text" name='country' onKeyPress={(e) => {

                                            if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }} value={item.country} onChange={onFieldChange} className={classes.inputField} /> : <span style={{ textTransform: 'capitalize' }}>
                                            {item.country}
                                        </span>
                                        }

                                    </div>
                                </div>
                                <div style={{ padding: '10px 0px' }}>
                                    <div className={classes.label}>Description</div>
                                    {
                                        id == item.id ?
                                            <textarea rows="7"
                                                cols={"60"}
                                                value={item.description} name='description' onChange={onFieldChange} className={classes.textarea} />
                                            :
                                            <span>
                                                {item.description}
                                            </span>}
                                </div>
                                {
                                    id == item.id ?
                                        (<div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                                            <IconButton style={{ cursor: 'pointer', color: '#ff6740' }} onClick={handleCancelClick}>
                                                <CancelOutlinedIcon />
                                            </IconButton>
                                            <IconButton disabled={!hasChanges()} style={{ cursor: 'pointer', color: hasChanges() ? '#68c23e' : 'gray' }} onClick={handleSaveClick}>
                                                <CheckCircleOutlineOutlinedIcon />
                                            </IconButton>
                                        </div>
                                        )
                                        :
                                        (
                                            <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                                                <IconButton style={{ cursor: 'pointer', color: '#ff6740' }} onClick={() => handleDeleteClick(item.id)}><DeleteOutlineIcon /></IconButton>
                                                <IconButton style={{ cursor: 'pointer', color: '#2596be' }} onClick={() => handleEditClick(item.id)}>
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                            </div>
                                        )}
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
            {!data.length && <span>No User Found!</span>}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                fullWidth
            >
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} variant="outlined" sx={{ color: '#000', border: 'thin solid lightgray', textTransform: 'none' }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ backgroundColor: '#ff3500', textTransform: 'none' }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default AccordionCard