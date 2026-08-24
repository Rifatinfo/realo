import { Footer } from "@/components/shared/footer/Footer";

import { LoginToastProvider } from "@/components/modules/auth/LoginToastProvider";
import { PageViewTracker } from "@/components/modules/analytics/PageViewTracker";
import HeaderWrapper from "@/components/shared/navbar/HeaderWrapper";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <PageViewTracker />
            <LoginToastProvider />
            <HeaderWrapper/>
            {children}
            <Footer/>
        </>
    );
};

export default CommonLayout;