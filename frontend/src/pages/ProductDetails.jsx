import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductDetails } from "../features/product/useProductDetails";
import { ProductGallery } from "../components/productDetails/ProductGallery";
import { ProductInfo } from "../components/productDetails/ProductInfo";
import { ProductCard } from "../components/home/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { cartActions } from "../features/cart/Cart.slice";
import { useCart } from "../features/cart/useCart";
import { ReminderLoginModal } from "../components/common/ReminderLoginModal";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: response, isLoading, error } = useProductDetails(slug);
  const { user } = useSelector((state) => state.auth);
  const { cartItems, addToCart, isAdding } = useCart();

  // Data Extraction
  const product = response?.data?.product;
  const variants = response?.data?.variants || [];
  const related = response?.data?.related || [];
  const reviews = response?.data?.reviews || [];
  const overall_rating = response?.data?.overall_rating || [];
  const rating_distribution = response?.data?.rating_distribution || [];

  // Local States
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  console.log("variants", variants);
  console.log("selectedVariant", selectedVariant);

  // ProductDetails.jsx ke andar

  // 👇 Ye check karega ki jo variant user ne select kiya hai, kya wo pehle se cart mein hai?
  const existingItem = cartItems?.items?.find((i) => String(i.product_id) === String(product?.ID) && String(i.variant_id) === String(selectedVariant?.ID));

  const isInCart = !!existingItem;

  // Effect: Jab data aaye, pehle variant ko default set kar do
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
      setSelectedImage(0); // Reset image to first one of new variant
    }
  }, [variants]);

  const handleAddToBag = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant first!");
      return;
    }
    if (isInCart) {
      dispatch(cartActions.setCartOpen(true)); // 👈 Ye sidebar khol dega
      return;
    }
    const cartItem = cartItems?.items.find((item) => item.variant_id === selectedVariant.ID);
    const currentInCart = cartItem ? cartItem.Quantity : 0;

    if (currentInCart + quantity > 5) {
      if (currentInCart >= 5) {
        toast.error("Cart limit reached! You already have 5 units in your bag.", {
          id: "cart-limit-toast",
        });
      } else {
        toast.error(`You can only add ${5 - currentInCart} more units. Total limit is 5.`, {
          id: "cart-limit-toast",
        });
      }
      return;
    }
    const priceVal = Number(selectedVariant.SellPrice || product.SellingPrice || 0);
    const mrpVal = Number(selectedVariant.Price || product.MRP || priceVal);
    const payload = {
      product_id: product.ID,
      productId: product.ID,
      variant_id: selectedVariant.ID,
      variantId: selectedVariant.ID,
      cart_id: selectedVariant.ID,
      Title: product.Title,
      title: product.Title,
      Price: priceVal,
      price: priceVal,
      SellingPrice: priceVal,
      MRP: mrpVal,
      mrp: mrpVal,
      Thumbnail: selectedVariant.images?.[0] || product.Thumbnail,
      thumbnail: selectedVariant.images?.[0] || product.Thumbnail,
      Slug: product.Slug,
      slug: product.Slug,
      Quantity: quantity,
      quantity: quantity,
      TotalStock: Number(selectedVariant.Stock || product.TotalStock || 10),
      AvailableQty: Number(selectedVariant.Stock || product.TotalStock || 10),
      Attributes: Array.isArray(selectedVariant.specs) ? selectedVariant.specs.map((s) => `${s.key}: ${s.value}`).join(", ") : "",
    };
    addToCart(payload);
  };
  const handleBuyNow = () => {
    if (!user) {
      setShowCheckoutModal(true);
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a variant first!");
      return;
    }
    // 🔥 Solution: Array ko String mein convert karo sirf order ke liye
    const variantSpecsString = Array.isArray(selectedVariant.specs) ? selectedVariant.specs.map((s) => `${s.key}: ${s.value}`).join(", ") : selectedVariant.specs || "";

    const buyNowItem = {
      variant_id: selectedVariant.ID,
      cart_id: Date.now(),
      Title: product.Title,
      Price: Number(selectedVariant.SellPrice),
      MRP: Number(selectedVariant.Price),
      Discount: selectedVariant?.Discount || 0,
      Quantity: quantity,
      GST: Number(product.GST || 18),
      Thumbnail: selectedVariant?.images?.[0] || product.Thumbnail,
      Attribute: variantSpecsString,
      Slug: product.Slug,
      isBuyNow: true,
    };

    navigate("/checkout", { state: { item: buyNowItem } });
  };
  console.log("result", selectedVariant);
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (error || !product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  // Calculate effective images (Smart Fallback: if selected variant has no images, use images from any variant of the same color)
  const activeColor = selectedVariant?.specs?.find((s) => s.key === "Color")?.value;
  const colorVariantWithImages = variants?.find(
    (v) => v.specs?.find((s) => s.key === "Color")?.value === activeColor && v.images?.length > 0
  );

  const displayImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : colorVariantWithImages?.images?.length > 0
      ? colorVariantWithImages.images
      : product?.Thumbnail
      ? [product.Thumbnail]
      : [];

  return (
    <div className="min-h-screen bg-white pb-5 pt-5 px-1 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
          {/* LEFT: Product Gallery */}
          <div className="lg:w-[42%]">
            <div className="lg:sticky lg:top-24">
              <ProductGallery
                selectedVariant={selectedVariant}
                images={displayImages}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                handleAddToCart={handleAddToBag}
                handleBuyNow={handleBuyNow}
                product={product}
                isInCart={isInCart}
              />
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:w-[58%]">
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              variants={variants}
              quantity={quantity}
              setQuantity={setQuantity}
              setSelectedImage={setSelectedImage}
              images={displayImages}
              selectedImage={selectedImage}
              handleAddToCart={handleAddToBag}
              handleBuyNow={handleBuyNow}
              reviews={reviews}
              rating_distribution={rating_distribution}
              overall_rating={overall_rating}
              isLoading={isLoading}
              isInCart={isInCart}
            />
          </div>
        </div>

        {/* RELATED SECTION */}
        {related.length > 0 && (
          <div className="mt-8 sm:mt-14 md:mt-20">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 md:mb-8">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {related.map((item, index) => {
                // When related products count is odd (like 5), hide the last odd item on mobile (< lg) so it renders as complete 2-item pairs (2x2)
                const isOddLastOnMobile = index === related.length - 1 && related.length % 2 !== 0;
                return (
                  <div key={item.ID} className={isOddLastOnMobile ? "hidden lg:block" : ""}>
                    <ProductCard item={item} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ReminderLoginModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} />
    </div>
  );
}
