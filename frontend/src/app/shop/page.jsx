// import Shop from "@/pages/Shop";
import Navbar from "@/components/Navbar.jsx";
import ShopProduct from "@/components/ShopProduct.jsx";
import ShopHero from "@/components/ShopHero.jsx";
import Footer from "@/components/Footer.jsx";
export default function ShopPage() {
  return (
    <main>
        <Navbar />
        <ShopHero />
        <ShopProduct />
        <Footer />
    </main>
  );
}
