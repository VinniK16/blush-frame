import { useRef, useEffect, useState } from "react";
import intro from "./assets/intro.jpg";
import { useNavigate } from "react-router-dom";


function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [phase, setPhase] = useState("layout"); // "layout" | "camera"
  const [layout, setLayout] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Demo image placeholder
  const demoImage = intro;

  useEffect(() => {
    if (phase === "camera") {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied:", err));
    }
  }, [phase]);

  const chooseLayout = (selectedLayout) => {
    setLayout(selectedLayout);

    // define slot count
    let slots = 1;
    if (selectedLayout === "strip") slots = 3;
    if (selectedLayout === "grid") slots = 4;
    if (selectedLayout === "collage") slots = 6;

    setPhotos(new Array(slots).fill(null));
    setPhase("camera");
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");

    // find first empty slot
    const emptyIndex = photos.findIndex(p => p === null);
    if (emptyIndex === -1) return;

    const updated = [...photos];
    updated[emptyIndex] = dataUrl;
    setPhotos(updated);
  };

  const goToPreview = () => {
    navigate("/preview", { state: { photos, layout } });
  };

  const renderLayoutPreview = (layoutType) => {
    const slots = layoutType === "single" ? 1 : layoutType === "strip" ? 3 : layoutType === "grid" ? 4 : 6;
    const images = new Array(slots).fill(demoImage);

    switch (layoutType) {
      case "single":
        return (
          <div className="w-48 h-48 border-2 border-gray-300 overflow-hidden">
            <img src={demoImage} alt="Single" className="w-full h-full object-cover" />
          </div>
        );
      case "strip":
        return (
          <div className="flex flex-col gap-2 border-2 border-gray-300 p-3">
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Strip ${i}`} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        );
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-2 border-2 border-gray-300 p-3 w-48 h-48">
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Grid ${i}`} className="w-full h-full object-cover rounded" />
            ))}
          </div>
        );
      case "collage":
        return (
          <div className="grid grid-cols-3 gap-2 border-2 border-gray-300 p-3 w-48 h-32">
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Collage ${i}`} className="w-full h-full object-cover rounded" />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderPhotoLayout = () => {
    if (!photos.some(p => p)) return null;

    switch (layout) {
      case "single":
        return (
          <div className="p-4 bg-white rounded-xl border-4 border-pink-400 shadow-lg flex justify-center items-center hover:scale-110 transition-transform">
            <div className={`w-60 h-40 ${photos[0] ? '' : 'bg-gray-200'} border-2`}>
                {photos[0] ? (
                    <img src={photos[0]} alt="Single" className="w-full h-full object-cover rounded-lg"/>
                    ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                    Empty
                    </div>
                )}
            </div>
        </div>
        );
      case "strip":
        return (
          <div className="flex flex-col gap-3 p-4 bg-white rounded-xl border-4 border-pink-400 shadow-lg hover:scale-110 transition-transform">
            {photos.map((photo, i) => (
              <div key={i} className={`w-45 h-25 ${photo ? '' : 'bg-gray-200'} border-2`}>
                {photo && <img src={photo} alt={`Strip ${i}`} className="w-full h-full object-cover rounded-lg" />}
                {!photo && <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">Empty</div>}
              </div>
            ))}
          </div>
        );
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-xl border-4 border-pink-400 shadow-lg w-96 h-96 hover:scale-110 transition-transform">
            {photos.map((photo, i) => (
              <div key={i} className={`${photo ? '' : 'bg-gray-200'} h-40 border-2`}>
                {photo && <img src={photo} alt={`Grid ${i}`} className="w-full h-full object-cover rounded-lg" />}
                {!photo && <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">Empty</div>}
              </div>
            ))}
          </div>
        );
      case "collage":
        return (
          <div className="grid grid-cols-3 gap-2 p-4 bg-white rounded-xl border-4 border-pink-400 shadow-lg w-[600px] h-96 hover:scale-110 transition-transform">
            {photos.map((photo, i) => (
              <div key={i} className={`${photo ? '' : 'bg-gray-200'} h-40 border-2`}>
                {photo && <img src={photo} alt={`Collage ${i}`} className="w-full h-full object-cover rounded-lg" />}
                {!photo && <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">Empty</div>}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className=" fixed inset-0 overflow-hidden flex flex-col items-center gap-18 p-17 min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">

      {phase === "layout" && (
        <>
          <h1 className="text-4xl font-bold mb-8 text-purple-800">Choose Your Photo Layout</h1>
          <div className="flex gap-9">
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow h-70 transition-transform duration-300 hover:scale-105">
              {renderLayoutPreview("single")}
              <button 
                onClick={() => chooseLayout("single")} 
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
              >
                Single Photo
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow transition-transform duration-300 hover:scale-105">
              {renderLayoutPreview("strip")}
              <button 
                onClick={() => chooseLayout("strip")} 
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
              >
                Photo Strip
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow h-72 transition-transform duration-300 hover:scale-105">
              {renderLayoutPreview("grid")}
              <button 
                onClick={() => chooseLayout("grid")} 
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
              >
                Grid Layout
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow h-57 transition-transform duration-300 hover:scale-105">
              {renderLayoutPreview("collage")}
              <button 
                onClick={() => chooseLayout("collage")} 
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
              >
                Photo Collage
              </button>
            </div>
          </div>
        </>
      )}

      {phase === "camera" && (
        <>
          <div className="flex gap-12 items-start">
            {/* Camera Section */}
            <div className="flex flex-col items-center gap-6 ">
              <h3 className="text-3xl font-bold text-purple-800">Camera</h3>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-[500px] h-80 rounded-xl object-cover border-4 border-pink-400 shadow-lg hover:scale-105 transition-transform"
              />
              
              <button
                onClick={capturePhoto}
                disabled={photos.every(p => p !== null)}
                className="hover:scale-110 transition-transform px-10 py-5 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-xl"
              >
                {photos.every(p => p !== null) ? "All Photos Captured" : `Capture Photo`}
              </button>
              
              
            </div>

            {/* Layout Preview Section */}
            <div className="flex flex-col items-center gap-6">
              <h3 className="text-3xl font-bold text-purple-800">Your Photos</h3>
              {renderPhotoLayout()}
              <div className="text-lg text-gray-600 text-center font-medium">
                {photos.filter(p => p).length} of {photos.length} photos captured
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-0">
            <button
                onClick={() => setPhase("layout")}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold hover:scale-105 transition-transform"
              >
                Back to Layouts
              </button>
            
            {/* Preview Button */}
            {photos.every(p => p !== null) && (
            <button
              onClick={goToPreview}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 font-semibold text-lg hover:scale-105 transition-transform"
            >
              Preview Your Photos!
            </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Camera;