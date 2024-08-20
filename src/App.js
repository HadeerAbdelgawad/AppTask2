import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../src/App.css";

function SubmitForm() {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;
    setFormData({
      ...formData,
      [name]: file,
    });
    if (name === "image" && file) {
      setFileUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      image: null,
    });
    setFileUrl("");
    document.querySelector('input[name="image"]').value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const data = new FormData();
      if (formData.image) {
        data.append("image", formData.image);
      }
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);

      try {
        const response = await fetch("https://www.appssquare.sa/api/submit", {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Success:", result);
        } else {
          const error = await response.text();
          console.error("Failed:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(formData.password)) {
      tempErrors.password = "Password must include at least one number, one lowercase letter, one uppercase letter, and one special character";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^01\d{9}$/.test(formData.phone)) {
      tempErrors.phone = "Phone number must start with '01' and include exactly 11 digits";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter Your Name"
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@gmail.com"
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter Phone Number"
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>
        <div>
          <label>Password :</label>
          <div style={{ position: "relative" }}>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter Password"
            />
            <i
              className={`fas fa-eye${passwordVisible ? "-slash" : ""}`}
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: "absolute",
                cursor: "pointer",
                marginLeft: "-26px",
                marginTop: "9px"
              }}
            ></i>
          </div>
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>
        <div>
          <label>Image :</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
          />
          <div>
            {formData.image ? (
              <div>
                <button
                  className="remo"
                  onClick={handleRemoveFile}
                >
                  Remove Selected File
                </button>
                <button
                  className="show"
                  onClick={() => window.open(fileUrl, "_blank")}
                >
                  Open File
                </button>
              </div>
            ) : (
              <span>No file chosen</span>
            )}
          </div>
        </div>
        <button className="sub" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SubmitForm;

