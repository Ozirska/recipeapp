import { useState } from "react";
import { Formik, Form, useField, Field } from "formik";
import * as yup from "yup";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Client, Storage } from "appwrite";
import { v4 as uuidv4 } from "uuid";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65b225f35a143c2cdccd");
const storage = new Storage(client);

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  ingredients: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Ingredient name is required"),
      quantity: yup.string().required("Quantity is required"),
    })
  ),
});

const CustomInput = ({ as, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      {as === "textarea" ? (
        <textarea
          {...field}
          {...props}
          className={meta.touched && meta.error ? "input-error" : ""}
        />
      ) : (
        <input
          {...field}
          {...props}
          className={meta.touched && meta.error ? "input-error" : ""}
        />
      )}
      {meta.touched && meta.error && <p className="error">{meta.error}</p>}
    </>
  );
};

const CustomInputIngredient = ({ name, placeholder }) => {
  const [field, meta] = useField({ name, placeholder });

  return (
    <>
      <input
        {...field}
        className={meta.touched && meta.error ? "input-error" : ""}
      />
      {meta.touched && meta.error && <p className="error">{meta.error}</p>}
    </>
  );
};

export default function CreateRecipeForm() {
  const { user } = useAuth();

  const [recipeimag, setRecipeimg] = useState("");

  const navigate = useNavigate();

  const initialValues = {
    title: "",
    description: "",
    ingredients: [{ name: "", quantity: "" }],
  };

  const uploadImage = (img) => {
    console.log(img);

    const promise = storage
      .createFile(
        "65b2283aa0c90c4f1714", // Your bucket ID
        uuidv4(),
        document.getElementById("uploader").files[0]
      )
      .then(
        function (response) {
          const fileId = response["$id"];
          const publicURL = `https://cloud.appwrite.io/v1/storage/buckets/65b2283aa0c90c4f1714/files/${fileId}/view?project=65b225f35a143c2cdccd&mode=admin`;
          setRecipeimg(publicURL);
        },
        function (error) {
          console.log(error); // Failure
        }
      );
  };

  const handleSubmit = (values) => {
    if (recipeimag === "") return;

    values.ingredients = JSON.stringify(values.ingredients);

    let res = { ...values, userID: user.id, photo_url: recipeimag };
    console.log(res);

    axios
      .post("http://localhost:8800/create", res, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          navigate("/");
        } else {
          alert("No register user");
        }
      })
      .catch((err) => console.error("Error in axios request:", err));
  };

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={true}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <input
            type="file"
            id="uploader"
            name="photo"
            accept="image/*"
            onChange={(event) => uploadImage(event.currentTarget.files[0])}
          />
          <br />
          <br />
          <CustomInput type="text" name="title" placeholder="Recipe Title" />
          <br />
          <br />

          <CustomInput
            as="textarea"
            name="description"
            placeholder="Recipe Description"
          />

          <br />
          <br />

          <div>
            <label>Ingredients</label>
            {values.ingredients.map((ingredient, index) => (
              <div key={index}>
                <CustomInputIngredient
                  name={`ingredients[${index}].name`}
                  placeholder="Ingredient name..."
                />
                <CustomInputIngredient
                  name={`ingredients[${index}].quantity`}
                  placeholder="Quantity..."
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue(
                        "ingredients",
                        values.ingredients.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    x
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFieldValue("ingredients", [
                  ...values.ingredients,
                  { name: "", quantity: "" },
                ]);
              }}
            >
              Add Ingredient
            </button>
          </div>

          <br />
          <button type="submit">Create Recipe</button>
        </Form>
      )}
    </Formik>
  );
}
