import PersonAddIcon from '@mui/icons-material/PersonAdd'
import {
    Button,
    MenuItem,
    Paper,
    Stack,
    TextField
} from "@mui/material"
import { useQueryClient } from '@tanstack/react-query'
import { NewUser } from 'common/interfaces'
import { isNtnuMail as checkIsNtnuMail, isNullOrWhitespace } from 'common/utils'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTitle } from 'src/hooks/useTitle'
import { postJson } from 'src/utils/postJson'
import { usersQueryKey } from './Queries'
import { profilePictureTVPair } from "./utils/TextValuePair"

export default function NewUserPage() {
    useTitle("Ny Bruker")
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
        
        const response = await postJson("/api/users", user, {alertOnFailure: true})

        if (response && response.ok) {
            const data: {userId: number} = await response.json() 
            await queryClient.resetQueries({queryKey: usersQueryKey})
            navigate(`/brukere/${data.userId}`, {replace: true})
        }

        setIsSubmitting(false)
    }

    const isNtnuMail = checkIsNtnuMail(email)
    const isDisabled = isSubmitting ||
                       isNullOrWhitespace(firstName) || 
                       isNullOrWhitespace(lastName) ||
                       isNullOrWhitespace(email) ||
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
                <img
                    src={`${window.location.origin}/${profilePicture}`}
                    alt={`Profilbilde for ny bruker: ${firstName}`}
                    style={{
                        maxWidth: "300px",
                        borderRadius: "50%",
                        textAlign: "center",
                    }} />
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
                <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={isDisabled}
                    style={{marginTop: "7em"}}
                    sx={{ maxWidth: "300px"}}
                    endIcon={<PersonAddIcon />}
                >
                    Legg til bruker
                </Button>
            </Stack>
        </form>
    )
}