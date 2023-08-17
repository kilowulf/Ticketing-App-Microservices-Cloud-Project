import buildClient from "../api/build-client";
import App from "next/app";
import Header from "../components/header";
import BaseLayout from "../components/BaseLayout";
const AppComponent = ({ Component, pageProps }) => {
  return (
    <BaseLayout currentUser={pageProps.currentUser}>
      <div>
        <Component {...pageProps} />
      </div>
    </BaseLayout>
  );
};

export default AppComponent;
