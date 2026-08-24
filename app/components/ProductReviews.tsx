"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Props = {
  productId: number;
};

type Review = {
  id: number;
  customer_name: string;
  rating: number;
  review: string;
  created_at: string;
};

export default function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const [loading, setLoading] = useState(false);

  async function loadReviews() {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews);
        setAverage(data.average);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function submitReview() {
    if (!customerName.trim()) {
      alert("Enter your name.");
      return;
    }

    if (!review.trim()) {
      alert("Write your review.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          customer_name: customerName,
          rating,
          review,
        }),
      });

      const data = await res.json();

      alert(data.message);

      setCustomerName("");
      setReview("");
      setRating(5);

      loadReviews();

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto mt-24 border-t border-zinc-800 pt-16">

      <div className="flex flex-col lg:flex-row gap-16">

        <div className="lg:w-[35%]">

          <h2 className="text-4xl font-bold mb-6">
            Customer Reviews
          </h2>

          <div className="flex items-center gap-4">

            <span className="text-6xl font-bold">
              {average || "5.0"}
            </span>

            <div>

              <div className="flex gap-1">

                {[1,2,3,4,5].map((i)=>(
                  <Star
                    key={i}
                    size={22}
                    fill={i<=Math.round(average) ? "#FACC15":"none"}
                    className="text-yellow-400"
                  />
                ))}

              </div>

              <p className="text-zinc-400 mt-2">
                Based on {total} review{total!==1 && "s"}
              </p>

            </div>

          </div>

          <div className="mt-12 space-y-5">

            <input
              value={customerName}
              onChange={(e)=>setCustomerName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-4"
            />

            <textarea
              rows={5}
              value={review}
              onChange={(e)=>setReview(e.target.value)}
              placeholder="Share your experience..."
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-4 resize-none"
            />

            <div className="flex gap-2">

              {[1,2,3,4,5].map((i)=>(
                <button
                  key={i}
                  onClick={()=>setRating(i)}
                >
                  <Star
                    size={32}
                    fill={i<=rating ? "#FACC15":"none"}
                    className="text-yellow-400 transition hover:scale-110"
                  />
                </button>
              ))}

            </div>
                        <button
              onClick={submitReview}
              disabled={loading}
              className="w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>

          </div>

        </div>

        <div className="flex-1">

          {reviews.length === 0 ? (

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">

              <h3 className="text-2xl font-semibold">
                No reviews yet
              </h3>

              <p className="mt-3 text-zinc-400">
                Be the first customer to review this product.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {reviews.map((r) => (

                <div
                  key={r.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-semibold">
                        {r.customer_name}
                      </h3>

                      <div className="mt-2 flex gap-1">

                        {[1, 2, 3, 4, 5].map((i) => (

                          <Star
                            key={i}
                            size={18}
                            fill={i <= r.rating ? "#FACC15" : "none"}
                            className="text-yellow-400"
                          />

                        ))}

                      </div>

                    </div>

                    <p className="text-sm text-zinc-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>

                  </div>

                  <p className="mt-5 leading-8 text-zinc-300">
                    {r.review}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </section>
  );
}