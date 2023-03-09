import React, { useState, useEffect } from "react";
import cx from "classnames";
import fetch from "../../utils/fetch";

const UplaodedList = ({ file, handlePicker, mediaType, cropModal }) => {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState();
  const [active, setActive] = useState(files);
  const [resTimeout, setResTimeout] = useState(0);

  const MAXIMUM_TIMEOUT = 12; // 1 birim 10 saniye (120 saniye)
  const FETCH_TIMEOUT = 10000; // milisaniye (10 saniye)

  const fetchData = async (id) => {
    if (id) {
      const res = await fetch(`/media/${id}`);
      setResponse(res);
    }
  };

  useEffect(() => {
    if (file) {
      fetchData(file?.id);
    }
  }, [file]);

  useEffect(() => {
    let timer;

    if (files && files.length > 0) {
      setActive(files);

      if (resTimeout < MAXIMUM_TIMEOUT) {
        timer = setTimeout(() => {
          files.forEach((item) => {
            if (!item.isCache) {
              fetchData(item.id);
            }
            setResTimeout(resTimeout + 1);
          });
        }, FETCH_TIMEOUT);
      }
    }

    return () => clearTimeout(timer);
  }, [files]);

  const handleActive = (item) => {
    const idx = active.findIndex(el => el.id === item.id)

    const clone = [...active]
    if(idx !== -1){
      clone.splice(idx,1)
    } else{
      clone.push(item)
    }

    setActive(clone)

  }

  useEffect(() => {
    if (active && handlePicker) handlePicker(active);
  }, [active]);

  useEffect(() => {
    if (response) {
      const ids = files?.map((item) => item.id);

      if (ids.includes(response.id)) {
        const clone = [...files];
        const idx = clone.findIndex((item) => item.id === response.id);
        clone[idx] = response;
        setFiles(clone);
      } else setFiles([...files, response]);
    }
  }, [response]);

  return (
    <>
      {files && files.length > 0 && (
        <>
          <span className="font-weight-bold mt-3">Yüklenenler</span>
          <div className="uploaded-list">
            {files.map((item) => {
              return (
                <span
                  key={item.id}
                  className={cx("uploaded-list-item", {
                    active: active?.some(el => el.id === item.id),
                  })}
                  onClick={() => handleActive(item)}
                >
                  <span>{item.name}</span>
                  <span>
                  {item.thumbnailFullUrl ? <img src={item.thumbnailFullUrl} /> : <div className="placeholder"><i className="fas fa-file"></i></div>}
                    {mediaType === "photo" && item.isCache && (
                      <span
                        className="crop-icon ml-3"
                        onClick={() => cropModal({ open: true, item })}
                      >
                        <i className="fas fa-crop"></i>
                        <span className="crop-tooltip">Kırp</span>
                      </span>
                    )}
                  </span>
                </span>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
export default UplaodedList;
