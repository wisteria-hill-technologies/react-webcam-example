import React, { useState, useRef } from "react";
import { Button } from 'reactstrap';
import Webcam from "react-webcam";
import moment from 'moment';
import { FiCamera, FiVideo } from "react-icons/fi";
import { MdSwitchCamera } from "react-icons/md";
import b64toBlob from './b64ToBlob';

const CameraCapture = () => {
  const videoConstraints = {
    width: 1280,
    height: 720
  };
  const [ facingMode, setFacingMode ] = useState("user");
  const webcamRef = useRef(null);
  const [ imgSrc, setImgSrc ] = useState(null);
  const [ flash, setFlash ] = useState(false);
  const [ isRecording, setIsRecording ] = useState(false);
  const [ recorded, setRecorded ] = useState(false);
  const [ mediaRecorder, setMediaRecorder ] = useState(null);
  const [ videoFile, setVideoFile ] = useState(null);
  const [ chunks, setChunks ] = useState([]); // array to which recording data is saved
  const playBackVideoRef = useRef();

  const switchCamera = () => {
    setFacingMode(prevState => {
      if(prevState === 'user') {
        return "environment";
      } else {
        return "user";
      }
    });
  };

  const capture = React.useCallback(
    () => {
      setRecorded(false);
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        const imageSrc = webcamRef.current.getScreenshot();  // imageSrc is base64
        setImgSrc(imageSrc);
      }, 100);
    },
    [webcamRef]
  );

  const onSaveImage = () => {
    const base64Str = imgSrc.split('data:image/jpeg;base64,')[1];
    const blob = b64toBlob(base64Str, "image/jpeg");
    const dateTimeStr = moment().format("YYYY-MM-DD_HH-mm-ss");
    const imageFile = new File([blob], `image_${dateTimeStr}.jpg`, { type: blob.type });  // image converted to a file
  };

  const toggleRecording = () => {
    if(isRecording) {
      mediaRecorder.stop();
      setRecorded(true);
    } else {
      setImgSrc('');
      setVideoFile(null);
      mediaRecorder.start();
      setRecorded(false);
    }
    setIsRecording(prevState => !prevState);
  };

  if (mediaRecorder !== null) {
    mediaRecorder.ondataavailable = (e) => {
      setChunks((prevChunks) => [ ...prevChunks, e.data]);
    };
    mediaRecorder.onstop = () => {
      let blob = new Blob(chunks, { 'type': 'video/mp4' });
      setChunks([]);
      let videoURL = window.URL.createObjectURL(blob);
      playBackVideoRef.current.src = videoURL;
      const dateTimeStr = moment().format("YYYY-MM-DD_HH-mm-ss");
      const file = new File([blob], `video_${dateTimeStr}.mp4`, { type: blob.type });
      setVideoFile(file);
    };
  }

  const onSaveVideo = () => {
    // save somewhere videoFile in state
  };

  return (
    <div className="CameraCapture p-2 m-2 border">
      <h1 className="display-4">Camera Capture</h1>
      <div
        className="my-1 mx-auto position-relative"
        style={{ maxWidth: '30rem' }}
      >
        <Webcam
          width="100%"
          height="100%"
          audio={true}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ ...videoConstraints, facingMode } }
          onUserMedia={() => {
            const { stream } = webcamRef.current || {};
            setMediaRecorder(new MediaRecorder(stream));  //tells mediaRecorder to listen to the media stream.
          }}
        />
        <div
          className="overlay w-100 h-100 position-absolute"
          style={{ backgroundColor: flash ? 'white' : '', top: 0, left: 0 }}
        />
      </div>
      <div
        className="m-1 d-flex justify-content-center flex-wrap"
      >
        <Button
          className="photoCaptureButton m-1 d-flex justify-content-center align-items-center"
          onClick={switchCamera}
        >
          <MdSwitchCamera />&nbsp;
          Switch Camera
        </Button>
        <Button
          className="videoRecordingButton text-white m-1 d-flex justify-content-center align-items-center"
          style={{ background: isRecording ? 'red' : 'green' }}
          onClick={toggleRecording}
        >
          <FiVideo />&nbsp;{ isRecording ? 'Stop Recording' : 'Record Video' }
        </Button>
        <Button
          color="info"
          className="photoCaptureButton m-1 d-flex justify-content-center align-items-center"
          onClick={capture}
        >
          <FiCamera />&nbsp;
          Capture photo
        </Button>
      </div>
      {
        imgSrc && (
          <div
            className="my-1 mx-auto position-relative w-100"
            style={{ maxWidth: '40rem' }}
          >
            <p className="display-4 mb-0">
              Captured Photo
              &nbsp;
              <Button
                color="info"
                className="photoSaveButton"
                onClick={onSaveImage}
              >
                Save
              </Button>
            </p>
            <img
              className="w-100"
              src={imgSrc}
              alt=""
            />
          </div>
        )
      }
      <div
        className="my-1 mx-auto position-relative w-100"
        style={{ maxWidth: '40rem', display: recorded ? "block" : "none" }}
      >
        <p className="display-4 mb-0">
          Recorded Video
          &nbsp;
          <Button
            color="info"
            className="photoSaveButton"
            onClick={onSaveVideo}
          >
            Save
          </Button>
        </p>
        <video
          width="100%"
          controls
          ref={playBackVideoRef}
          playsInline
        />
      </div>
    </div>
  );
};

export default CameraCapture;
