import axios from "axios";
import { useState } from "react";

/** useState hook used to return error messages on user sign up submission
 * - div to display on errors * 
 **/
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      // clear errors on new submit
      setErrors(null);
      // parameterize axios call
      const response = await axios[method](url, body);
      // check for successful sign up validation
      // if success, we forward route user to home page
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map(err =>
              <li key={err.message}>
                {err.message}
              </li>
            )}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
