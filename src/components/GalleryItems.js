import React, { useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

const GalleryItems = ({ items, setItems, removeItem, editItem, cropModal }) => {
  const SortableItem = SortableElement(({ item }) => (
    <div className="gallery-item">
      <span className="gallery-item--buttons">
        {item.selectedImage && (
          <button
            className=" btn btn-warning text-dark"
            onMouseDown={() =>
              cropModal({ open: true, item: item.selectedImage })
            }
          >
            <i className="fas fa-crop"></i>
          </button>
        )}

        <button
          className="edit btn btn-info"
          onMouseDown={() => editItem(item)}
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="btn-close btn btn-danger"
          onMouseDown={() => removeItem(item.id)}
        >
          <i className="fas fa-times"></i>
        </button>
      </span>
      <div className="placeholder">
        {item?.type === "Images" && (
          <div className="placeholder-icon">
            <i className="far fa-image"></i>
          </div>
        )}
        {item?.type === "Videos" && (
          <div className="placeholder-icon">
            <i className="fas fa-video"></i>
          </div>
        )}
        {item?.type === "EmbedVideo" && (
          <div className="placeholder-icon">
            <i className="fas fa-code"></i>
          </div>
        )}
        {item?.type === "Html" && (
          <div className="placeholder-icon">
            <i className="far fa-file-code"></i>
          </div>
        )}

        <img
          src={
            item?.selectedImage?.thumbnailFullUrl ||
            item?.selectedVideo?.thumbnailFullUrl ||
            item?.embedVideo?.thumbnailFullUrl ||
            item?.html?.thumbnailFullUrl
          }
        />
      </div>
    </div>
  ));

  const SortableList = SortableContainer(({ items }) => {
    const initialItems = window.content_panoramic || {
      items: [],
    };
    console.log(items);
    return (
      <div className="gallery-items">
        {items.map((item, index) => (
          <SortableItem key={`item-${index}`} index={index} item={item} />
        ))}
      </div>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const sortedList = arrayMove(items, oldIndex, newIndex);
    setItems(sortedList);
  };

  return (
    <div>
      <SortableList items={items} onSortEnd={onSortEnd} axis="xy" />
    </div>
  );
};
export default GalleryItems;
