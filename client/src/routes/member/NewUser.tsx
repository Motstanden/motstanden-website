import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';

import { UserRank, UserGroup } from 'common/enums';
import { NewUser } from 'common/interfaces';
import React, { useState } from 'react';
import { PageContainer } from "src/layout/PageContainer";
import FormControl from '@mui/material/FormControl';
import { userGroupToPrettyStr, userRankToPrettyStr } from 'common/utils';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';

export function NewUserPage () {
    return (
        <PageContainer>
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
        </PageContainer>
    )
}

function NewUserForm() {

    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [userRank, setUserRank] = useState<UserRank>(UserRank.ShortCircuit)
    const [userGroup, setUserGroup] = useState<UserGroup>(UserGroup.Contributor)
    const [profilePicture, setProfilePicture] = useState("files/private/profilbilder/boy.png")
    const [isInfoOk, setIsInfoOk] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const buildUser = (): NewUser => {
        return {
            email: email,
            groupName: userGroup,
            rank: userRank,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            profilePicture: profilePicture,
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
            // window.location.reload() // TODO: Do something more than just refreshing the page
        }
    }
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
                    required
                    autoComplete="off"
                />
                <br/>
                <TextField
                    select
                    label="Rang"
                    name="userRank"
                    value={userRank}
                    onChange={ (e) => setUserRank(e.target.value as UserRank)} 
                    >
                    { userRankValues.map( item => (<MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>))}
                </TextField>
                <br/>
                <TextField
                    select
                    label="Rolle"
                    name="userGroup"
                    value={userGroup}
                    onChange={ e => setUserGroup(e.target.value as UserGroup)} 
                    >
                    { userGroupValues.map( item => (<MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>))}
                </TextField>
                <br/>
                <TextField 
                    select
                    label="Profilbilde"
                    name="profilePicture"
                    value={profilePicture}
                    onChange={ e => setProfilePicture(e.target.value)}
                >
                    { profilePictures.map( item => (<MenuItem key={item.url} value={item.url}>{item.name}</MenuItem>))}
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

const userRankValues = Object.keys(UserRank).map( (rankStr: string) => { 
    const rank = UserRank[rankStr as keyof typeof UserRank]
    return {value: rank, name: userRankToPrettyStr(rank) }
})

const userGroupValues = Object.keys(UserGroup).map( (groupStr: string) => { 
    const group = UserGroup[groupStr as keyof typeof UserGroup]
    return {value: group, name: userGroupToPrettyStr(group) }
})

const profilePictures = [
    {
        name: "Gutt",
        url: "files/private/profilbilder/boy.png" 
    },
    {
        name: "Jente",
        url: "files/private/profilbilder/girl.png" 
    }
]