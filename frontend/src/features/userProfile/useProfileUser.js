import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import userProfileService from "../../services/userProfile.service";
import { setUser } from "../auth/userAuth.slice";

export const useProfileUser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.Name || "",
        email: user.Email || "",
        phone: user.Phone || "",
      });
      setPreviewUrl(user.ProfileImage || null);
    }
  }, [user]);

  // --- Real-time Validation Logic ---
  const validateField = (name, value) => {
    let error = "";

    if (name === "fullName" && value.trim().length < 3) error = "Name too short";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email";

    // Phone check: required + 10 digits
    if (name === "phone") {
      if (!value) {
        error = "Phone number is required"; // Khali hone pe error
      } else if (value.length !== 10) {
        error = "Must be exactly 10 digits";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleInputChange = (field, value) => {
    let val = value;
    if (field === "fullName") val = value.replace(/[^a-zA-Z\s]/g, "");
    if (field === "phone") val = value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({ ...prev, [field]: val }));
    validateField(field, val); // Real-time check
  };

  const handleImageChange = (file) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File size must be < 2MB");
      setProfileImg(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleUpdate = async (e) => {
    if (e) e.preventDefault();

    // 1. Manually check all fields before sending
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name is required (min 3 chars)";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.phone || formData.phone.length !== 10) {
      newErrors.phone = "10-digit phone number is required";
    }

    // 2. Agar koi bhi error hai, toh state update karo aur aage mat badho
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Ye inline errors dikha dega
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      if (profileImg) data.append("profileImg", profileImg);

      const response = await userProfileService.updateProfile(data);
      if (response.status) {
        dispatch(setUser(response.data));
        toast.success(response.message || "Profile updated!");
        setProfileImg(null);
      }
    } catch (error) {
      // Agar backend se validation error aaye (e.g. Email already taken)
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  return { formData, handleInputChange, handleImageChange, previewUrl, loading, errors, handleUpdate, user };
};
