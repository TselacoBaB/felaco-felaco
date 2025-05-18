
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface UploadMenuProps {
  onClose: () => void;
}

const UploadMenu = ({ onClose }: UploadMenuProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute bottom-20 left-1/2 w-11/12 max-w-sm -translate-x-1/2 rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Link
            to="/app/upload/post"
            className="rounded-lg bg-gray-100 p-4 text-center transition hover:bg-gray-200"
            onClick={onClose}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-felaco-purple text-white mx-auto mb-2">
              <span className="text-lg font-bold">P</span>
            </div>
            <span className="font-medium">Post</span>
          </Link>
          
          <Link
            to="/app/upload/story"
            className="rounded-lg bg-gray-100 p-4 text-center transition hover:bg-gray-200"
            onClick={onClose}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-felaco-blue text-white mx-auto mb-2">
              <span className="text-lg font-bold">S</span>
            </div>
            <span className="font-medium">Story</span>
          </Link>
          
          <Link
            to="/app/upload/reel"
            className="rounded-lg bg-gray-100 p-4 text-center transition hover:bg-gray-200"
            onClick={onClose}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-felaco-orange text-white mx-auto mb-2">
              <span className="text-lg font-bold">R</span>
            </div>
            <span className="font-medium">Reel</span>
          </Link>
          
          <Link
            to="/app/upload/live"
            className="rounded-lg bg-gray-100 p-4 text-center transition hover:bg-gray-200"
            onClick={onClose}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white mx-auto mb-2">
              <span className="text-lg font-bold">L</span>
            </div>
            <span className="font-medium">Go Live</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadMenu;
