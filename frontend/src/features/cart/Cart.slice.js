import { createSlice } from "@reduxjs/toolkit";

// Initial load with sanitization (remove broken legacy entries that had missing data)
const loadSanitizedCart = () => {
  try {
    const raw = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(raw)) return [];
    const valid = raw.filter(
      (item) =>
        (item.variant_id || item.variantId || item.product_id || item.productId || item.cart_id) &&
        (item.Price || item.price || item.SellingPrice || item.Title || item.title)
    );
    // Deduplicate by product_id + variant_id
    const seen = new Set();
    const deduped = [];
    valid.forEach((item) => {
      const key = `${item.product_id || item.productId}_${item.variant_id || item.variantId || item.cart_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(item);
      }
    });
    return deduped;
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

      const vId = Number(
        newItem.variant_id ||
        newItem.variantId ||
        newItem.cart_id ||
        newItem.product_id ||
        newItem.productId
      );
      const pId = Number(newItem.product_id || newItem.productId || vId);

      const existingIndex = state.items.findIndex(
        (item) =>
          Number(item.variant_id || item.variantId || item.cart_id) === vId ||
          Number(item.product_id || item.productId) === pId
      );

      const price = Number(newItem.Price || newItem.price || newItem.SellingPrice || 0);
      const mrp = Number(newItem.MRP || newItem.mrp || price);
      const thumbnail = newItem.Thumbnail || newItem.thumbnail || newItem.photo || "";
      const title = newItem.Title || newItem.title || newItem.product_name || "Contemporary Apparel";
      const slug = newItem.Slug || newItem.slug || "";
      const qty = Number(newItem.Quantity || newItem.quantity || 1);

      if (existingIndex === -1) {
        state.items.push({
          ...newItem,
          variant_id: vId,
          variantId: vId,
          cart_id: vId,
          product_id: pId,
          productId: pId,
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
        const potentialTotal = (Number(state.items[existingIndex].Quantity) || 1) + qty;
        state.items[existingIndex].Quantity = Math.min(potentialTotal, Max_Limit);
        state.items[existingIndex].quantity = state.items[existingIndex].Quantity;
        if (!state.items[existingIndex].Thumbnail && thumbnail) state.items[existingIndex].Thumbnail = thumbnail;
        if (!state.items[existingIndex].Price && price) state.items[existingIndex].Price = price;
        if (!state.items[existingIndex].Title && title) state.items[existingIndex].Title = title;
        if (!state.items[existingIndex].Slug && slug) state.items[existingIndex].Slug = slug;
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
