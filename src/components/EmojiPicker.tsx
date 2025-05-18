import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onSelect: (emoji: unknown) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  return (
    <div className="z-50">
      <Picker data={data} onEmojiSelect={onSelect} theme="light" />
    </div>
  );
};

export default EmojiPicker;