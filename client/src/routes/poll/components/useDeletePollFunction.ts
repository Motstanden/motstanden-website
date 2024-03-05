import { useQueryClient } from "@tanstack/react-query";
import { Poll } from "common/interfaces";
import { useState } from "react";
import { postJson } from "src/utils/postJson";
import { pollBaseQueryKey } from "../Context";

export function useDeletePollFunction(poll: Poll) {
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

    const deletePoll = async () => {
        setIsDeleting(true);
        const response = await postJson(
            "/api/polls/delete",
            { id: poll.id },
            {
                alertOnFailure: true,
                confirmText: "Vil du permanent slette denne avstemningen?"
            }
        );
        if (response?.ok) {
            await queryClient.invalidateQueries({ queryKey: pollBaseQueryKey});
        }
        setIsDeleting(false);
    };

    return {
        isDeleting,
        deletePoll
    }
}