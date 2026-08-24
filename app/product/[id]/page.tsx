import { notFound } from "next/navigation";
import pool from "../../lib/db";
import ImageGallery from "../../components/ImageGallery";
import ProductDetails from "../../components/ProductDetails";
import ProductReviews from "../../components/ProductReviews";
import Navbar from "../../components/Navbar";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM products
    WHERE id = ?
    AND active = 1
    `,
    [id]
  );

  if (rows.length === 0) {
    notFound();
  }

  const product = rows[0];

  const images = [
    product.image1,
    product.image2,
    product.image3,
  ].filter(Boolean);

  return (
  <>
    <Navbar />

    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <section className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-16 items-start">

          <ImageGallery
            images={images}
            name={product.name}
          />

          <ProductDetails
            id={product.id}
            name={product.name}
            price={product.price}
            salePrice={product.sale_price}
            onSale={product.on_sale}
            stock={product.stock}
            image={product.image1}
          />

        </div>

      </section>

      <section className="max-w-7xl mx-auto mt-24 border-t border-zinc-800 pt-16">

        <div className="grid md:grid-cols-3 gap-12">

          <div>

            <h2 className="text-2xl font-semibold mb-6">
              Description
            </h2>

            <p className="text-zinc-400 leading-8">
              {product.description}
            </p>

          </div>

          <div>

  <h2 className="text-2xl font-semibold mb-6">
    Fabric & Care
  </h2>

            <ul className="space-y-3 text-zinc-400">
              <li>• 100% Premium Cotton</li>
              <li>• Heavyweight Fabric</li>
              <li>• Oversized Fit</li>
              <li>• Machine Wash Cold</li>
              <li>• Do Not Bleach</li>
            </ul>

          </div>

          <div>

            <h2 className="text-2xl font-semibold mb-6">
              Shipping
            </h2>

            <p className="text-zinc-400 leading-8">
              Orders are processed within 24 hours.
              Nationwide delivery usually takes 3–5 working days.
            </p>

          </div>

        </div>

      </section>
<ProductReviews productId={product.id} />
    </main>
       
  </>

  );
}