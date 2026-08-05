import { useState } from "react";

export default function ProductUpload({ onUpload }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name || !price || !image || !description) {
      return alert("Please fill all fields");
    }
    onUpload({ name, price: parseFloat(price), image, description });
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
  };

  return (
    <div className="upload-form">
      <h2>Upload New Product</h2>
      <input 
        placeholder="Product Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        placeholder="Price ($)" 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
      />
      <input 
        placeholder="Image URL (https://...)" 
        value={image} 
        onChange={(e) => setImage(e.target.value)} 
      />
      <textarea 
        placeholder="Description" 
        rows="4"
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      <button onClick={handleSubmit}>Upload Product</button>
    </div>
  );
}