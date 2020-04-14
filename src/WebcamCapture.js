import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [ imgSrc, setImgSrc ] = useState(null);
  const [ isRecording, setIsRecording ] = useState(false);
  const [ mediaRecorder, setMediaRecorder ] = useState(null);
  const [ chunks, setChunks ] = useState([]); // array to which recording data is saved
  const playBackVideoRef = useRef();

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    },
    [webcamRef]
  );

  const toggleRecording = () => {
    if(isRecording) {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
    } else {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
    }
    setIsRecording(prevState => !prevState);
  };

  if (mediaRecorder !== null) {
    console.log('mediaRecorder>>', mediaRecorder);
    mediaRecorder.ondataavailable = (e) => {
      console.log('ondataavailable!');
      setChunks((prevChunks) => [ ...prevChunks, e.data]);
    };
    mediaRecorder.onstop = (e) => {
      let blob = new Blob(chunks, { 'type': 'video/mp4' });
      setChunks([]);
      let videoURL = window.URL.createObjectURL(blob);
      playBackVideoRef.current.src = videoURL;
    };
  }

  return (
    <div>
      <div style={{ margin: '1rem' }}>
        <Webcam
          width="100%"
          audio={true}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={() => {
            console.log('webcamRef>>>', webcamRef.current);
            const { stream } = webcamRef.current || {};
            setMediaRecorder(new MediaRecorder(stream));  //tells mediaRecorder to listen to the media stream.
          }}
        />
      </div>
      <div style={{ margin: '1rem' }}>
        <button
          style={{ padding: '1rem', background: isRecording ? 'red' : 'green', fontSize: '1rem', color: 'white', borderRadius: '0.5rem', margin: '1rem' }}
          onClick={toggleRecording}
        >
          { isRecording ? 'Stop Recording' : 'Start Recording' }
        </button>
        <button
          style={{ padding: '1rem', fontSize: '1rem', color: 'black', borderRadius: '0.5rem', margin: '1rem' }}
          onClick={capture}
        >
          Capture photo
        </button>
      </div>
      <div>
        <img
          src={imgSrc}
        />
      </div>
      <div style={{ margin: '1rem' }}>
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

export default WebcamCapture;