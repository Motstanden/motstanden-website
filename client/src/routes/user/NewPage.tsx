import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { UserGroup, UserRank, UserStatus } from 'common/enums';
import { NewUser } from 'common/interfaces';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { useTitle } from 'src/hooks/useTitle';
import { groupTVPair, profilePictureTVPair, rankTVPair, statusTVPair } from './Components';
import Stack from '@mui/material/Stack';

export function NewUserPage() {
    useTitle("Ny bruker")
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
            <NewUserForm />
        </Paper>
    )
}

function NewUserForm() {

    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [userRank, setUserRank] = useState<UserRank>(UserRank.ShortCircuit)
    const [userGroup, setUserGroup] = useState<UserGroup>(UserGroup.Contributor)
    const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.Active)
    const [startDate, setStartDate] = useState<Dayjs>(dayjs());
    const [profilePicture, setProfilePicture] = useState(profilePictureTVPair[0].value)

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
            endDate: null,

            // TODO ?
            capeName: "",
            phoneNumber: null,
            birthDate: null
        }
    }

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)

        const user = buildUser()

        //# TODO validate user

        let response = await fetch("/api/create-user", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })

        setIsSubmitting(false)
        if (response.ok) {
            window.location.reload() // TODO: Do something more than just refreshing the page
        }
    }

    const isNtnuMail = email.trim().toLowerCase().endsWith("ntnu.no")
    return (
        <form onSubmit={onSubmit}>
            <FormControl fullWidth >
                <Stack spacing={4} >
                    <TextField
                        label="Fornavn"
                        name="firstName"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <TextField
                        label="Mellomnavn"
                        name="middleName"
                        value={middleName}
                        onChange={e => setMiddleName(e.target.value)}
                        autoComplete="off"
                    />
                    <TextField
                        label="Etternavn"
                        name="lastName"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <TextField
                        label="E-post"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={isNtnuMail}
                        required
                        autoComplete="off"
                    />
                    {isNtnuMail && <Box color="error.main">Ntnu mail ikke tillat<br /></Box>}
                    <TextField
                        select
                        label="Rang"
                        name="userRank"
                        required
                        value={userRank}
                        onChange={(e) => setUserRank(e.target.value as UserRank)}
                    >
                        {rankTVPair.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                    </TextField>
                    <TextField
                        select
                        label="Rolle"
                        name="userGroup"
                        required
                        value={userGroup}
                        onChange={e => setUserGroup(e.target.value as UserGroup)}
                    >
                        {groupTVPair.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                    </TextField>
                    <TextField
                        select
                        label="Status"
                        name="userStatus"
                        required
                        value={userStatus}
                        error={userStatus === UserStatus.Inactive}
                        onChange={e => setUserStatus(e.target.value as UserStatus)}
                    >
                        {statusTVPair.map(item => item.value !== UserStatus.Inactive && (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                    </TextField>
                    <DatePicker
                        views={["year", "month"]}
                        label="Startet"
                        minDate={dayjs().year(2018).month(7)}
                        maxDate={dayjs()}
                        value={startDate}
                        onChange={newVal => setStartDate(newVal ?? dayjs())}
                        renderInput={(params) => <TextField {...params} required />}
                    />
                    <TextField
                        select
                        label="Profilbilde"
                        required
                        name="profilePicture"
                        value={profilePicture}
                        onChange={e => setProfilePicture(e.target.value)}
                    >
                        {profilePictureTVPair.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                    </TextField>
                    <Stack alignItems="center" spacing={4} sx={{pb: 6}} >
                        <img
                            src={`${window.location.origin}/${profilePicture}`}
                            alt={`Profilbilde for ny bruker: ${firstName}`}
                            style={{
                                maxWidth: "300px",
                                borderRadius: "50%",
                                textAlign: "center",
                            }} />
                        <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{ maxWidth: "300px"}}
                            endIcon={<PersonAddIcon />}
                        >Legg til bruker</Button>
                    </Stack>
                </Stack>
            </FormControl>
        </form>
    )
}
