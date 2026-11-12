

const ShopLayout = ({ children }) => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">{children}</div>
    </>
  );
};

export default ShopLayout;
