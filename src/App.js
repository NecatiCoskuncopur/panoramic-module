import React, { useState, useEffect } from "react";
import "./App.css";
import GalleryItems from "./components/GalleryItems";

import Uploader from "./components/Uploader";

const languages = window.languages || {
  tr: "Türkçe",
  en: "English",
};

const initialItems = window.content || {
  items: [],
};

function App() {
  const [items, setItems] = useState(initialItems.items);
  const [file, setFile] = useState();

  const addItem = (item) => setItems([...items, item]);

  const multipleAddItem = (item) => setItems([...items, ...item]);

  const removeItem = (id) => {
    const clone = [...items];
    const filtered = clone.filter((item) => item.id !== id);
    setItems(filtered);
  };

  useEffect(() => {
    if (window.updateInput)
      window.updateInput(JSON.stringify({ items: items }));
    else console.log(items);
  }, [items]);

  return (
    <div className="App">
      <Uploader
        id="gallery-add-upload"
        file={file}
        setFile={setFile}
        addItem={addItem}
        mediaType="photo"
      />
      <div className="gallery-container">
        <GalleryItems
          items={items}
          setItems={setItems}
          removeItem={removeItem}
        />
      </div>
    </div>
  );
}

export default App;
