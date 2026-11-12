import { ProductCard } from "./ProductCard"; // Make sure path is correct

export default function ShopSections() {
  const renderSection = (title, items) => (
    <div className="max-w-[1600px] mx-auto mb-20">
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
          <h2 className="text-2xl font-black text-black uppercase tracking-widest">{title}</h2>
          <div className="h-1 w-12 bg-primary mt-2"></div>
        </div>
        <button className="text-sm font-bold border-b-2 border-black pb-1 hover:text-primary hover:border-primary transition-all">VIEW ALL</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 px-4">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
