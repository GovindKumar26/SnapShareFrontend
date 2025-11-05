import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "./authSlice"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function SignupCompletePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user) // Get user from Redux
  const [avatarPreview, setAvatarPreview] = useState("") // For preview only

  const { register, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm({
    defaultValues: {
      bio: "",
      website: "",
      avatar: null
    }
  })

  const handleSkip = () => {
    navigate("/feed")
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setValue("avatar", file) // Set the file in react-hook-form
      
      // Create preview URL for display
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (formData) => {
    try {
      const userId = user?._id || user?.id // Backend returns 'id', MongoDB stores '_id'
      
      if (!userId) {
        toast.error("User not found. Please login again.")
        navigate("/login")
        return
      }

      // Create FormData for multipart upload
      const formDataToSend = new FormData()
      
      // Append optional fields only if they have values
      if (formData.bio) formDataToSend.append("bio", formData.bio)
      if (formData.website) formDataToSend.append("website", formData.website)
      if (formData.avatar) formDataToSend.append("avatar", formData.avatar)

      if (import.meta.env.DEV) {
        console.log("Sending profile data for user:", userId)
        console.log("FormData entries:", [...formDataToSend.entries()])
        console.log("Cookies:", document.cookie) // Debug: check if cookies exist
      }

      // Send to backend (don't set Content-Type, let browser set it with boundary)
      const res = await api.put(`/api/users/complete-profile/${userId}`, formDataToSend)

      // Update Redux with new user data
      dispatch(setUser(res.data))
      toast.success("Profile completed!")
      navigate("/feed")

    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error updating profile:", err)
        console.error("Error response:", err?.response)
        console.error("Error data:", err?.response?.data)
      }
      toast.error(err?.response?.data?.message || "Failed to update profile")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold text-primary">
            Complete Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-20 h-20">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} />
                ) : (
                  <AvatarFallback>U</AvatarFallback>
                )}
              </Avatar>
              <label className="text-sm text-muted-foreground cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                Change photo
              </label>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                placeholder="Tell us about yourself..."
                {...register("bio")}
              />
            </div>

            {/* Website */}
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                placeholder="https://yourwebsite.com"
                {...register("website")}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-3">
              <Button type="button" variant="outline" onClick={handleSkip}>
                Skip
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-linear-to-r from-[#3B82F6] to-[#8B5CF6] text-white disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
