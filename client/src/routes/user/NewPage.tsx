import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
    Button,
    MenuItem,
    Paper,
    Stack,
    TextField
} from "@mui/material";
import { NewUser } from 'common/interfaces';
import { isNtnuMail as checkIsNtnuMail, isNullOrWhitespace } from 'common/utils';
import React, { useState } from 'react';
import { useTitle } from 'src/hooks/useTitle';
import { profilePictureTVPair } from './Components';
import { useQueryClient } from '@tanstack/react-query';
import { userListQueryKey } from './Context';
import { useNavigate } from 'react-router-dom';

export default function NewUserPage() {
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
            <h1 style={{marginBottom: "1em"}}>Ny bruker</h1>
            <NewUserForm />
        </Paper>
    )
}

function NewUserForm() {

    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [profilePicture, setProfilePicture] = useState(profilePictureTVPair[0].value)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const buildUser = (): NewUser => {
        return {
            email: email.trim().toLowerCase(),
            firstName: firstName.trim(),
            middleName: middleName.trim(),
            lastName: lastName.trim(),
            profilePicture: profilePicture,
        }
    }

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)
        const user = buildUser()
        const response = await fetch("/api/create-user", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })

        setIsSubmitting(false)
        if (response.ok) {
            const data: {userId: number} = await response.json() 
            await queryClient.invalidateQueries(userListQueryKey)
            navigate(`/medlem/${data.userId}`)
        }
    }

    const isNtnuMail = checkIsNtnuMail(email)
    const isDisabled = isSubmitting ||
                       isNullOrWhitespace(firstName) || 
                       isNullOrWhitespace(lastName) ||
                       isNtnuMail
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
                    onChange={e => setEmail(e.target.value)}
                    error={isNtnuMail}
                    required
                    autoComplete="off"
                    fullWidth
                    helperText={isNtnuMail ? "Ntnu-e-post ikke tillat" : null }
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
                >
                    Legg til bruker
                </Button>
            </Stack>
        </form>
    )
}

function isNtnuMail(email: string) {
    return email.trim().toLowerCase().endsWith("ntnu.no")
}