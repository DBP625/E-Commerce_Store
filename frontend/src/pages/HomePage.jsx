import React from "react";
import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirt", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Exclusive Collections
        </h1>
        <p className="text-center text-lg sm:text-xl text-gray-300 mb-12">
          Discover the latest trends in fashion and elevate your style with our
          curated selection.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {/* About Section Below Homepage */}
        <section className="mt-20 bg-slate-900/60 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-emerald-400 text-center mb-6">
            About Us
          </h2>

          <p className="text-center text-gray-300 max-w-2xl mx-auto mb-10">
            We are a modern fashion brand offering premium, stylish and
            affordable products. Our mission is to bring you the best shopping
            experience with quality, trust, and fast customer support.
          </p>

          {/* Who We Are + Mission */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
            <div>
              <h3 className="text-2xl font-semibold text-emerald-300 mb-3">
                Who We Are
              </h3>
              <p className="text-gray-300">
                Founded in 2025, our store provides a wide range of fashion
                items including jeans, t-shirts, shoes, jackets, and more —
                carefully curated to match your lifestyle.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-emerald-300 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-300">
                Our goal is to deliver quality products at affordable prices
                with reliable delivery, secure payment, and excellent customer
                service.
              </p>
            </div>
          </div>

          {/* Google Map + Contact */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Contact info */}
            <div>
              <h3 className="text-2xl font-semibold text-emerald-300 mb-3">
                Contact Us
              </h3>
              <p className="text-gray-300 mb-2">Email: support@yourstore.com</p>
              <p className="text-gray-300 mb-2">Phone: +880 1XXX-XXXXXX</p>
              <p className="text-gray-300">Address: Chattogram, Bangladesh</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-emerald-300 mb-3">
                Our Location
              </h3>
              <div className="w-full h-64 rounded-xl overflow-hidden border border-emerald-500/40">
                <iframe
                  title="location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.689191516447!2d91.846006!3d22.3476557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd9d68231749d%3A0xfb7e42318c7b9e4a!2sPatharghata%2C%20Chattogram!5e0!3m2!1sen!2sbd!4v1732202000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
