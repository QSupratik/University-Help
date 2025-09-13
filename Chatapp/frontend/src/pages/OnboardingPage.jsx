import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";

const OnboardingPage = ()=>{
    const { authUser } = useAuthUser();
    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || "",
      });

      const { mutate: onboardingMutation, isPending } = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
          toast.success("Profile onboarded successfully");
          //After updating the user's profile data might change
          //React Query will refetch the data for the ["authUser"] query in the background.
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });

      const handleSubmit = (e)=>{
        e.preventDefault();
        onboardingMutation(formState);
      }

    return(
        <div>OnboardingPage</div>
    )
};

export default OnboardingPage;