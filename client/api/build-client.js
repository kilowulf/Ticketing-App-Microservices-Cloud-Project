import axios from "axios";

/**build-client: helper function  which will create/pre-configure axios calls
 * - configure calls for either browser or server
 **/ 

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      // call to server
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/"
    });
  }
};
