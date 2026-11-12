import { createSlice } from "@reduxjs/toolkit";

// Initial load with sanitization (remove broken legacy entries that had missing data)
const loadSanitizedCart = () => {
  try {
    const raw = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(raw)) return [];
    // Keep items that have at least an identifier and a price or title
    return raw.filter(
      (item) =>
        (item.variant_id || item.variantId || item.product_id || item.productId || item.cart_id) &&
        (item.Price || item.price || item.SellingPrice || item.Title || item.title)
    );
  } catch {
    return [];
  }
};

const initialState = {
  items: loadSanitizedCart(),
  totalAmount: 0,
  totalQuantity: 0,
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToGuestCart(state, action) {
      const newItem = action.payload;
      const Max_Limit = 5;

      const vId =
        newItem.variant_id ||
        newItem.variantId ||
        newItem.cart_id ||
        newItem.product_id ||
        newItem.productId;

      const existingItem = state.items.find(
        (item) =>
          String(item.variant_id) === String(vId) ||
          String(item.cart_id) === String(vId) ||
          String(item.product_id) === String(newItem.product_id || newItem.productId)
      );

      const price = Number(newItem.Price || newItem.price || newItem.SellingPrice || 0);
      const mrp = Number(newItem.MRP || newItem.mrp || price);
      const thumbnail = newItem.Thumbnail || newItem.thumbnail || newItem.photo || "";
      const title = newItem.Title || newItem.title || newItem.product_name || "Contemporary Apparel";
      const slug = newItem.Slug || newItem.slug || "";
      const qty = Number(newItem.Quantity || newItem.quantity || 1);

      if (!existingItem) {
        state.items.push({
          ...newItem,
          variant_id: vId,
          cart_id: vId,
          product_id: newItem.product_id || newItem.productId || vId,
          Title: title,
          title: title,
          Price: price,
          price: price,
          SellingPrice: price,
          MRP: mrp,
          mrp: mrp,
          Thumbnail: thumbnail,
          thumbnail: thumbnail,
          Slug: slug,
          slug: slug,
          Quantity: qty,
          quantity: qty,
          AvailableQty: Number(newItem.AvailableQty || newItem.TotalStock || 10),
        });
      } else {
        const potentialTotal = (Number(existingItem.Quantity) || 1) + qty;
        existingItem.Quantity = Math.min(potentialTotal, Max_Limit);
        // Ensure metadata is populated even if previous entry was incomplete
        if (!existingItem.Thumbnail && thumbnail) existingItem.Thumbnail = thumbnail;
        if (!existingItem.Price && price) existingItem.Price = price;
        if (!existingItem.Title && title) existingItem.Title = title;
        if (!existingItem.Slug && slug) existingItem.Slug = slug;
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    updateQuantity(state, action) {
      const { cart_id, Quantity } = action.payload;
      const item = state.items.find(
        (i) =>
          String(i.variant_id) === String(cart_id) ||
          String(i.cart_id) === String(cart_id) ||
          String(i.product_id) === String(cart_id)
      );

      if (item) {
        const avail = Number(item.AvailableQty || item.TotalStock || 10);
        if (avail && Quantity > avail) {
          item.Quantity = avail;
        } else {
          item.Quantity = Quantity;
        }
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    setCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },

    removeItem(state, action) {
      const id = action.payload;
      state.items = state.items.filter(
        (item) =>
          String(item.variant_id) !== String(id) &&
          String(item.cart_id) !== String(id) &&
          String(item.product_id) !== String(id)
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.isCartOpen = false;
      localStorage.removeItem("cart");
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
