import AboutSection from "@/components/server/About";
import FAQSection from "@/components/server/Faq";
import Form from "@/components/server/Form";
import HeroSection from "@/components/server/Hero";
import ProductsSection from "@/components/server/Products";
import ScrollMain from "@/components/server/ScrollMain";
import StagesSection from "@/components/server/Stages";

export default function Home() {
    return (
        <div>
            {/* <Header /> */}

            {/* Hero section */}
            <HeroSection />

            {/* Scroll Section */}
            <ScrollMain />

            {/* Stages section */}
            <StagesSection />

            {/* Products */}
            <ProductsSection />

            {/* About Us */}
            <AboutSection />

            {/* Faq */}
            <FAQSection />

            {/* Form */}
            <Form />
        </div>
    );
}
