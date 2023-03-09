import React, { useState, useEffect } from "react";
import fetch from "../utils/fetch";

const FilePicker = ({
  onChange,
  single,
  mediaType = "photo",
  initialValues = [],
  corpModal,
  isCrop,
}) => {
  const [val, setVal] = useState([]);
  const [page, setPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [search, setSearch] = useState("");

  const fields = {
    photo: {
      label: "Resim",
      placeholder: "Resim Ara",
      no_items: "Resim Bulunamadı.",
    },
    video: {
      label: "Video",
      placeholder: "Video Ara",
      no_items: "Video Bulunamadı.",
    },
    object: {
      label: "Model",
      placeholder: "Model Ara",
      no_items: "Model Bulunamadı.",
    },
  };

  const getFiles = async (mediaType) => {
    let url =
      "/media?items_per_page=10&order[id]=desc&mediaType=" +
      mediaType +
      "&page=" +
      page;

    if (search) {
      url += "&name=" + search;
    }

    const { "hydra:member": response, "hydra:totalItems": totalItems } =
      await fetch(url);

    if (Array.isArray(response)) {
      setFiles(response);
      setTotalItem(totalItems);
    }
  };

  useEffect(() => {
    getFiles(mediaType);
  }, []);

  useEffect(() => {
    getFiles(mediaType);
  }, [page, search, mediaType]);

  const handleSelect = (file) => {
    const findFile = val.find((item) => item.id === file.id);

    let value;
    if (findFile) {
      value = single ? [] : val.filter((item) => item.id !== file.id);
    } else {
      value = single ? [file] : [...val, file];
    }

    setVal(value);

    if (value.length > 0) {
      onChange(single ? value[0] : value);
    } else {
      onChange(single ? null : []);
    }
  };

  const file =
    mediaType === "photo"
      ? initialValues?.selectedImage
      : initialValues?.selectedVideo;

  return (
    <div className="pb-image-picker">
      <div className="input-group mb-3">
        <label htmlFor="image-picker-search" className="col-form-label w-100">
          {fields[mediaType]?.label}
        </label>
        <input
          id="image-picker-search"
          onChange={({ target }) => setSearch(target.value)}
          className="form-control"
          type="text"
          placeholder={fields[mediaType]?.placeholder}
        />
      </div>
      {/* {files
        .filter((item) => initialValues.includes(item.fileFullUrl))
        .map((file) => (
          <label
            key={file.id}
            className={`pb-modules-files-item border rounded border-primary text-primary`}
          >
            <input
              onChange={() => handleSelect(file)}
              type="radio"
              disabled
              checked={true}
            />
            <span>{file?.name}</span>
            {file.thumbnailFullUrl && (
              <img
                className="pb-modules-files-item-thumbnail"
                src={file.thumbnailFullUrl}
                alt={file.name}
              />
            )}
          </label>
        ))} */}

      {file && (
        <label
          key={file?.id}
          className={`pb-modules-files-item border rounded border-primary text-primary`}
        >
          <input
            onChange={() => handleSelect(file)}
            type="radio"
            disabled
            checked={true}
          />
          <span>{file?.name}</span>
          {file?.thumbnailFullUrl && (
            <img
              className="pb-modules-files-item-thumbnail"
              src={file.thumbnailFullUrl}
              alt={file.name}
            />
          )}
          {mediaType === "photo" && isCrop && (
            <span
              className="crop-icon ml-3"
              onClick={() => corpModal({ open: true, item: file })}
            >
              <i className="fas fa-crop"></i>
              <span className="crop-tooltip">Kırp</span>
            </span>
          )}
        </label>
      )}

      {files.length > 0 ? (
        <div className="pb-modules-files-list border border-secondary rounded overflow-auto p-2">
          {files.map((file) => (
            <label
              key={file.id}
              className={`pb-modules-files-item border rounded ${
                !!val.find((item) => item.id === file.id) &&
                " border-primary text-primary"
              }`}
            >
              <input
                onClick={() => handleSelect(file)}
                readOnly
                type="radio"
                checked={!!val.find((item) => item.id === file.id)}
              />
              <span>{file?.name}</span>
              {file.thumbnailFullUrl && (
                <img
                  className="pb-modules-files-item-thumbnail"
                  src={file.thumbnailFullUrl}
                  alt={file.name}
                />
              )}
              {mediaType === "photo" && isCrop && (
                <span
                  className="crop-icon ml-3"
                  onClick={() => corpModal({ open: true, item: file })}
                >
                  <i className="fas fa-crop"></i>
                  <span className="crop-tooltip">Kırp</span>
                </span>
              )}
            </label>
          ))}
        </div>
      ) : (
        <div className="alert alert-secondary" role="alert">
          {fields[mediaType]?.no_items}
        </div>
      )}
    </div>
  );
};

export default FilePicker;
