import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Download, Palette, Sticker, RotateCcw } from "lucide-react";

function Preview() {
  const location = useLocation();
  const { photos = [], layout = "grid" } = location.state || {};
  
  const [selectedColor, setSelectedColor] = useState("pink");
  const [stickers, setStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [activeTab, setActiveTab] = useState("colors");
  const layoutRef = useRef(null);

  const colorThemes = {
    pink: { bg: "bg-rose-200" },
    rose: { bg: "bg-pink-300" },
    purple: { bg: "bg-purple-300" },
    rosewood: { bg: "bg-[#b76e79]" },
    strawberry: { bg: "bg-[#f87171]" },
    blushTan: { bg: "bg-green-200" },
    cocoa: { bg: "bg-[#a9746e]" },
    lilacCloud: { bg: "bg-[#e0bbe4]" },
    mocha: { bg: "bg-[#bfa191]" },
    indigo: { bg: "bg-indigo-300" },
  };

  const availableStickers = [
    "💖","⭐","💞","✨","💫","🎉","🎊","🎈",
    "🌈","🧁","🎀","💖","💕","😍","😊","😎",
    "🔥","🦋","👑","💎","🐰","🌸","🍒","🍀"
  ];

  const addSticker = (emoji) => {
    const newSticker = {
      id: Date.now(),
      emoji,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      size: 2,
      rotation: 0
    };
    setStickers([...stickers, newSticker]);
  };

  const rotateSticker = (id, angle) => {
    setStickers(stickers.map(sticker =>
      sticker.id === id ? { ...sticker, rotation: (sticker.rotation + angle) % 360 } : sticker
    ));
  };

  const moveSticker = (id, deltaX, deltaY) => {
    setStickers(stickers.map(sticker => 
      sticker.id === id ? { ...sticker, x: sticker.x + deltaX, y: sticker.y + deltaY } : sticker
    ));
  };

  const removeSticker = (id) => {
    setStickers(stickers.filter(sticker => sticker.id !== id));
  };

  const clearAllStickers = () => setStickers([]);

  const downloadPhoto = async () => {
    if (!layoutRef.current) return;

  // Capture the layout div as canvas
  const canvas = await html2canvas(layoutRef.current, { useCORS: true, scale: 2 });
  
  // Convert canvas to PNG URL
  const imgData = canvas.toDataURL("image/png");

  // Create a temporary link element to trigger download
  const link = document.createElement("a");
  link.href = imgData;
  link.download = "my_photo.png";
  link.click();
  };

  const renderStickers = () =>
    stickers.map(sticker => (
      <div
        key={sticker.id}
        className="absolute select-none cursor-move"
        style={{
          left: sticker.x,
          top: sticker.y,
          fontSize: `${sticker.size}rem`,
          zIndex: 10,
          transform: `rotate(${sticker.rotation}deg)`
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedStickerId(sticker.id);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;

          const handleMouseMove = (e) => moveSticker(sticker.id, e.clientX - startX, e.clientY - startY);
          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
        onDoubleClick={() => removeSticker(sticker.id)}
        title="Drag to move, double-click to remove"
      >
        {sticker.emoji}

        {/* Rotate buttons */}
        {selectedStickerId === sticker.id && (
          <div className="flex justify-center gap-1 mt-1">
            <button
              onClick={(e) => { e.stopPropagation(); rotateSticker(sticker.id, -15); }}
              className="bg-white p-1 rounded shadow text-xs hover:bg-gray-100"
              title="Rotate -15°"
            >⟲</button>
            <button
              onClick={(e) => { e.stopPropagation(); rotateSticker(sticker.id, 15); }}
              className="bg-white p-1 rounded shadow text-xs hover:bg-gray-100"
              title="Rotate +15°"
            >⟳</button>
          </div>
        )}
      </div>
    ));

  const renderCustomizedLayout = () => {
    const theme = colorThemes[selectedColor];

    switch (layout) {
      case "single":
        return (
          <div className={`relative w-96 h-72 ${theme.bg} p-6 shadow-xl`} onClick={() => setSelectedStickerId(null)}>
            <img src={photos[0]} alt="Single" className="w-full h-full object-cover rounded-xl" />
            {renderStickers()}
          </div>
        );
      case "strip":
        return (
          <div className={`relative flex flex-col items-center gap-3 p-6 ${theme.bg} shadow-xl`} onClick={() => setSelectedStickerId(null)}>
            {photos.slice(0,3).map((photo,i) => (
              <div key={i} className="w-45 h-30 rounded-lg overflow-hidden">
                <img src={photo} alt={`Strip ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {renderStickers()}
          </div>
        );
      case "grid":
        return (
          <div className={`relative grid grid-cols-2 gap-3 p-6 ${theme.bg} shadow-xl w-96 h-96`} onClick={() => setSelectedStickerId(null)}>
            {photos.slice(0,4).map((photo,i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <img src={photo} alt={`Grid ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {renderStickers()}
          </div>
        );
      case "collage":
        return (
          <div className={`relative grid grid-cols-3 gap-2 p-6 ${theme.bg} shadow-xl w-[500px] h-72`} onClick={() => setSelectedStickerId(null)}>
            {photos.slice(0,6).map((photo,i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <img src={photo} alt={`Collage ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {renderStickers()}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex bg-gradient-to-br bg-pink-100 bg-purple-100" onClick={() => setSelectedStickerId(null)}>

      <div className="absolute top-20 left-90 w-32 h-32 bg-pink-200 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute top-2/3 left-123 right-22 w-24 h-24 bg-purple-200 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute top-2/4 right-51 w-32 h-32 bg-pink-200 rounded-full opacity-60 animate-bounce"></div>

      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">Customize Your Photo</h2>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setActiveTab("colors")} className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors ${activeTab==="colors"?"bg-white text-purple-600 shadow-sm":"text-gray-600 hover:text-purple-600"}`}>
            <Palette className="w-4 h-4 inline mr-2" /> Colors
          </button>
          <button onClick={() => setActiveTab("stickers")} className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors ${activeTab==="stickers"?"bg-white text-purple-600 shadow-sm":"text-gray-600 hover:text-purple-600"}`}>
            <Sticker className="w-4 h-4 inline mr-2" /> Stickers
          </button>
        </div>

        {activeTab==="colors" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Background Color</h3>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {Object.entries(colorThemes).map(([colorName, theme])=>(
                <button key={colorName} onClick={()=>setSelectedColor(colorName)}
                  className={`w-16 h-16 rounded-lg ${theme.bg} hover:scale-110 transition-transform ${selectedColor===colorName?'ring-4 ring-purple-300':''}`}
                  title={colorName.charAt(0).toUpperCase()+colorName.slice(1)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab==="stickers" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Stickers</h3>
              {stickers.length>0 && (
                <button onClick={clearAllStickers} className="text-red-500 hover:text-red-700 text-sm font-medium hover:scale-105 transition-transform">Clear All</button>
              )}
            </div>
            <div className="grid grid-cols-6 gap-2 mb-6">
              {availableStickers.map((emoji,i)=>(
                <button key={i} onClick={() => addSticker(emoji)}
                  className="justify-center hover:scale-110 transition-transform text-2xl p-2 rounded-lg bg-gray-50 hover:bg-pink-100 transition-colors"
                  title={`Add ${emoji}`}
                >{emoji}</button>
              ))}
            </div>
            {stickers.length>0 && (
              <div className="bg-gray-50 rounded-lg p-4 hover:scale-105 transition-transform">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Added Stickers ({stickers.length})</h4>
                <p className="text-xs text-gray-600">💡 Drag stickers to move them, double-click to remove, click to rotate</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons*/}
        <div className="mt-8 space-y-3">
          <button onClick={() => window.history.back()} className="mt-5 w-full py-3 px-4 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 flex items-center justify-center gap-2 hover:scale-105 transition-transform">
            <RotateCcw className="w-5 h-5" /> Back to Camera
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Your Photo Layout</h1>
          <p className="text-gray-600 mb-8 text-lg">Customize colors and add stickers to make it unique!</p>
          
          <div ref={layoutRef} className="inline-block hover:scale-110 transition-transform">
            {renderCustomizedLayout()}
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            Layout: {layout.charAt(0).toUpperCase() + layout.slice(1)} • 
            Color: {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} • 
            Stickers: {stickers.length}
          </div>

          <h1 className="text-xl mt-5 text-gray-500">📸 Your design looks great! You can take a screenshot to keep it.</h1>
        </div>
      </div>
    </div>

    
  );
}

export default Preview;
