import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { UserGroup, UserRank, UserStatus } from 'common/enums';
import { NewUser } from 'common/interfaces';
import { isNullOrWhitespace, validateEmail } from 'common/utils';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { useTitle } from 'src/hooks/useTitle';
import { groupTVPair, profilePictureTVPair, rankTVPair, statusTVPair } from './Components';

export function NewUserPage() {
    useTitle("Ny bruker")
    return (
        <Paper elevation={6}
            sx={{
                px: 3,
                pt: 1,
                pb: 6,
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
    const [isValidEmail, setIsValidEmail] = useState(true)

    const onEmailBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
        if(!validateEmail(email) || isNtnuMail(email)) {
            setIsValidEmail(false)
        }
    }

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(e.target.value)
        if(!isValidEmail) 
            setIsValidEmail(true)
    }
    
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
            
            // TODO ?
            endDate: null,
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

    const isDisabled = isSubmitting ||
                       !isValidEmail ||
                       isNullOrWhitespace(firstName) || 
                       isNullOrWhitespace(lastName) 
    return (
        <form onSubmit={onSubmit}>
            <Stack spacing={4} alignItems="center">
                <TextField
                    label="Fornavn"
                    name="firstName"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    autoComplete="off"
                    fullWidth
                />
                <TextField
                    label="Mellomnavn"
                    name="middleName"
                    value={middleName}
                    onChange={e => setMiddleName(e.target.value)}
                    autoComplete="off"
                    fullWidth
                />
                <TextField
                    label="Etternavn"
                    name="lastName"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    autoComplete="off"
                    fullWidth
                />
                <TextField
                    label="E-post"
                    name="email"
                    value={email}
                    onChange={onEmailChange}
                    error={!isValidEmail}
                    required
                    onBlur={onEmailBlur}
                    autoComplete="off"
                    fullWidth
                    helperText={isValidEmail ? null : (isNtnuMail(email) ? "Ntnu-e-post ikke tillat" : "Ugyldig e-post")}
                />
                <TextField
                    select
                    label="Rang"
                    name="userRank"
                    required
                    value={userRank}
                    onChange={(e) => setUserRank(e.target.value as UserRank)}
                    fullWidth
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
                    fullWidth
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
                    fullWidth
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
                    renderInput={(params) => <TextField {...params} required fullWidth />}
                />
                <TextField
                    select
                    label="Profilbilde"
                    required
                    name="profilePicture"
                    value={profilePicture}
                    onChange={e => setProfilePicture(e.target.value)}
                    sx={{pb: 1}}
                    fullWidth
                >
                    {profilePictureTVPair.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
                </TextField>
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
                    disabled={isDisabled}
                    style={{marginTop: "3em"}}
                    sx={{ maxWidth: "300px"}}
                    endIcon={<PersonAddIcon />}
                >Legg til bruker</Button>
            </Stack>
        </form>
    )
}

function isNtnuMail(email: string) {
    return email.trim().toLowerCase().endsWith("ntnu.no")
}