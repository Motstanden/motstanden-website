import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';

import { UserRank, UserGroup, UserStatus } from 'common/enums';
import { NewUser } from 'common/interfaces';
import React, { useState } from 'react';
import { PageContainer } from "src/layout/PageContainer";
import FormControl from '@mui/material/FormControl';
import { userGroupToPrettyStr, userRankToPrettyStr, userStatusToPrettyStr } from 'common/utils';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { groupTVPair, profilePictureTVPair, rankTVPair, statusTVPair } from './Components';

export function NewUserPage () {
    return (
        <Paper elevation={6} 
            sx={{
                px: 3, 
                py: 1, 
                maxWidth: "600px", 
                marginInline: "auto",
                marginTop: "20px"
            }}>
            <h1>Ny bruker</h1>
            <NewUserForm/>
        </Paper>
    )
}

function NewUserForm() {

    const [firstName, setFirstName]     = useState("")
    const [middleName, setMiddleName]   = useState("")
    const [lastName, setLastName]       = useState("")
    const [email, setEmail]             = useState("")
    const [userRank, setUserRank]       = useState<UserRank>(UserRank.ShortCircuit)
    const [userGroup, setUserGroup]     = useState<UserGroup>(UserGroup.Contributor)
    const [userStatus, setUserStatus]   = useState<UserStatus>(UserStatus.Active)
    const [startDate, setStartDate]     = useState<Dayjs>(dayjs());
    const [endDate, setEndDate]         = useState<Dayjs | null>(null)
    const [profilePicture, setProfilePicture] = useState(profilePictureTVPair[0].value)
    
    const [isInfoOk, setIsInfoOk] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const buildUser = (): NewUser => {
        return {
            email: email.trim().toLowerCase(),
            groupName: userGroup,
            rank: userRank,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            profilePicture: profilePicture,
            status: userStatus,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate?.format("YYYY-MM-DD") ?? null,

            // TODO ?
            capeName: "",
            phoneNumber: null,
            birthDate: null
        }
    }

    const onSubmit = async (event: React.FormEvent) => {
        console.log("Submitting")
        event.preventDefault()
        setIsSubmitting(true)

        const user = buildUser()

        //# TODO validate user
        console.log(user)
        let response = await fetch("/api/create-user", {
            method: "POST", 
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })  

        setIsSubmitting(false)
        if(response.ok) {
            window.location.reload() // TODO: Do something more than just refreshing the page
        }
    }

    const isNtnuMail = email.trim().toLowerCase().endsWith("ntnu.no")
    return (    
        <form onSubmit={onSubmit}>
            <FormControl fullWidth>
                <TextField
                    label="Fornavn"
                    name="firstName"
                    value={firstName}
                    onChange={ e => setFirstName(e.target.value)}
                    required
                    autoComplete="off"
                />
                <br/>
                <TextField 
                    label="Mellomnavn"
                    name="middleName"
                    value={middleName}
                    onChange={ e => setMiddleName(e.target.value)}
                    autoComplete="off"
                />
                <br/>
                <TextField
                    label="Etternavn"
                    name="lastName"
                    value={lastName}
                    onChange={ e => setLastName(e.target.value)}
                    required
                    autoComplete="off"
                />
                <br/>
                <TextField
                    label="E-post"
                    name="email"
                    type="email"
                    value={email}
                    onChange={ e => setEmail(e.target.value)}
                    error={isNtnuMail}
                    required
                    autoComplete="off"
                />
                {isNtnuMail && <Box color="error.main">Ntnu mail ikke tillat<br/></Box>}
                <br/>
                <TextField
                    select
                    label="Rang"
                    name="userRank"
                    required
                    value={userRank}
                    onChange={ (e) => setUserRank(e.target.value as UserRank)} 
                    >
                    { rankTVPair.map( item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                </TextField>
                <br/>
                <TextField
                    select
                    label="Rolle"
                    name="userGroup"
                    required
                    value={userGroup}
                    onChange={ e => setUserGroup(e.target.value as UserGroup)} 
                    >
                    { groupTVPair.map( item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                </TextField>
                <br/>
                <TextField
                    select
                    label="Status"
                    name="userStatus"
                    required
                    value={userStatus}
                    error={userStatus === UserStatus.Inactive}
                    onChange={ e => setUserStatus(e.target.value as UserStatus)} 
                    >
                    { statusTVPair.map( item => item.value !== UserStatus.Inactive && (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                </TextField>
                <br/>
                <DatePicker
                    views={["year", "month"]}
                    label="Startet"
                    minDate={dayjs().year(2018).month(7)}
                    maxDate={dayjs()}
                    value={startDate}
                    onChange={ newVal => setStartDate(newVal ?? dayjs())}
                    renderInput={(params) => <TextField {...params} required/>}
                />
                <br/>
                <DatePicker
                    views={["year", "month"]}
                    label="Sluttet"
                    minDate={dayjs().year(2018).month(7)}
                    maxDate={dayjs().add(6, "year")}
                    value={endDate}
                    onChange={ newVal => setEndDate(newVal)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <br/>
                <TextField 
                    select
                    label="Profilbilde"
                    required
                    name="profilePicture"
                    value={profilePicture}
                    onChange={ e => setProfilePicture(e.target.value)}
                >
                    { profilePictureTVPair.map( item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                </TextField>
                <br/>
                <br/>
                <Box sx={{textAlign: "center"}}>
                    <img 
                        src={`${window.location.origin}/${profilePicture}`} 
                        alt={`Profilbilde for ny bruker: ${firstName}`}
                        style={{
                            maxWidth: "300px",
                            borderRadius: "50%",
                            textAlign: "center",
                        }}/>
                    <br/>
                    <br/>
                    <FormControlLabel 
                        control={<Checkbox checked={isInfoOk} onClick={ e => setIsInfoOk(!isInfoOk)} />} 
                        label={<div style={{marginLeft: "5px" }}>All informasjon er riktig<br/>(Ingen vei tilbake)</div>}
                        />
                    <br/>
                    <br/>
                    <Button
                        variant="contained"
                        size="large"
                        type="submit"
                        disabled={isSubmitting || !isInfoOk}
                        sx={{maxWidth: "300px"}}
                        endIcon={<PersonAddIcon />}
                        >Legg til bruker</Button>
                </Box>
                <br/>
            </FormControl>
        </form>         
    )
}
