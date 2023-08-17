import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("Landing Page", currentUser);
  return currentUser
    ? <h1>You are signed in</h1>
    : <h1>You are not signed in</h1>;
};

export const getServerSideProps = async context => {
  try {
    const { data } = await buildClient(context).get("/api/users/currentuser");
    console.log("Landing Page");
    console.log(data);
    return { props: data };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return { props: { currentUser: null } }; // Setting currentUser to null
  }
};

export default LandingPage;
