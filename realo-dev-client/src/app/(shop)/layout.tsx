import { LoginToastProvider } from "@/components/modules/auth/LoginToastProvider";
import { Footer } from "@/components/shared/footer/Footer";
import HeaderWrapper from "@/components/shared/navbar/HeaderWrapper";


const ShopLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <LoginToastProvider />
            <HeaderWrapper />
            {children}
            <Footer />
        </>
    );
};

export default ShopLayout;
