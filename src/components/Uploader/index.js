import React, { useRef, useState, useEffect, useCallback } from "react";
import FineUploader from "fine-uploader";
import cx from "classnames";
import UplaodedList from "./UploadedList";

const FineUpload = ({
  id: elId,
  setFile,
  file,
  accept = "",
  handlePicker,
  cropModal,
  addItem,
}) => {
  const fileInput = useRef();

  const [uploadStatus, setUploadStatus] = useState("unselected");
  const [uploadPercent, setUploadPercent] = useState({});
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState();
  const [mediaType, setMediaType] = useState("photo");

  const TOKEN = window.token || process.env.REACT_APP_TOKEN;

  const uuid = elId || "uploader";

  useEffect(() => {
    if (file) {
      setUploadStatus("preview");
    }
  }, [file]);

  const extensions = window.extensions[0];

  const extensionsKey = Object.keys(extensions);
  const extensionsValues = Object.values(extensions);

  useEffect(() => {
    if (currentFile) {
      const type = currentFile?.file?.name?.split(".");
      const ext = type[type?.length - 1];

      extensionsValues.map((item, i) => {
        item.map((el) => {
          if (el === ext) {
            setMediaType(extensionsKey[i]);
          }
        });
      });
    }
  }, [currentFile]);

  useEffect(() => {
    window?.[uuid]?.setEndpoint(
      `${window.baseUrl}api/upload/${mediaType}?chunkTotalOffset=-1`,
      currentFile?.id
    );
  }, [mediaType, currentFile, uuid]);

  const handleComplete = useCallback(
    (id, name, response) => {
      if (setFile) {
        setFile(response?.media);
        addItem();
      }
      if (response?.media) {
        setUploadStatus("preview");
      }
      const clone = JSON.parse(JSON.stringify(uploadPercent));
      clone[id] = 100;
      setUploadPercent(clone);
    },
    [setFile]
  );

  const handleProgress = (id, name, uploadedBytes, totalBytes) => {
    const clone = JSON.parse(JSON.stringify(uploadPercent));

    if (uploadedBytes !== totalBytes) {
      clone[id] = parseInt((uploadedBytes / totalBytes) * 100, 10);
    } else {
      clone[id] = 99;
    }

    setUploadPercent(clone);
  };

  useEffect(() => {
    const isLocal = window.location.origin === "http://localhost:3000";
    const requestUrl = isLocal
      ? `https://cms-test.tua.gov.tr/api/upload/${mediaType}?chunkTotalOffset=-1`
      : `api/upload/${mediaType}?chunkTotalOffset=-1`;
    window[uuid] = new FineUploader.FineUploaderBasic({
      button: fileInput.current,
      request: {
        endpoint: requestUrl,
        customHeaders: {
          authorization: `Bearer ${TOKEN}`,
        },
        filenameParam: "orig",
        inputName: "file",
        uuidName: "uuid",
        totalFileSizeName: "size",
      },
      chunking: {
        enabled: true,
        mandatory: true,
        paramNames: {
          chunkSize: "chunkSize",
          partByteOffset: "partByteOffset",
          partIndex: "index",
          totalParts: "total",
          resuming: "resume",
          totalFileSize: "size",
        },
      },
      autoUpload: true,
      validation: {
        acceptFiles: accept,
      },
      retry: {
        enableAuto: true,
      },
      multiple: true,
      callbacks: {
        // onUploadChunkSuccess: handleChunkSuccess,
        onComplete: handleComplete,
        onSubmit: (id) => {
          const fd = window?.[uuid]?.getFile(id);
          setCurrentFile({ file: fd, id });

          setFiles(window?.[uuid]?.getUploads());
          const clone = {};
          window?.[uuid]?.getUploads().forEach((item) => (clone[item.id] = 0));
          setUploadPercent(clone);
          setUploadStatus("uploading");
        },
        onProgress: handleProgress,
        onAllComplete: () => {
          setFiles([]);
          setUploadPercent({});
        },
      },
    });
  }, [TOKEN, accept, handleComplete, uuid, file]);

  return (
    <div className="file-uploader-container">
      <div ref={fileInput} className={cx("file-uploader")}>
        <h4>Yüklemek istediğiniz dosyayı buraya bırakın</h4>
      </div>
      <div className="d-flex flex-column">
        {files
          ?.filter((item) => item)
          ?.map((item, i) => {
            return (
              <div key={i} className="file-uploader--progress-bar">
                <div
                  className="file-uploader--progress-bar-progress"
                  style={{ width: `${uploadPercent[item.id]}%` }}
                ></div>
              </div>
            );
          })}
      </div>
      <UplaodedList
        file={file}
        handlePicker={handlePicker}
        mediaType={mediaType}
        cropModal={cropModal}
      />
    </div>
  );
};

export default FineUpload;
