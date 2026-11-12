import React, { useRef, useState } from "react";
import { Star, ThumbsUp, ThumbsDown, CheckCircle2, X, Camera, Film } from "lucide-react";
import { getImageUrl } from "../../utils/image";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAddReview } from "../../features/review/useReview";
import { motion, AnimatePresence } from "framer-motion";

const ReviewSection = ({ product, overall_rating, reviews, rating_distribution, setShowLoginModal }) => {
  const [activeMedia, setActiveMedia] = useState(null);
  const [showRateForm, setShowRateForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  // Media States
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  console.log(reviews);
  const { mutate: submitReview, isPending: isLoading } = useAddReview(product?.Slug);
  console.log("Loading State:", isLoading);

  const handleReviewImageChange = (e) => {
    const files = Array.from(e.target.files);

    // 1. Check if maximum limit is already reached
    if (selectedImages.length >= 4) {
      return toast.error("Maximum limit reached. Only 4 images allowed.");
    }

    // 2. Check if the new selection exceeds the remaining slots
    if (selectedImages.length + files.length > 4) {
      const remaining = 4 - selectedImages.length;
      return toast.error(`You can only add ${remaining} more image(s).`);
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif", "image/gif"];

    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      return toast.error("Only JPG, PNG, WEBP, AVIF images allowed.");
    }

    setSelectedImages((prev) => [...prev, ...files]);
    toast.success(`${files.length} image(s) added successfully.`);
    selectedImages.forEach((img) => {
      console.log("sanni", img.name, img.type);
    });
  };

  // --- Handle Video Selection ---
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 1. Validate Video Type
    if (!file.type.startsWith("video/")) {
      return toast.error("Invalid format. Please select a video file.");
    }

    // 2. Size Check (50MB Limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return toast.error("Video size too large. Maximum limit is 50MB.");
    }

    setSelectedVideo(file);
    toast.success("Video added successfully.");
  };
  // --- Logic for Dynamic Progress Bars ---
  const getStarStats = (starLevel) => {
    const found = rating_distribution.find((item) => item.Rating === starLevel);
    const count = found ? found.total : 0;
    const percent = overall_rating?.total_reviews > 0 ? (count / overall_rating?.total_reviews) * 100 : 0;
    return { count, percent };
  };
  const handleSubmit = () => {
    if (!user) return toast.error("Please login first to post a review");
    if (userRating === 0) return toast.error("Please provide a star rating before submitting.");
    if (reviewText === "") return toast.error("Please write feedback before submitting.");
    const formData = new FormData();
    formData.append("PID", product?.ID);
    formData.append("Rating", userRating);
    formData.append("ReviewText", reviewText);

    selectedImages.forEach((img) => {
      formData.append("images[]", img);
    });

    // Video append karna
    if (selectedVideo) {
      formData.append("video", selectedVideo);
    }
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    // ✅ Mutate call karo callbacks ke saath
    submitReview(formData, {
      onSuccess: () => {
        // Jab API success hogi, tabhi modal band hoga
        setShowRateForm(false);
        setUserRating(0);
        setReviewText("");
        setSelectedImages([]);
        setSelectedVideo(null);
      },
      onError: () => {
        // Error aane par modal band mat karo taaki user retry kar sake
        console.error("Upload failed");
      },
    });
  };
  return (
    <div className="max-w-7xl mx-auto font-sans antialiased">
      <div className="bg-white">
        {/* --- SECTION 1: HEADER & STATS --- */}
        <div className="pb-6 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-black">Ratings & Reviews</h3>
            <div className="flex items-center gap-4">
              <div className="bg-green-700 text-white px-2 py-0.5 rounded-sm flex items-center gap-1 font-bold text-sm">
                {Math.round(overall_rating?.average_rating)} <Star size={12} fill="white" />
              </div>
              <p className="text-zinc-500 font-medium text-[14px]">
                {Math.round(overall_rating?.average_rating)} ratings and {overall_rating.total_reviews} reviews
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!user) {
                setShowLoginModal(true);
              } else if (!product?.has_purchased) {
                toast.error("Only verified buyers can rate this product.", {
                  icon: "🔒",
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });
              } else {
                setShowRateForm(true);
              }
            }}
            className="group relative flex items-center gap-2 px-8 py-3 bg-black text-white font-bold text-sm tracking-wide rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
          >
            <Star size={16} className="group-hover:rotate-12 transition-transform" />
            <span>Rate Product</span>
          </button>
        </div>

        {/* --- SECTION 2: DYNAMIC PROGRESS BARS & USER IMAGES --- */}
        <div className="py-6 border-b border-zinc-100 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Bars (Stats) */}
          <div className="space-y-2 max-w-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const { count, percent } = getStarStats(star);
              return (
                <div key={star} className="flex items-center gap-4 text-[12px]">
                  <span className="flex items-center gap-1 w-8 font-medium">
                    {star} <Star size={10} fill="black" />
                  </span>
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${star >= 3 ? "bg-green-600" : star === 2 ? "bg-yellow-400" : "bg-red-500"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-zinc-400 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Customer Images Gallery (Dynamic from all reviews) */}
          <div>
            <p className="text-[12px] font-bold text-zinc-500 mb-4 uppercase tracking-tight">Images uploaded by customers:</p>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {reviews
                .flatMap((r) => r.media || [])
                .slice(0, 10)
                .map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveMedia(m)}
                    className="w-20 h-20 rounded-sm border border-zinc-200 overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition-all"
                  >
                    {/* 🟢 Agar MediaType === 1 (Image) hai */}
                    {m.MediaType === 1 && <img src={getImageUrl(m.MediaUrl)} className="w-full h-full object-cover cursor-zoom-in" alt="review" />}
                    {/* 🟢 Agar MediaType === 2 (Video) hai */}
                    {m.MediaType === 2 && (
                      <div className="relative w-full h-full bg-black">
                        <video className="w-full h-full object-cover" src={getImageUrl(m.MediaUrl)} muted />
                        {/* Ek chota sa play icon dikha sakte ho center mein */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all cursor-pointer">
                          <div className="bg-white/80 rounded-full p-1.5">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="black">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 3: INDIVIDUAL REVIEWS (Mapped from Array) --- */}
        {/* Review List Container with Internal Scroll */}
        <div className="divide-y divide-zinc-100 max-h-[300px] overflow-y-auto no-scrollbar">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.ID} className="p-6 space-y-3 hover:bg-zinc-50/30 transition-colors">
                {/* ... tumhara baaki review code ... */}
                <div className="flex items-center gap-3">
                  <div className={`text-white text-[10px] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 font-bold ${review.Rating >= 3 ? "bg-green-700" : "bg-red-500"}`}>
                    {review.Rating} <Star size={10} fill="white" />
                  </div>
                  <p className="font-bold text-[14px] text-black uppercase">{review.Rating >= 4 ? "Excellent Product" : "Satisfactory"}</p>
                </div>

                <p className="text-zinc-700 text-[14px] leading-relaxed max-w-3xl">{review.ReviewText || "No comment provided."}</p>

                {/* Review Media (Images & Videos) */}
                <div className="flex gap-2 mt-2">
                  {review.media?.map((m) => (
                    <div key={m.ID} onClick={() => setActiveMedia(m)} className="relative w-16 h-16 rounded-sm overflow-hidden border border-zinc-100 bg-zinc-50">
                      {/* 🟢 Condition 1: Agar Image hai (MediaType 1) */}
                      {m.MediaType === 1 ? (
                        <img src={getImageUrl(m.MediaUrl)} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" alt="review-img" />
                      ) : (
                        /* 🔵 Condition 2: Agar Video hai (MediaType 2) */
                        <div className="relative w-full h-full group cursor-pointer">
                          <video src={getImageUrl(m.MediaUrl)} className="w-full h-full object-cover" muted playsInline />
                          {/* Video Indicator (Play Icon) taaki user ko pata chale ye video hai */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                            <div className="bg-white/90 rounded-full p-1 shadow-sm">
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="black">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-zinc-500">
                    <span className="font-bold text-zinc-800">{review.Name}</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-zinc-400" />
                      <span>Certified Buyer</span>
                    </div>
                    <span>{new Date(review.CreatedDtTm).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-zinc-400">No reviews yet. Be the first to rate!</div>
          )}
        </div>
      </div>
      {/* --- MODAL: Rate Product (Logic already exists) --- */}
      {/* --- SECTION 4: RATE PRODUCT MODAL (FUNCTIONAL) --- */}
      {/* --- PREMIUM RATE PRODUCT MODAL --- */}
      <AnimatePresence>
        {showRateForm && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoading && setShowRateForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
              <div className="p-5 md:p-7 overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 md:mb-6">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-black tracking-tight">Share Your Experience</h4>
                    <p className="text-zinc-500 text-xs md:text-sm mt-0.5">Your feedback helps millions of shoppers.</p>
                  </div>
                  <button
                    onClick={() => setShowRateForm(false)}
                    className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
                  >
                    <X size={22} className="text-zinc-400" />
                  </button>
                </div>

                <div className="space-y-5 md:space-y-6">
                  {/* Premium Star Selector */}
                  <div className="text-center space-y-2">
                    <div className="flex justify-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <motion.button
                          key={num}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isLoading}
                          onClick={() => setUserRating(num)}
                          className="relative p-0.5"
                        >
                          <Star
                            size={38}
                            fill={userRating >= num ? "currentColor" : "none"}
                            className={`transition-all duration-300 ${userRating >= num
                              ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                              : "text-zinc-200 hover:text-zinc-300"
                              }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {userRating === 5 ? "Excellent!" : userRating === 4 ? "Very Good" : userRating === 3 ? "Good" : userRating === 2 ? "Fair" : userRating === 1 ? "Poor" : "Select Rating"}
                    </p>
                  </div>

                  {/* Review Text */}
                  <div className="relative group">
                    <textarea
                      disabled={isLoading}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      maxLength={500}
                      placeholder="Tell us what you liked or disliked..."
                      className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl p-4 text-sm min-h-[100px] outline-none focus:border-black transition-all resize-none group-hover:bg-white"
                    />
                    <div className="absolute bottom-3 right-4 text-[9px] font-black tabular-nums tracking-widest transition-colors">
                      <span className={reviewText.length >= 500 ? "text-primary" : "text-zinc-300"}>
                        {reviewText.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Media Upload Area */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Add Photos & Video</span>
                      <span className="text-[9px] text-zinc-400 font-medium">Max: 4 Images, 1 Video</span>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                      {/* Media Slots */}
                      {selectedImages.map((img, i) => (
                        <motion.div
                          layout
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-zinc-100 shrink-0 shadow-sm"
                        >
                          <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="preview" />
                          {!isLoading && (
                            <button
                              onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-white p-1 rounded-lg hover:bg-black transition-all"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </motion.div>
                      ))}

                      {selectedVideo && (
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-100 bg-blue-50 flex items-center justify-center shrink-0 shadow-sm"
                        >
                          <Film size={20} className="text-blue-500" />
                          {!isLoading && (
                            <button
                              onClick={() => setSelectedVideo(null)}
                              className="absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </motion.div>
                      )}

                      {/* Add Button (If slots remaining) */}
                      {(selectedImages.length < 4 || !selectedVideo) && (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => {
                            if (selectedImages.length < 4) fileInputRef.current.click();
                            else if (!selectedVideo) videoInputRef.current.click();
                          }}
                          className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-1 hover:border-black hover:bg-zinc-50 transition-all shrink-0 group disabled:opacity-50"
                        >
                          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <X size={14} className="rotate-45" />
                          </div>
                        </button>
                      )}
                    </div>

                    <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleReviewImageChange} />
                    <input type="file" ref={videoInputRef} hidden accept="video/*" onChange={handleVideoChange} />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowRateForm(false)}
                      disabled={isLoading}
                      className="flex-1 py-3.5 font-bold text-zinc-400 hover:text-black transition-colors disabled:opacity-30 text-sm"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-[2] py-3.5 bg-black text-white font-bold rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 text-sm"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                          <span>UPLOADING</span>
                        </div>
                      ) : (
                        "POST REVIEW"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* --- LIGHTBOX MODAL --- */}
      {activeMedia && (
        <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Close Button */}
          <button onClick={() => setActiveMedia(null)} className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={32} />
          </button>

          <div className="max-w-4xl w-full max-h-[80vh] flex items-center justify-center">
            {activeMedia.MediaType === 1 ? (
              // 🟢 Badi Image dikhao
              <img src={getImageUrl(activeMedia.MediaUrl)} className="max-w-full max-h-[80vh] object-contain shadow-2xl" alt="Review Full" />
            ) : (
              // 🔵 Bada Video play karo
              <video src={getImageUrl(activeMedia.MediaUrl)} controls autoPlay className="max-w-full max-h-[80vh] shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
